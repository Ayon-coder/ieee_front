import { useCallback, useEffect, useRef, useState } from 'react';

/* ─── Global Device Orientation ────────────────────────────────────────────── */
let currentBeta = 45; // Neutral holding angle
let currentGamma = 0;
let hasOrientation = false;

if (typeof window !== 'undefined') {
    window.addEventListener('deviceorientation', (e) => {
        if (e.beta !== null && e.gamma !== null) {
            hasOrientation = true;
            currentBeta = e.beta;
            currentGamma = e.gamma;
        }
    });

    const updateGlobalGyroCSS = () => {
        const drift = getGlobalIdleDrift();
        // Set global CSS variables for all .tilt-3d elements to inherit
        document.documentElement.style.setProperty('--gyro-rx', `${(drift.dy * 12).toFixed(2)}deg`);
        document.documentElement.style.setProperty('--gyro-ry', `${(drift.dx * 12).toFixed(2)}deg`);
        requestAnimationFrame(updateGlobalGyroCSS);
    };
    updateGlobalGyroCSS();
}

export function getGlobalIdleDrift() {
    const t = Date.now() / 2000;
    let dx = Math.sin(t) * 0.5; // -0.5 to 0.5
    let dy = Math.cos(t * 0.8) * 0.5;
    
    if (hasOrientation) {
        // Blend in gyro (assuming 45deg neutral beta)
        const bx = Math.max(-45, Math.min(45, currentBeta - 45)) / 45;
        const gy = Math.max(-45, Math.min(45, currentGamma)) / 45;
        dx = gy;
        dy = -bx;
    }
    return { dx, dy };
}

/* ─── useTilt3D ────────────────────────────────────────────────────────────
   Pointer-driven 3D tilt: rotateX/Y based on mouse position over the element.
   Falls back to device orientation (gyroscope) if mouse is not hovering.
   --------------------------------------------------------------------- */
export type TiltOptions = {
    max?: number;
    scale?: number;
};

export function useTilt3D<T extends HTMLElement = HTMLDivElement>(options: TiltOptions = {}) {
    const { max = 10 } = options;
    const ref = useRef<T | null>(null);

    const handleMove = useCallback((e: React.PointerEvent<T>) => {
        if (e.pointerType === 'touch') return;
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = x / rect.width;
        const py = y / rect.height;
        const rx = (px - 0.5) * (max * 2);
        const ry = (0.5 - py) * (max * 2);
        el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
        el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
        el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
        el.style.setProperty('--shine', '1');
    }, [max]);

    const handleLeave = useCallback((e: React.PointerEvent<T>) => {
        if (e.pointerType === 'touch') return;
        const el = e.currentTarget;
        el.style.removeProperty('--rx');
        el.style.removeProperty('--ry');
        el.style.setProperty('--shine', '0');
    }, []);

    return {
        ref,
        bind: {
            onPointerMove: handleMove,
            onPointerLeave: handleLeave,
        },
    };
}

/* ─── useScrollReveal ─────────────────────────────────────────────────────
   IntersectionObserver-based reveal. Attach the returned ref and add either
   `reveal` or `reveal-stagger` class — the hook flips on `is-visible` when
   the element enters the viewport.
   --------------------------------------------------------------------- */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (typeof IntersectionObserver === 'undefined') {
            el.classList.add('is-visible');
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                    }
                }
            },
            { threshold, rootMargin: '0px 0px -10% 0px' }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [threshold]);

    return ref;
}

/* ─── useCountUp ──────────────────────────────────────────────────────────
   Animates an integer counter when its container scrolls into view.
   Returns [value, ref] — attach ref to any element; counter starts once
   that element is at least `threshold` visible.
   --------------------------------------------------------------------- */
export function useCountUp<T extends HTMLElement = HTMLDivElement>(
    target: number,
    durationMs = 1600,
    threshold = 0.4,
): [number, React.RefObject<T | null>] {
    const ref = useRef<T | null>(null);
    const [value, setValue] = useState(0);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const start = () => {
            if (started.current) return;
            started.current = true;
            const t0 = performance.now();
            const tick = (now: number) => {
                const t = Math.min(1, (now - t0) / durationMs);
                const eased = 1 - Math.pow(1 - t, 3);
                setValue(Math.round(target * eased));
                if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        if (typeof IntersectionObserver === 'undefined') {
            start();
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        start();
                        io.unobserve(entry.target);
                    }
                }
            },
            { threshold }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [target, durationMs, threshold]);

    return [value, ref];
}

/* ─── useParallax ─────────────────────────────────────────────────────────
   Lightweight scroll-driven Y translate. Hook returns a ref and a CSS
   transform value to spread into the target's style.
   --------------------------------------------------------------------- */
export function useParallax<T extends HTMLElement = HTMLDivElement>(strength = 0.15) {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let raf = 0;
        const update = () => {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight || 1;
            const centerOffset = rect.top + rect.height / 2 - vh / 2;
            const y = centerOffset * strength * -1;
            el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
            raf = 0;
        };
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [strength]);

    return ref;
}

/* ─── useScrollProgress ───────────────────────────────────────────────────
   Returns a 0..1 number reflecting how far down the page the user has
   scrolled. Used for the top progress bar.
   --------------------------------------------------------------------- */
export function useScrollProgress(): number {
    const [p, setP] = useState(0);
    useEffect(() => {
        let raf = 0;
        const update = () => {
            const doc = document.documentElement;
            const scrolled = doc.scrollTop || document.body.scrollTop;
            const max = (doc.scrollHeight - doc.clientHeight) || 1;
            setP(Math.min(1, Math.max(0, scrolled / max)));
            raf = 0;
        };
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);
    return p;
}

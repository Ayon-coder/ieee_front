import { useEffect, useRef } from 'react';

// Custom dot+ring cursor. Dot tracks the pointer exactly; ring lerps toward
// it for a smooth trailing effect. All updates go through refs + rAF — no
// React re-renders. Auto-disables on touch devices and reduced-motion users.
const CustomCursor = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Bail on touch devices, mobile, or reduced-motion preference
        if (
            typeof window.matchMedia !== 'function' ||
            window.matchMedia('(pointer: coarse)').matches ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            (typeof window !== 'undefined' && window.innerWidth <= 768)
        ) {
            return;
        }

        const INTERACTIVE_SEL =
            'a, button, [role="button"], summary, label, [data-cursor-hover]';
        const TEXT_SEL = 'input, textarea, [contenteditable="true"]';

        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let ringX = targetX;
        let ringY = targetY;
        let raf = 0;
        let visible = false;
        let clickTimeout = 0;

        const tick = () => {
            raf = 0;
            // ease ring toward target
            ringX += (targetX - ringX) * 0.18;
            ringY += (targetY - ringY) * 0.18;
            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
            }
            if (Math.abs(targetX - ringX) > 0.4 || Math.abs(targetY - ringY) > 0.4) {
                raf = requestAnimationFrame(tick);
            }
        };

        const showCursor = () => {
            if (visible) return;
            visible = true;
            document.body.classList.add('custom-cursor-active');
            if (dotRef.current) dotRef.current.style.opacity = '1';
            if (ringRef.current) ringRef.current.style.opacity = '1';
        };

        const handleMove = (e: PointerEvent) => {
            targetX = e.clientX;
            targetY = e.clientY;
            showCursor();
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
            }
            if (!raf) raf = requestAnimationFrame(tick);
        };

        const handleOver = (e: PointerEvent) => {
            const target = e.target as Element | null;
            if (!target?.closest) return;
            const onText = !!target.closest(TEXT_SEL);
            const onInteractive = !onText && !!target.closest(INTERACTIVE_SEL);

            ringRef.current?.classList.toggle('cursor-ring--hover', onInteractive);
            dotRef.current?.classList.toggle('cursor--hidden', onText);
            ringRef.current?.classList.toggle('cursor--hidden', onText);
        };

        const handleDown = () => {
            ringRef.current?.classList.add('cursor-ring--down');
            if (clickTimeout) window.clearTimeout(clickTimeout);
        };
        const handleUp = () => {
            if (clickTimeout) window.clearTimeout(clickTimeout);
            clickTimeout = window.setTimeout(() => {
                ringRef.current?.classList.remove('cursor-ring--down');
            }, 120);
        };

        const handleLeave = () => {
            visible = false;
            document.body.classList.remove('custom-cursor-active');
            if (dotRef.current) dotRef.current.style.opacity = '0';
            if (ringRef.current) ringRef.current.style.opacity = '0';
        };
        const handleEnter = () => {
            // re-show on next move
        };

        document.addEventListener('pointermove', handleMove, { passive: true });
        document.addEventListener('pointerover', handleOver, { passive: true });
        document.addEventListener('pointerdown', handleDown, { passive: true });
        document.addEventListener('pointerup', handleUp, { passive: true });
        document.documentElement.addEventListener('pointerleave', handleLeave);
        document.documentElement.addEventListener('pointerenter', handleEnter);

        return () => {
            document.removeEventListener('pointermove', handleMove);
            document.removeEventListener('pointerover', handleOver);
            document.removeEventListener('pointerdown', handleDown);
            document.removeEventListener('pointerup', handleUp);
            document.documentElement.removeEventListener('pointerleave', handleLeave);
            document.documentElement.removeEventListener('pointerenter', handleEnter);
            document.body.classList.remove('custom-cursor-active');
            if (raf) cancelAnimationFrame(raf);
            if (clickTimeout) window.clearTimeout(clickTimeout);
        };
    }, []);

    return (
        <>
            <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
            <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
        </>
    );
};

export default CustomCursor;

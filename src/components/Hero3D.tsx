import { useEffect, useRef } from 'react';
import { getGlobalIdleDrift } from '../lib/use3d';

/* ─── Hero3D ──────────────────────────────────────────────────────────────
   Pure CSS 3D wireframe (nested cubes + orbiting dots + tilted rings) layered
   over a canvas particle constellation. No external 3D dependencies — keeps
   the existing IEEE cyan/amber theme intact.
   --------------------------------------------------------------------- */
type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    z: number;
    r: number;
    hue: 'cy' | 'am';
};

const CY = 'rgba(0, 229, 255,';
const AM = 'rgba(255, 184, 77,';

const Hero3D = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const wireRef = useRef<HTMLDivElement | null>(null);

    /* Canvas particle network */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let raf = 0;
        let particles: Particle[] = [];
        let width = 0;
        let height = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            width = parent.clientWidth;
            height = parent.clientHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.min(70, Math.floor((width * height) / 18000));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                z: Math.random() * 1 + 0.3,
                r: Math.random() * 1.6 + 0.4,
                hue: Math.random() > 0.85 ? 'am' : 'cy',
            }));
        };

        const tick = () => {
            ctx.clearRect(0, 0, width, height);

            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < -20) p.x = width + 20;
                if (p.x > width + 20) p.x = -20;
                if (p.y < -20) p.y = height + 20;
                if (p.y > height + 20) p.y = -20;
            }

            /* Connecting lines */
            const linkDist = 130;
            for (let i = 0; i < particles.length; i++) {
                const a = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < linkDist) {
                        const alpha = (1 - d / linkDist) * 0.25 * Math.min(a.z, b.z);
                        ctx.strokeStyle = `${CY} ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            /* Particles */
            for (const p of particles) {
                const tint = p.hue === 'cy' ? CY : AM;
                ctx.fillStyle = `${tint} ${0.55 * p.z})`;
                ctx.shadowColor = p.hue === 'cy' ? '#00e5ff' : '#ffb84d';
                ctx.shadowBlur = 6 * p.z;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;

            raf = requestAnimationFrame(tick);
        };

        resize();
        tick();
        window.addEventListener('resize', resize);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    /* Mouse-driven parallax on the wireframe stage */
    useEffect(() => {
        const stage = wireRef.current;
        if (!stage) return;
        let raf = 0;
        let tx = 0;
        let ty = 0;
        let isHovered = false;

        const onMove = (e: PointerEvent) => {
            if (e.pointerType === 'touch') return;
            isHovered = true;
            const rect = stage.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            tx = ((e.clientX - cx) / rect.width) * 14;
            ty = ((e.clientY - cy) / rect.height) * 14;
        };
        const onLeave = () => { isHovered = false; };
        
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerleave', onLeave);
        
        const tick = () => {
            if (!isHovered) {
                const drift = getGlobalIdleDrift();
                tx = drift.dx * 14;
                ty = drift.dy * 14;
            }
            stage.style.transform = `rotateY(${tx.toFixed(2)}deg) rotateX(${(-ty).toFixed(2)}deg)`;
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        
        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerleave', onLeave);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <canvas ref={canvasRef} className="particle-canvas" />

            <div className="absolute inset-0 wire-stage">
                <div ref={wireRef} className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
                    {/* Outer dashed orbit ring */}
                    <div className="wire-ring r2" />
                    <div className="wire-ring" />

                    {/* Outer cyan cube */}
                    <div className="wire-shape">
                        <div className="wire-face f1" />
                        <div className="wire-face f2" />
                        <div className="wire-face f3" />
                        <div className="wire-face f4" />
                        <div className="wire-face f5" />
                        <div className="wire-face f6" />
                    </div>

                    {/* Inner amber cube */}
                    <div className="wire-core">
                        <div className="wire-face f1" />
                        <div className="wire-face f2" />
                        <div className="wire-face f3" />
                        <div className="wire-face f4" />
                        <div className="wire-face f5" />
                        <div className="wire-face f6" />
                    </div>

                    {/* Orbiting dots */}
                    <div className="orbit-dot" style={{ animationDelay: '0s' }} />
                    <div className="orbit-dot amber" style={{ animationDelay: '-7s' }} />
                    <div className="orbit-dot" style={{ animationDelay: '-12s' }} />
                </div>
            </div>

            {/* Subtle vignette to keep text readable */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at center, transparent 0%, rgba(5,7,13,0.55) 60%, rgba(5,7,13,0.92) 100%)',
                }}
            />
        </div>
    );
};

export default Hero3D;

import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────────────
   Page-specific 3D backdrops. Each one has a unique motion signature so
   every route feels distinct, while reusing the IEEE cyan/amber palette.
   No new dependencies — all CSS 3D + canvas 2D.
   ─────────────────────────────────────────────────────────────────────── */

/* ─── EventsBackdrop ─────────────────────────────────────────────────────
   Stacked, slanted dashed orbit rings rotating in alternating directions —
   a helix-of-rings, evoking schedules circling through time.
   --------------------------------------------------------------------- */
export const EventsBackdrop = () => {
    const stageRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        let raf = 0;
        let tx = 0;
        let ty = 0;
        const onMove = (e: PointerEvent) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            tx = ((e.clientX - cx) / window.innerWidth) * 22;
            ty = ((e.clientY - cy) / window.innerHeight) * 16;
            if (!raf) {
                raf = requestAnimationFrame(() => {
                    stage.style.transform = `rotateY(${tx.toFixed(2)}deg) rotateX(${(70 - ty).toFixed(2)}deg)`;
                    raf = 0;
                });
            }
        };
        window.addEventListener('pointermove', onMove);
        return () => {
            window.removeEventListener('pointermove', onMove);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute inset-0" style={{ perspective: '1600px' }}>
                <div
                    ref={stageRef}
                    className="absolute inset-0"
                    style={{ transformStyle: 'preserve-3d', transform: 'rotateX(70deg)', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)' }}
                >
                    {/* Helix of dashed rings stacked vertically */}
                    {Array.from({ length: 12 }).map((_, i) => {
                        const y = (i - 5.5) * 55;
                        const size = 520 + Math.abs(i - 5.5) * 40;
                        const dur = 18 + i * 2.5;
                        const rev = i % 2 === 0;
                        const accent = i % 3 === 0 ? 'var(--am)' : 'var(--cy)';
                        const opacity = 0.28 + ((12 - Math.abs(i - 5.5)) / 12) * 0.28;
                        return (
                            <div
                                key={i}
                                className="absolute left-1/2 top-1/2"
                                style={{
                                    width: size,
                                    height: size,
                                    marginLeft: -size / 2,
                                    marginTop: -size / 2,
                                    borderRadius: '50%',
                                    border: `${i % 4 === 0 ? 2 : 1}px dashed ${accent}`,
                                    opacity,
                                    transform: `translateZ(${y}px)`,
                                    animation: `events-ring-spin ${dur}s linear infinite${rev ? ' reverse' : ''}`,
                                }}
                            />
                        );
                    })}
                    {/* Floating cube nodes around helix */}
                    {Array.from({ length: 10 }).map((_, i) => {
                        const angle = (i / 10) * Math.PI * 2;
                        const r = 300;
                        const x = Math.cos(angle) * r;
                        const z = Math.sin(angle) * r;
                        const isAmber = i % 4 === 0;
                        return (
                            <div
                                key={i}
                                className="absolute left-1/2 top-1/2"
                                style={{
                                    width: 34,
                                    height: 34,
                                    marginLeft: -17,
                                    marginTop: -17,
                                    border: `1.5px solid ${isAmber ? 'var(--am)' : 'var(--cy)'}`,
                                    background: isAmber ? 'rgba(255,184,77,0.12)' : 'rgba(0,229,255,0.12)',
                                    boxShadow: isAmber ? '0 0 26px rgba(255,184,77,0.45)' : '0 0 26px rgba(0,229,255,0.45)',
                                    transform: `translate3d(${x}px, 0, ${z}px) rotateX(45deg) rotateY(45deg)`,
                                    animation: `events-node-float 5s ease-in-out ${i * 0.4}s infinite`,
                                }}
                            />
                        );
                    })}
                </div>
            </div>
            {/* Soft vignette so content stays readable */}
            <div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(5,7,13,0.65) 70%, rgba(5,7,13,0.95) 100%)' }}
            />
            <style>{`
                @keyframes events-ring-spin {
                    from { transform: translateZ(var(--z, 0px)) rotateZ(0deg); }
                    to   { transform: translateZ(var(--z, 0px)) rotateZ(360deg); }
                }
                @keyframes events-node-float {
                    0%, 100% { transform: translate3d(var(--x,0), -10px, var(--z,0)) rotateX(45deg) rotateY(45deg); }
                    50%      { transform: translate3d(var(--x,0),  10px, var(--z,0)) rotateX(45deg) rotateY(225deg); }
                }
            `}</style>
        </div>
    );
};

/* ─── TeamsBackdrop ──────────────────────────────────────────────────────
   3D constellation: drifting nodes in pseudo-3D space with line connections.
   The cursor warps the field — gentle attraction toward the pointer.
   --------------------------------------------------------------------- */
export const TeamsBackdrop = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let width = 0;
        let height = 0;
        let raf = 0;
        const mouse = { x: -9999, y: -9999, active: false };

        type Node = { x: number; y: number; z: number; vx: number; vy: number; vz: number; hue: 'cy' | 'am' };
        let nodes: Node[] = [];

        const resize = () => {
            const p = canvas.parentElement;
            if (!p) return;
            width = p.clientWidth;
            height = p.clientHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.min(130, Math.floor((width * height) / 9000));
            nodes = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                z: Math.random() * 1.4 + 0.3,
                vx: (Math.random() - 0.5) * 0.55,
                vy: (Math.random() - 0.5) * 0.55,
                vz: (Math.random() - 0.5) * 0.003,
                hue: Math.random() > 0.75 ? 'am' : 'cy',
            }));
        };

        const onMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.active = true;
        };
        const onLeave = () => { mouse.active = false; mouse.x = -9999; mouse.y = -9999; };

        const tick = () => {
            ctx.clearRect(0, 0, width, height);

            for (const n of nodes) {
                n.x += n.vx;
                n.y += n.vy;
                n.z = Math.min(1.6, Math.max(0.3, n.z + n.vz));
                if (n.x < -30) n.x = width + 30;
                if (n.x > width + 30) n.x = -30;
                if (n.y < -30) n.y = height + 30;
                if (n.y > height + 30) n.y = -30;

                if (mouse.active) {
                    const dx = mouse.x - n.x;
                    const dy = mouse.y - n.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < 40000) {
                        const f = (40000 - d2) / 40000 * 0.07;
                        n.vx += (dx / Math.sqrt(d2 || 1)) * f;
                        n.vy += (dy / Math.sqrt(d2 || 1)) * f;
                    }
                }
                n.vx *= 0.985;
                n.vy *= 0.985;
            }

            /* Connecting lines */
            const linkDist = 210;
            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i];
                for (let j = i + 1; j < nodes.length; j++) {
                    const b = nodes[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < linkDist) {
                        const alpha = (1 - d / linkDist) * 0.32 * Math.min(a.z, b.z);
                        ctx.strokeStyle = (a.hue === 'am' || b.hue === 'am')
                            ? `rgba(255,184,77,${alpha})`
                            : `rgba(0,229,255,${alpha})`;
                        ctx.lineWidth = 0.9;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            /* Nodes (sized by z so it feels 3D) */
            for (const n of nodes) {
                const r = 2 + n.z * 2.4;
                const tint = n.hue === 'cy' ? 'rgba(0,229,255,' : 'rgba(255,184,77,';
                ctx.fillStyle = `${tint}${0.65 * n.z})`;
                ctx.shadowColor = n.hue === 'cy' ? '#00e5ff' : '#ffb84d';
                ctx.shadowBlur = 14 * n.z;
                ctx.beginPath();
                ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;

            raf = requestAnimationFrame(tick);
        };

        resize();
        tick();
        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerleave', onLeave);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <canvas ref={canvasRef} className="particle-canvas" />
            {/* Two ambient glows */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full float-y-slow" style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.09), transparent 70%)', filter: 'blur(80px)' }} />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full float-y" style={{ background: 'radial-gradient(circle, rgba(255,184,77,0.07), transparent 70%)', filter: 'blur(80px)' }} />
        </div>
    );
};

/* ─── ContactBackdrop ────────────────────────────────────────────────────
   Pulse rings emanating from a fixed point + horizontal scanlines —
   evokes radio/signal transmission. CSS-only.
   --------------------------------------------------------------------- */
export const ContactBackdrop = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {/* Pulse origin */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full"
                 style={{ background: 'var(--cy)', boxShadow: '0 0 40px var(--cy), 0 0 80px rgba(0,229,255,0.5)' }} />
            {/* Expanding pulses */}
            {Array.from({ length: 7 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute left-1/2 top-1/2 rounded-full"
                    style={{
                        width: 80,
                        height: 80,
                        marginLeft: -40,
                        marginTop: -40,
                        border: '1.5px solid var(--cy)',
                        opacity: 0,
                        animation: `contact-pulse 5s ease-out ${i * 0.7}s infinite`,
                    }}
                />
            ))}
            {/* Amber counter-pulses */}
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={`a${i}`}
                    className="absolute left-1/2 top-1/2 rounded-full"
                    style={{
                        width: 80,
                        height: 80,
                        marginLeft: -40,
                        marginTop: -40,
                        border: '1.5px dashed var(--am)',
                        opacity: 0,
                        animation: `contact-pulse-am 7s ease-out ${i * 1.4 + 0.8}s infinite`,
                    }}
                />
            ))}
            {/* Transmission beams (rotating) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: 1600, height: 1600, animation: 'contact-beam-spin 40s linear infinite' }}>
                {Array.from({ length: 10 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute left-1/2 top-1/2"
                        style={{
                            width: 800,
                            height: 1.5,
                            marginTop: -0.75,
                            transformOrigin: '0 50%',
                            background: `linear-gradient(to right, transparent, ${i % 3 === 0 ? 'rgba(255,184,77,0.25)' : 'rgba(0,229,255,0.3)'}, transparent)`,
                            transform: `rotate(${i * 36}deg)`,
                        }}
                    />
                ))}
            </div>
            {/* Scanline strip */}
            <div className="absolute inset-x-0 h-px" style={{ top: '50%', background: 'linear-gradient(to right, transparent, var(--cy), transparent)', boxShadow: '0 0 16px var(--cy)', animation: 'contact-scan 5s linear infinite' }} />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,7,13,0.7) 80%)' }} />
            <style>{`
                @keyframes contact-pulse {
                    0%   { width: 80px; height: 80px; margin-left: -40px; margin-top: -40px; opacity: 0.75; border-color: rgba(0,229,255,0.7); }
                    100% { width: 1800px; height: 1800px; margin-left: -900px; margin-top: -900px; opacity: 0; border-color: rgba(0,229,255,0); }
                }
                @keyframes contact-pulse-am {
                    0%   { width: 80px; height: 80px; margin-left: -40px; margin-top: -40px; opacity: 0.55; border-color: rgba(255,184,77,0.6); }
                    100% { width: 2000px; height: 2000px; margin-left: -1000px; margin-top: -1000px; opacity: 0; }
                }
                @keyframes contact-beam-spin {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to   { transform: translate(-50%, -50%) rotate(360deg); }
                }
                @keyframes contact-scan {
                    0%   { transform: translateY(-40vh); opacity: 0; }
                    25%  { opacity: 0.9; }
                    75%  { opacity: 0.9; }
                    100% { transform: translateY(40vh); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

/* ─── EventDetailsBackdrop ───────────────────────────────────────────────
   Tilted plane lattice rushing toward viewer — Tron-style grid flowing on
   the floor, plus a horizon line with glow.
   --------------------------------------------------------------------- */
export const EventDetailsBackdrop = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {/* Floor lattice */}
            <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                    bottom: 0,
                    width: '200%',
                    height: '80vh',
                    transform: 'translateX(-50%) perspective(700px) rotateX(60deg)',
                    transformOrigin: 'center bottom',
                    backgroundImage: `
                        linear-gradient(rgba(0,229,255,0.22) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,229,255,0.22) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    animation: 'eventdet-lattice-pan 4.5s linear infinite',
                    maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0.6) 50%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0.6) 50%, transparent 100%)',
                }}
            />
            {/* Ceiling lattice (amber, slower) */}
            <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                    top: 0,
                    width: '200%',
                    height: '60vh',
                    transform: 'translateX(-50%) perspective(700px) rotateX(-60deg)',
                    transformOrigin: 'center top',
                    backgroundImage: `
                        linear-gradient(rgba(255,184,77,0.14) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,184,77,0.14) 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                    animation: 'eventdet-lattice-pan-rev 9s linear infinite',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                }}
            />
            {/* Horizon glow */}
            <div className="absolute inset-x-0 h-[2px]" style={{ top: '50%', background: 'linear-gradient(to right, transparent, var(--cy), transparent)', boxShadow: '0 0 36px var(--cy), 0 0 80px rgba(0,229,255,0.5)' }} />
            {/* Floating amber orb */}
            <div className="absolute left-1/2 -translate-x-1/2 w-32 h-32 rounded-full float-y" style={{ top: 'calc(50% - 90px)', background: 'radial-gradient(circle, rgba(255,184,77,0.4), transparent 70%)', filter: 'blur(20px)' }} />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,7,13,0.6) 80%)' }} />
            <style>{`
                @keyframes eventdet-lattice-pan {
                    from { background-position: 0 0; }
                    to   { background-position: 0 60px; }
                }
                @keyframes eventdet-lattice-pan-rev {
                    from { background-position: 0 0; }
                    to   { background-position: 0 -80px; }
                }
            `}</style>
        </div>
    );
};

/* ─── CertificateBackdrop ───────────────────────────────────────────────
   Translucent blueprint sheets floating in 3D space — gently rotating with
   a vertical scan, evoking certificate authentication.
   --------------------------------------------------------------------- */
export const CertificateBackdrop = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute inset-0" style={{ perspective: '1500px' }}>
                <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', animation: 'cert-stack-rotate 30s linear infinite' }}>
                    {Array.from({ length: 5 }).map((_, i) => {
                        const z = (i - 2) * 80;
                        const rot = (i - 2) * 4;
                        return (
                            <div
                                key={i}
                                className="absolute left-1/2 top-1/2"
                                style={{
                                    width: 380,
                                    height: 260,
                                    marginLeft: -190,
                                    marginTop: -130,
                                    border: `1px solid ${i === 2 ? 'rgba(0,229,255,0.4)' : 'rgba(0,229,255,0.2)'}`,
                                    background: `
                                        linear-gradient(135deg, rgba(0,229,255,0.06), transparent 60%),
                                        repeating-linear-gradient(0deg, rgba(0,229,255,0.05) 0 1px, transparent 1px 28px),
                                        repeating-linear-gradient(90deg, rgba(0,229,255,0.05) 0 1px, transparent 1px 28px)
                                    `,
                                    transform: `translateZ(${z}px) rotateY(${rot}deg) rotateX(${rot * 0.5}deg)`,
                                    boxShadow: '0 12px 40px rgba(0,229,255,0.08), inset 0 0 24px rgba(0,229,255,0.04)',
                                }}
                            >
                                {/* Corner notches */}
                                <div className="absolute top-0 left-0 w-3 h-3" style={{ borderTop: '1px solid var(--cy)', borderLeft: '1px solid var(--cy)' }} />
                                <div className="absolute top-0 right-0 w-3 h-3" style={{ borderTop: '1px solid var(--cy)', borderRight: '1px solid var(--cy)' }} />
                                <div className="absolute bottom-0 left-0 w-3 h-3" style={{ borderBottom: '1px solid var(--cy)', borderLeft: '1px solid var(--cy)' }} />
                                <div className="absolute bottom-0 right-0 w-3 h-3" style={{ borderBottom: '1px solid var(--cy)', borderRight: '1px solid var(--cy)' }} />
                                {/* Seal */}
                                <div className="absolute right-6 bottom-6 w-12 h-12 rounded-full" style={{ border: '1px dashed var(--am)', background: 'radial-gradient(circle, rgba(255,184,77,0.18), transparent 70%)' }} />
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Vertical scan */}
            <div className="absolute inset-y-0 w-px" style={{ left: '50%', background: 'linear-gradient(to bottom, transparent, var(--cy), transparent)', boxShadow: '0 0 14px var(--cy)', animation: 'cert-vscan 6s linear infinite' }} />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,7,13,0.7) 100%)' }} />
            <style>{`
                @keyframes cert-stack-rotate {
                    0%   { transform: rotateY(-10deg) rotateX(8deg); }
                    50%  { transform: rotateY(10deg)  rotateX(-4deg); }
                    100% { transform: rotateY(-10deg) rotateX(8deg); }
                }
                @keyframes cert-vscan {
                    0%   { transform: translateX(-30vw); opacity: 0; }
                    20%  { opacity: 0.9; }
                    80%  { opacity: 0.9; }
                    100% { transform: translateX(30vw); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

/* ─── ChatBackdrop ───────────────────────────────────────────────────────
   Flowing vertical streams of data + soft chat-bubble depth field.
   --------------------------------------------------------------------- */
export const ChatBackdrop = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {/* Data streams */}
            {Array.from({ length: 14 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute top-0 bottom-0"
                    style={{
                        left: `${(i / 13) * 100}%`,
                        width: 1,
                        background: `linear-gradient(to bottom, transparent, ${i % 5 === 0 ? 'var(--am)' : 'var(--cy)'}, transparent)`,
                        opacity: 0.18,
                        animation: `chat-stream ${6 + (i % 5) * 1.2}s linear ${i * 0.4}s infinite`,
                    }}
                />
            ))}
            {/* Soft floating bubbles */}
            {Array.from({ length: 6 }).map((_, i) => {
                const left = 10 + ((i * 73) % 80);
                const top = 15 + ((i * 41) % 70);
                const size = 60 + ((i * 23) % 60);
                return (
                    <div
                        key={`b${i}`}
                        className="absolute rounded-full float-y-slow"
                        style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            width: size,
                            height: size,
                            background: i % 3 === 0
                                ? 'radial-gradient(circle, rgba(255,184,77,0.08), transparent 70%)'
                                : 'radial-gradient(circle, rgba(0,229,255,0.07), transparent 70%)',
                            filter: 'blur(18px)',
                            animationDelay: `${i * 0.7}s`,
                        }}
                    />
                );
            })}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,7,13,0.7) 100%)' }} />
            <style>{`
                @keyframes chat-stream {
                    0%   { transform: translateY(-100%); opacity: 0; }
                    20%  { opacity: 0.8; }
                    80%  { opacity: 0.8; }
                    100% { transform: translateY(100%); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

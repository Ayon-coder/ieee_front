import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import { warmupChat } from '../lib/chatbotApi';
import { cache, setEvents, isEventsCacheFresh } from '../lib/cache';

const SESSION_KEY = 'ieee_site_warmed';
const MIN_DISPLAY_MS = 1800; // minimum so the boot animation actually plays

const BOOT_LINES = [
    '> initiating handshake',
    '> warming chatbot inference layer',
    '> establishing certificate channel',
    '> prefetching event archive',
    '> calibrating context window',
    '> verifying connections',
    '> session ready',
];

type Phase = 'booting' | 'error' | 'done';

const SiteLoader = () => {
    // Skip the loader entirely if we've already warmed up this browser session.
    const initiallySkipped = useRef(
        typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1'
    );
    const [visible, setVisible] = useState(!initiallySkipped.current);
    const [phase, setPhase] = useState<Phase>('booting');
    const [step, setStep] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [fading, setFading] = useState(false);

    useEffect(() => {
        if (initiallySkipped.current) return;

        let cancelled = false;
        const start = Date.now();

        // Animate the boot lines forward over time so the bar feels alive
        // independent of actual network latency.
        const lineTimer = setInterval(() => {
            setStep((s) => (s < BOOT_LINES.length - 1 ? s + 1 : s));
        }, 320);

        // Run all three warmup tasks concurrently. Each is wrapped so a single
        // failure doesn't reject the whole `Promise.all`.
        const tasks = [
            api.healthCheck().catch((err) => ({ __error: err as Error, source: 'certificate' as const })),
            warmupChat().catch((err) => ({ __error: err as Error, source: 'chatbot' as const })),
            api.getEvents().then((events) => {
                setEvents(events);
                return { events };
            }).catch((err) => ({ __error: err as Error, source: 'events' as const })),
        ];

        Promise.all(tasks).then((results) => {
            if (cancelled) return;
            clearInterval(lineTimer);

            const failures = results.filter(
                (r): r is { __error: Error; source: 'certificate' | 'chatbot' | 'events' } =>
                    r !== undefined && '__error' in r
            );

            // Treat a chatbot failure as soft (chat is non-blocking) but
            // certificate/events failure as a hard boot error worth surfacing.
            const hardFailure = failures.find((f) => f.source !== 'chatbot');

            const elapsed = Date.now() - start;
            const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);

            if (hardFailure) {
                setTimeout(() => {
                    if (cancelled) return;
                    setErrorMsg(
                        `Could not reach the ${hardFailure.source} backend. The site can still load — you may have a slower first interaction.`
                    );
                    setPhase('error');
                }, wait);
            } else {
                cache.warmedUp = true;
                setTimeout(() => {
                    if (cancelled) return;
                    setStep(BOOT_LINES.length - 1);
                    setFading(true);
                    setTimeout(() => {
                        if (cancelled) return;
                        sessionStorage.setItem(SESSION_KEY, '1');
                        setVisible(false);
                    }, 450);
                }, wait);
            }
        });

        return () => {
            cancelled = true;
            clearInterval(lineTimer);
        };
    }, []);

    const handleRetry = () => {
        setErrorMsg('');
        setStep(0);
        setPhase('booting');
        // Re-run the effect by clearing the flag and reloading state. Simpler
        // than restructuring — re-mount via key would also work.
        sessionStorage.removeItem(SESSION_KEY);
        window.location.reload();
    };

    const handleContinueAnyway = () => {
        sessionStorage.setItem(SESSION_KEY, '1');
        setFading(true);
        setTimeout(() => setVisible(false), 400);
    };

    if (!visible) return null;

    const progress = Math.round(((step + 1) / BOOT_LINES.length) * 100);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{
                background: 'var(--bg-0)',
                opacity: fading ? 0 : 1,
                transition: 'opacity 0.45s ease',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Initializing IEEE site"
        >
            {/* Backdrop noise + grid (cheap static layer) */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute inset-0" style={{
                    backgroundImage:
                        'linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px),' +
                        'linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
                }} />
                <div className="absolute top-4 left-4 w-10 h-10" style={{ borderTop: '1px solid var(--line-cy)', borderLeft: '1px solid var(--line-cy)' }} />
                <div className="absolute top-4 right-4 w-10 h-10" style={{ borderTop: '1px solid var(--line-cy)', borderRight: '1px solid var(--line-cy)' }} />
                <div className="absolute bottom-4 left-4 w-10 h-10" style={{ borderBottom: '1px solid var(--line-cy)', borderLeft: '1px solid var(--line-cy)' }} />
                <div className="absolute bottom-4 right-4 w-10 h-10" style={{ borderBottom: '1px solid var(--line-cy)', borderRight: '1px solid var(--line-cy)' }} />
            </div>

            <div
                className="relative w-[min(540px,calc(100vw-2rem))] p-8 md:p-10"
                style={{
                    background: 'rgba(13, 19, 32, 0.85)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--line-cy)',
                    clipPath: 'var(--clip-notch)',
                    boxShadow: '0 30px 80px rgba(0,229,255,0.08)',
                }}
            >
                {/* Topbar */}
                <div className="flex items-center gap-2 pb-4 mb-6" style={{ borderBottom: '1px solid var(--line)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--mg)' }} />
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--am)' }} />
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }} />
                    <span className="ml-auto font-mono-ieee text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--txt-3)' }}>
                        ~/ieee/session/new
                    </span>
                </div>

                {phase === 'booting' && (
                    <>
                        <div className="font-mono-ieee text-[10px] tracking-[0.22em] uppercase text-primary mb-3">
                            [BOOTING SESSION · 001]
                        </div>
                        <h2 className="font-display-ieee text-2xl md:text-3xl font-extrabold tracking-tight mb-6">
                            Coming online<span className="text-[var(--cy)]">.</span>
                        </h2>

                        <div className="space-y-1.5 font-mono-ieee text-[12px] mb-6 min-h-[180px]">
                            {BOOT_LINES.slice(0, step + 1).map((line, i) => {
                                const isCurrent = i === step;
                                return (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2"
                                        style={{
                                            opacity: isCurrent ? 1 : 0.55,
                                            transition: 'opacity 0.3s ease',
                                        }}
                                    >
                                        <span style={{ color: 'var(--txt-3)' }}>
                                            [{String(i + 1).padStart(2, '0')}]
                                        </span>
                                        <span style={{ color: isCurrent ? 'var(--cy)' : 'var(--txt-2)' }}>
                                            {line}
                                        </span>
                                        {isCurrent && (
                                            <span
                                                className="inline-block w-1.5 h-3 ml-1"
                                                style={{ background: 'var(--cy)', animation: 'siteloader-cursor 0.8s steps(2,end) infinite' }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="relative h-1 w-full overflow-hidden" style={{ background: 'rgba(0,229,255,0.08)' }}>
                            <div
                                className="absolute inset-y-0 left-0"
                                style={{
                                    width: `${progress}%`,
                                    background: 'linear-gradient(to right, var(--cy), var(--am))',
                                    transition: 'width 0.4s ease',
                                    boxShadow: '0 0 12px rgba(0, 229, 255, 0.5)',
                                }}
                            />
                        </div>
                        <div className="flex justify-between mt-3 font-mono-ieee text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--txt-3)' }}>
                            <span>warming · {progress}%</span>
                            <span>{isEventsCacheFresh() ? 'EVT · OK' : 'EVT · …'}</span>
                        </div>
                    </>
                )}

                {phase === 'error' && (
                    <>
                        <div className="font-mono-ieee text-[10px] tracking-[0.22em] uppercase mb-3" style={{ color: 'var(--mg)' }}>
                            [FAULT · 502]
                        </div>
                        <h2 className="font-display-ieee text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
                            Partial handshake
                        </h2>
                        <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                            {errorMsg}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleRetry}
                                className="btn-gradient px-5 py-3 text-[10px] tracking-[0.18em] uppercase font-bold"
                            >
                                Retry handshake
                            </button>
                            <button
                                onClick={handleContinueAnyway}
                                className="px-5 py-3 font-mono-ieee text-[10px] tracking-[0.18em] uppercase font-bold text-on-surface-variant hover:text-on-surface transition-colors"
                                style={{ border: '1px solid var(--line)' }}
                            >
                                Continue anyway
                            </button>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                @keyframes siteloader-cursor {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default SiteLoader;

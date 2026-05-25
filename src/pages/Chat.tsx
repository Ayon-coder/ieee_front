import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import type { ReactNode, KeyboardEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendChat, warmupChat } from '../lib/chatbotApi';
import type { ChatMessage, ChatMode, ChatSource } from '../lib/chatbotApi';
import { ChatBackdrop } from '../components/PageBackdrops';
import ChatOnboardingModal from '../components/ChatOnboardingModal';

type DisplayMessage = {
    role: 'user' | 'assistant';
    content: string;
    sources?: ChatSource[];
    isWarning?: boolean;
    isRejected?: boolean;
};

const MODES: { key: ChatMode; code: string; label: string; blurb: string }[] = [
    { key: 'deep_dive', code: 'DD-01', label: 'Deep Dive', blurb: 'Ask about IEEE standards, research, or any engineering topic.' },
    { key: 'student_branch', code: 'SB-02', label: 'Student Branch', blurb: 'Ask about IEEE SB AOT events, members, schedules, and activities.' },
];

/* ── Gibberish strike system ────────────────────────────────────────────────
   Mirrors the original chatbot frontend: 3 strikes for nonsense queries (as
   judged by the backend's watcher model), then a 30-minute cooldown. Strike
   state is persisted to localStorage so it survives reloads. */
const STRIKE_KEY = 'ieee_assistant_strikes';
const BAN_KEY = 'ieee_assistant_ban_until';
const MAX_STRIKES = 3;
const BAN_DURATION_MS = 30 * 60 * 1000;

function getStrikes(): number {
    return parseInt(localStorage.getItem(STRIKE_KEY) || '0', 10);
}
function setStrikes(n: number): void {
    localStorage.setItem(STRIKE_KEY, String(n));
}
function getBanUntil(): number {
    return parseInt(localStorage.getItem(BAN_KEY) || '0', 10);
}
function setBan(): void {
    localStorage.setItem(BAN_KEY, String(Date.now() + BAN_DURATION_MS));
    setStrikes(0);
}
function clearBan(): void {
    localStorage.removeItem(BAN_KEY);
    setStrikes(0);
}
function isBanned(): boolean {
    const until = getBanUntil();
    if (!until) return false;
    if (Date.now() >= until) {
        clearBan();
        return false;
    }
    return true;
}
function banRemainingMinutes(): number {
    const until = getBanUntil();
    if (!until) return 0;
    return Math.max(0, Math.ceil((until - Date.now()) / 60000));
}

/* Rotating status messages shown while the deep-dive pipeline runs
   (classifier → search → synthesis). Just visual flavor — the backend
   doesn't actually stream these stages back. */
const STATUS_STEPS = [
    { code: '001', text: 'Request received' },
    { code: '002', text: 'Engaging language model' },
    { code: '003', text: 'Querying IEEE Xplore index' },
    { code: '004', text: 'Synthesizing response' },
    { code: '005', text: 'Verifying sources' },
];

/* Minimal safe inline renderer: bold, italic, inline code, links, line breaks. */
function renderInline(text: string): ReactNode[] {
    const parts: ReactNode[] = [];
    const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|https?:\/\/[^\s)]+)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
        if (match[2] !== undefined) parts.push(<strong key={key++}>{match[2]}</strong>);
        else if (match[3] !== undefined) parts.push(<em key={key++}>{match[3]}</em>);
        else if (match[4] !== undefined) {
            parts.push(
                <code key={key++} className="px-1 py-0.5 rounded bg-black/40 font-mono-ieee text-[0.85em]">
                    {match[4]}
                </code>
            );
        } else {
            parts.push(
                <a
                    key={key++}
                    href={match[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-dotted hover:text-[var(--cy)]"
                >
                    {match[0]}
                </a>
            );
        }
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
}

const MessageRow = memo(function MessageRow({ msg }: { msg: DisplayMessage }) {
    const lines = useMemo(() => msg.content.split('\n'), [msg.content]);
    const isUser = msg.role === 'user';
    const flagged = msg.isWarning || msg.isRejected;
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[78%] md:max-w-[68%] px-4 py-3 text-[14px] leading-relaxed ${
                    isUser
                        ? 'bg-[var(--cy-soft)] border border-[var(--line-cy)] text-[var(--txt)]'
                        : flagged
                            ? 'bg-[rgba(255,61,113,0.06)] border border-[var(--mg)] text-[var(--mg)]'
                            : 'bg-[rgba(13,19,32,0.7)] border border-[var(--line)] text-[var(--txt)]'
                }`}
                style={{
                    clipPath:
                        'polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))',
                }}
            >
                <div className="font-mono-ieee text-[10px] tracking-[0.2em] uppercase mb-1.5 opacity-60">
                    {isUser ? 'You' : msg.isWarning ? 'IEEE Assistant · Warning' : msg.isRejected ? 'IEEE Assistant · Rejected' : 'IEEE Assistant'}
                </div>
                {lines.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap break-words">
                        {renderInline(line)}
                    </div>
                ))}
                {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--line)]">
                        <div className="font-mono-ieee text-[9px] tracking-[0.18em] uppercase opacity-60 mb-1.5">
                            IEEE Refs
                        </div>
                        <ul className="space-y-1">
                            {msg.sources.map((s, i) => (
                                <li key={i}>
                                    <a
                                        href={s.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[12px] text-[var(--cy-dim)] hover:text-[var(--cy)] underline decoration-dotted"
                                        title={s.title}
                                    >
                                        {String(i + 1).padStart(2, '0')} · {s.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
});

const Chat = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<ChatMode>('deep_dive');
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [banned, setBanned] = useState<boolean>(isBanned());
    const [banMins, setBanMins] = useState<number>(banRemainingMinutes());
    const [statusStep, setStatusStep] = useState(0);
    const [showOnboarding, setShowOnboarding] = useState(() => {
        // Only show the onboarding initialization sequence once per session (cleared on tab close)
        return !sessionStorage.getItem('ieee_chat_session_initialized');
    });
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    const handleOnboardingDismiss = useCallback(() => {
        sessionStorage.setItem('ieee_chat_session_initialized', 'true');
        setShowOnboarding(false);
    }, []);

    /* Warmup once on mount (no-op if SiteLoader already warmed it). */
    useEffect(() => {
        warmupChat().catch(() => { /* silent — first request just takes longer */ });
    }, []);

    /* Ban countdown — clears when expired. */
    useEffect(() => {
        if (!banned) return;
        const timer = setInterval(() => {
            if (!isBanned()) {
                setBanned(false);
                setBanMins(0);
                clearInterval(timer);
            } else {
                setBanMins(banRemainingMinutes());
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [banned]);

    /* Status-step rotator: advances every 2.4s while typing, resets when idle. */
    useEffect(() => {
        if (!isTyping) {
            setStatusStep(0);
            return;
        }
        const t = setInterval(() => {
            setStatusStep((s) => (s < STATUS_STEPS.length - 1 ? s + 1 : s));
        }, 2400);
        return () => clearInterval(t);
    }, [isTyping]);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, isTyping]);

    useEffect(() => {
        const t = setTimeout(() => inputRef.current?.focus(), 250);
        return () => clearTimeout(t);
    }, []);

    const appendAssistant = useCallback((msg: Omit<DisplayMessage, 'role'>) => {
        setMessages((prev) => [...prev, { role: 'assistant', ...msg }]);
    }, []);

    const handleSend = useCallback(async () => {
        const text = input.trim();
        if (!text || isTyping) return;

        // Re-check ban at send time in case it expired while typing.
        if (isBanned()) {
            setBanned(true);
            const mins = banRemainingMinutes();
            appendAssistant({
                content: `🚫 You're on cooldown for ${mins} more minute${mins !== 1 ? 's' : ''}. Please come back later.`,
                isWarning: true,
            });
            return;
        }

        setInput('');
        if (inputRef.current) inputRef.current.style.height = 'auto';

        const userMsg: DisplayMessage = { role: 'user', content: text };
        setMessages((prev) => [...prev, userMsg]);

        const newHistory: ChatMessage[] = [...history, { role: 'user', content: text }];
        setHistory(newHistory);
        setIsTyping(true);

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const data = await sendChat(newHistory, mode, controller.signal);
            const content = data.choices?.[0]?.message?.content ?? 'Sorry, no response.';

            // ── Watcher caught a gibberish/abuse query → strike. ──
            if (data.is_warning) {
                const strikes = getStrikes() + 1;
                setStrikes(strikes);

                if (strikes >= MAX_STRIKES) {
                    setBan();
                    setBanned(true);
                    appendAssistant({
                        content: `🚫 Too many nonsense messages. You've been placed on a 30-minute cooldown.`,
                        isWarning: true,
                    });
                } else {
                    const remaining = MAX_STRIKES - strikes;
                    appendAssistant({
                        content: `⚠️ Warning ${strikes}/${MAX_STRIKES}: Please send meaningful queries. ${remaining} more warning${remaining !== 1 ? 's' : ''} before cooldown.`,
                        isWarning: true,
                    });
                }
                return;
            }

            // ── Classifier rejected the query (non-technical / casual). ──
            if (data.is_rejected) {
                appendAssistant({ content, isRejected: true });
                return;
            }

            // ── Normal answer. Track in history so the model has memory. ──
            appendAssistant({ content, sources: data.sources });
            setHistory((prev) => [...prev, { role: 'assistant', content }]);
        } catch (err) {
            if ((err as Error).name === 'AbortError') return;
            appendAssistant({
                content: 'Could not reach the chatbot service. Please try again shortly.',
            });
        } finally {
            setIsTyping(false);
        }
    }, [input, isTyping, history, mode, appendAssistant]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    const handleInput = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        const ta = e.target;
        ta.style.height = 'auto';
        ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }, []);

    const handleModeSwitch = useCallback(
        (newMode: ChatMode) => {
            if (newMode === mode) return;
            setMode(newMode);
            setMessages([]);
            setHistory([]);
        },
        [mode]
    );

    const activeMode = MODES.find((m) => m.key === mode) ?? MODES[0];
    const currentStatus = STATUS_STEPS[statusStep];
    const statusProgress = ((statusStep + 1) / STATUS_STEPS.length) * 100;
    const inputDisabled = isTyping || banned;

    return (
        <main className="relative pt-0 md:pt-20 pb-0 md:pb-6 h-[100dvh] md:min-h-screen flex flex-col overflow-hidden md:overflow-visible">
            <div className="absolute inset-0 -z-10">
                <ChatBackdrop />
            </div>

            <div className="max-w-5xl w-full mx-auto px-0 md:px-8 flex-1 flex flex-col min-h-0">
                {/* Header (Desktop Only) */}
                <header className="hidden md:flex items-center justify-between pb-4 mb-4" style={{ borderBottom: '1px solid var(--line)' }}>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                            style={{ border: '1px solid var(--line)' }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line-cy)')}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line)')}
                            aria-label="Back"
                        >
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="status-dot" />
                            <span className="font-display-ieee font-bold text-[18px] tracking-tight">
                                IEEE Assistant<span className="text-[var(--cy)]">.</span>
                            </span>
                            <span className="font-mono-ieee text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--txt-3)' }}>
                                IEEE Assistant
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {MODES.map((m) => {
                            const active = m.key === mode;
                            return (
                                <button
                                    key={m.key}
                                    onClick={() => handleModeSwitch(m.key)}
                                    className={`px-3 py-1.5 font-mono-ieee text-[10px] tracking-[0.18em] uppercase transition-colors ${
                                        active
                                            ? 'text-[var(--cy)] bg-[var(--cy-soft)] border border-[var(--line-cy)]'
                                            : 'text-[var(--txt-3)] hover:text-[var(--txt-2)] border border-[var(--line)]'
                                    }`}
                                >
                                    <span className="opacity-60 mr-1">{m.code}</span>
                                    {m.label}
                                </button>
                            );
                        })}
                    </div>
                </header>

                {/* macOS & Cyberpunk Style Window Panel (Full-screen on mobile) */}
                <div className="relative flex-1 flex flex-col bg-[rgba(13,19,32,0.8)] border-y md:border border-[var(--line-cy)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-md rounded-none mb-0 md:mb-6 min-h-0 overflow-hidden animate-fade-in">
                    {/* Window Titlebar */}
                    <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-3 border-b border-[var(--line)] bg-[rgba(0,229,255,0.03)] font-mono-ieee text-[11px] text-[var(--txt-3)] select-none">
                        {/* Left Side: Back button + Traffic light dots */}
                        <div className="flex items-center gap-3">
                            {/* Compact Back Arrow (Mobile Only) */}
                            <button
                                onClick={() => navigate(-1)}
                                className="md:hidden w-7 h-7 flex items-center justify-center border border-[var(--line)] hover:text-primary transition-colors bg-black/20"
                                aria-label="Back"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                            </button>

                            <div className="hidden sm:flex items-center gap-1.5 mr-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ff3d71]/80" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ffb84d]/80" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/80" />
                            </div>
                        </div>
                        
                        {/* Center Side: Path / Title */}
                        <div className="flex-1 text-center md:text-left truncate font-medium">
                            ~/ieee-assistant/channels/{mode}
                        </div>
                        
                        {/* Right Side: Status or Compact Switcher (Mobile Only) */}
                        <div className="flex items-center gap-2">
                            {/* Desktop only status */}
                            <div className="font-mono-ieee text-[9px] tracking-widest text-[var(--cy)] uppercase hidden md:block">
                                SECURE CONNECTION // {activeMode.code}
                            </div>
                            
                            {/* Mobile compact switcher */}
                            <div className="flex md:hidden items-center border border-[var(--line)] bg-[rgba(5,7,13,0.5)] p-0.5">
                                {MODES.map((m) => {
                                    const active = m.key === mode;
                                    return (
                                        <button
                                            key={m.key}
                                            onClick={() => handleModeSwitch(m.key)}
                                            className={`px-2 py-1 text-[9px] tracking-wider uppercase transition-colors ${
                                                active
                                                    ? 'text-[var(--cy)] bg-[var(--cy-soft)] font-bold'
                                                    : 'text-[var(--txt-3)]'
                                            }`}
                                        >
                                            {m.key === 'deep_dive' ? 'DD' : 'SB'}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Window Content */}
                    <div className="flex-1 flex flex-col p-3 md:p-6 min-h-0 overflow-hidden relative">
                        {/* Corner Accents */}
                        <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--cy)] pointer-events-none" />
                        <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--cy)] pointer-events-none" />
                        <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--cy)] pointer-events-none" />
                        <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--cy)] pointer-events-none" />

                        {/* Ban banner */}
                        {banned && (
                            <div
                                className="flex items-center gap-3 px-4 py-3 mb-3 relative z-10 animate-fade-in"
                                style={{
                                    background: 'rgba(255,61,113,0.08)',
                                    border: '1px solid var(--mg)',
                                    borderLeftWidth: '3px',
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--mg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                                </svg>
                                <div className="flex-1">
                                    <div className="font-mono-ieee text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--mg)' }}>
                                        Session locked
                                    </div>
                                    <div className="text-[13px]" style={{ color: 'var(--txt-2)' }}>
                                        Cooldown: <strong style={{ color: 'var(--mg)' }}>{banMins}</strong> minute{banMins !== 1 ? 's' : ''} remaining
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto py-4 space-y-4 pr-1">
                            {messages.length === 0 && !isTyping && (
                                <div className="text-center pt-16 px-4 reveal-stagger is-visible">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-8" style={{ border: '1px solid rgba(0,229,255,0.2)', background: 'rgba(0,229,255,0.05)' }}>
                                        <div className="status-dot" />
                                        <span className="font-mono-ieee text-[10px] tracking-[0.22em] uppercase text-primary">[{activeMode.code}] Online</span>
                                    </div>
                                    <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
                                        Talk to the <span className="text-gradient">IEEE Assistant</span>
                                    </h1>
                                    <p className="max-w-xl mx-auto text-on-surface-variant text-base leading-relaxed">
                                        {activeMode.blurb}
                                    </p>
                                    <div className="mt-10 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                                        {(mode === 'deep_dive'
                                            ? ['What is the IEEE 802.11ax standard?', 'Explain transformer attention.', 'Compare 5G and 6G architectures.']
                                            : ['When is the next workshop?', 'Who is the chairperson?', 'What events are upcoming?']
                                        ).map((q) => (
                                            <button
                                                key={q}
                                                onClick={() => { setInput(q); inputRef.current?.focus(); }}
                                                className="px-3 py-2 text-[12px] text-on-surface-variant hover:text-primary transition-colors"
                                                style={{ border: '1px solid var(--line)', background: 'rgba(13,19,32,0.5)' }}
                                                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line-cy)')}
                                                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line)')}
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <MessageRow key={i} msg={msg} />
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    {mode === 'deep_dive' ? (
                                        <div
                                            className="px-4 py-3 bg-[rgba(13,19,32,0.7)] border border-[var(--line-cy)] min-w-[260px]"
                                            style={{
                                                clipPath:
                                                    'polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))',
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-mono-ieee text-[10px] tracking-[0.22em] uppercase text-primary">
                                                    STEP {currentStatus.code}/005
                                                </span>
                                                <span className="dot-bounce" />
                                            </div>
                                            <div key={statusStep} className="text-[13px] font-mono-ieee" style={{ animation: 'chat-shift 0.4s ease-out' }}>
                                                {currentStatus.text}
                                            </div>
                                            <div className="relative h-0.5 mt-3 overflow-hidden" style={{ background: 'rgba(0,229,255,0.08)' }}>
                                                <div
                                                    className="absolute inset-y-0 left-0 transition-all"
                                                    style={{
                                                        width: `${statusProgress}%`,
                                                        background: 'linear-gradient(to right, var(--cy), var(--am))',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="px-4 py-3 bg-[rgba(13,19,32,0.7)] border border-[var(--line)] flex items-center gap-1.5"
                                            style={{
                                                clipPath:
                                                    'polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))',
                                            }}
                                        >
                                            <span className="font-mono-ieee text-[10px] tracking-[0.2em] uppercase opacity-60 mr-1">
                                                IEEE ASSISTANT · composing
                                            </span>
                                            <span className="dot-bounce" />
                                            <span className="dot-bounce" style={{ animationDelay: '120ms' }} />
                                            <span className="dot-bounce" style={{ animationDelay: '240ms' }} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Composer */}
                        <div className="pt-4 pb-2 flex items-end gap-3" style={{ borderTop: '1px solid var(--line)' }}>
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={handleInput}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                placeholder={
                                    banned ? 'Session locked…' :
                                    isTyping ? 'IEEE Assistant is thinking…' :
                                    'Message the IEEE Assistant…'
                                }
                                disabled={inputDisabled}
                                className="flex-1 bg-transparent border border-[var(--line)] px-4 py-3 text-[14px] resize-none outline-none focus:border-[var(--line-cy)] disabled:opacity-50"
                                style={{ maxHeight: 200, color: 'var(--txt)', fontFamily: 'var(--font-body)', background: 'rgba(5,7,13,0.6)' }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || inputDisabled}
                                className="btn-gradient px-5 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Send"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M13 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <p className="font-mono-ieee text-[9px] tracking-[0.18em] uppercase text-center mt-2" style={{ color: 'var(--txt-3)' }}>
                            Press Enter to send · Shift+Enter for new line
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .dot-bounce {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: var(--cy-dim);
                    animation: chatbotDot 1.1s ease-in-out infinite;
                }
                @keyframes chatbotDot {
                    0%, 100% { opacity: 0.3; transform: translateY(0); }
                    50%      { opacity: 1; transform: translateY(-3px); }
                }
                @keyframes chat-shift {
                    from { opacity: 0; transform: translateX(-6px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>

            {showOnboarding && (
                <ChatOnboardingModal 
                    onDismiss={handleOnboardingDismiss}
                />
            )}
        </main>
    );
};

export default Chat;

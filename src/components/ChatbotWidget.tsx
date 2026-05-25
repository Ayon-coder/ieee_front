import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import type { ReactNode, KeyboardEvent, ChangeEvent } from 'react';
import { sendChat, warmupChat } from '../lib/chatbotApi';
import type { ChatMessage, ChatMode, ChatSource } from '../lib/chatbotApi';

type DisplayMessage = {
    role: 'user' | 'assistant';
    content: string;
    sources?: ChatSource[];
    isWarning?: boolean;
};

const MODES: { key: ChatMode; code: string; label: string }[] = [
    { key: 'deep_dive', code: 'DD-01', label: 'Deep Dive' },
    { key: 'student_branch', code: 'SB-02', label: 'Student Branch' },
];

// Minimal safe inline renderer: bold, italic, inline code, links, line breaks.
// No external markdown dep — handles common AI output without XSS.
function renderInline(text: string): ReactNode[] {
    const parts: ReactNode[] = [];
    const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|https?:\/\/[^\s)]+)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }
        if (match[2] !== undefined) {
            parts.push(<strong key={key++}>{match[2]}</strong>);
        } else if (match[3] !== undefined) {
            parts.push(<em key={key++}>{match[3]}</em>);
        } else if (match[4] !== undefined) {
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
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[85%] px-3 py-2 text-[13px] leading-relaxed ${
                    isUser
                        ? 'bg-[var(--cy-soft)] border border-[var(--line-cy)] text-[var(--txt)]'
                        : 'bg-[rgba(13,19,32,0.55)] border border-[var(--line)] text-[var(--txt)]'
                } ${msg.isWarning ? 'border-[var(--mg)] text-[var(--mg)]' : ''}`}
                style={{
                    clipPath:
                        'polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))',
                }}
            >
                <div className="font-mono-ieee text-[9px] tracking-[0.18em] uppercase mb-1 opacity-60">
                    {isUser ? 'You' : 'Vai'}
                </div>
                {lines.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap break-words">
                        {renderInline(line)}
                    </div>
                ))}
                {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[var(--line)]">
                        <div className="font-mono-ieee text-[9px] tracking-[0.18em] uppercase opacity-60 mb-1">
                            IEEE Refs
                        </div>
                        <ul className="space-y-1">
                            {msg.sources.map((s, i) => (
                                <li key={i}>
                                    <a
                                        href={s.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] text-[var(--cy-dim)] hover:text-[var(--cy)] underline decoration-dotted"
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

const ChatbotWidget = () => {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<ChatMode>('deep_dive');
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [warmedUp, setWarmedUp] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    // Warmup the backend the first time the widget opens (cold start mitigation).
    useEffect(() => {
        if (!open || warmedUp) return;
        warmupChat()
            .then(() => setWarmedUp(true))
            .catch(() => {
                // silent fail — user can still try chatting; the cold first request
                // will simply take longer.
            });
    }, [open, warmedUp]);

    useEffect(() => {
        if (!open) return;
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, isTyping, open]);

    useEffect(() => {
        if (open) {
            // small delay to wait for transition end before focusing
            const t = setTimeout(() => inputRef.current?.focus(), 200);
            return () => clearTimeout(t);
        }
    }, [open]);

    const handleSend = useCallback(async () => {
        const text = input.trim();
        if (!text || isTyping) return;

        setInput('');
        if (inputRef.current) inputRef.current.style.height = 'auto';

        const userMsg: DisplayMessage = { role: 'user', content: text };
        setMessages((prev) => [...prev, userMsg]);

        const newHistory: ChatMessage[] = [...history, { role: 'user', content: text }];
        setHistory(newHistory);
        setIsTyping(true);

        // Cancel any in-flight request
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const data = await sendChat(newHistory, mode, controller.signal);
            const content = data.choices?.[0]?.message?.content ?? 'Sorry, no response.';

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content,
                    sources: data.sources,
                    isWarning: data.is_warning,
                },
            ]);

            if (!data.is_warning) {
                setHistory((prev) => [...prev, { role: 'assistant', content }]);
            }
        } catch (err) {
            if ((err as Error).name === 'AbortError') return;
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Could not reach the chatbot service. Please try again shortly.',
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    }, [input, isTyping, history, mode]);

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
        ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }, []);

    const handleModeSwitch = useCallback((newMode: ChatMode) => {
        if (newMode === mode) return;
        setMode(newMode);
        setMessages([]);
        setHistory([]);
    }, [mode]);

    return (
        <>
            {/* Floating launcher button */}
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close chatbot' : 'Open chatbot'}
                className="fixed bottom-5 right-5 z-[60] w-14 h-14 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                style={{
                    background: 'var(--cy)',
                    color: 'var(--bg-0)',
                    boxShadow: '0 6px 28px rgba(0, 229, 255, 0.45)',
                    clipPath:
                        'polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))',
                }}
            >
                {open ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="6" y1="6" x2="18" y2="18" />
                        <line x1="6" y1="18" x2="18" y2="6" />
                    </svg>
                ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
            </button>

            {/* Chat panel */}
            {open && (
                <div
                    className="fixed bottom-24 right-5 z-[59] w-[min(380px,calc(100vw-2.5rem))] h-[min(560px,calc(100vh-8rem))] flex flex-col glass-panel corner-accent"
                    style={{
                        clipPath: 'var(--clip-notch)',
                        animation: 'chatbotIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--line)]">
                        <div className="flex items-center gap-2">
                            <div className="status-dot" />
                            <span className="font-display-ieee font-bold text-[14px] tracking-tight">
                                Vai<span className="text-[var(--cy)]">.</span>
                            </span>
                            <span className="font-mono-ieee text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--txt-3)' }}>
                                IEEE Assistant
                            </span>
                        </div>
                    </div>

                    {/* Mode switch */}
                    <div className="flex border-b border-[var(--line)]">
                        {MODES.map((m) => {
                            const active = m.key === mode;
                            return (
                                <button
                                    key={m.key}
                                    onClick={() => handleModeSwitch(m.key)}
                                    className={`flex-1 px-3 py-2 font-mono-ieee text-[9px] tracking-[0.18em] uppercase transition-colors ${
                                        active
                                            ? 'text-[var(--cy)] bg-[var(--cy-soft)]'
                                            : 'text-[var(--txt-3)] hover:text-[var(--txt-2)]'
                                    }`}
                                >
                                    <span className="opacity-60 mr-1">{m.code}</span>
                                    {m.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                        {messages.length === 0 && !isTyping && (
                            <div className="text-center pt-6 pb-2 px-2">
                                <div className="font-mono-ieee text-[10px] tracking-[0.22em] uppercase mb-2" style={{ color: 'var(--txt-3)' }}>
                                    [{mode === 'deep_dive' ? 'DD-01' : 'SB-02'}] Online
                                </div>
                                <div className="text-[13px]" style={{ color: 'var(--txt-2)' }}>
                                    {mode === 'deep_dive'
                                        ? 'Ask me anything about IEEE standards, research, or engineering topics.'
                                        : 'Ask about IEEE SB AOT events, members, schedules, and activities.'}
                                </div>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <MessageRow key={i} msg={msg} />
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="px-3 py-2 bg-[rgba(13,19,32,0.55)] border border-[var(--line)] flex items-center gap-1.5"
                                     style={{
                                         clipPath:
                                             'polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))',
                                     }}
                                >
                                    <span className="dot-bounce" />
                                    <span className="dot-bounce" style={{ animationDelay: '120ms' }} />
                                    <span className="dot-bounce" style={{ animationDelay: '240ms' }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Composer */}
                    <div className="border-t border-[var(--line)] p-2 flex items-end gap-2">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            placeholder={isTyping ? 'Vai is thinking…' : 'Message Vai…'}
                            disabled={isTyping}
                            className="flex-1 bg-transparent border border-[var(--line)] px-3 py-2 text-[13px] resize-none outline-none focus:border-[var(--line-cy)] disabled:opacity-50"
                            style={{ maxHeight: 120, color: 'var(--txt)', fontFamily: 'var(--font-body)' }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="btn-gradient px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Send"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M13 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes chatbotIn {
                    from { opacity: 0; transform: translateY(16px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .dot-bounce {
                    width: 5px; height: 5px; border-radius: 50%;
                    background: var(--cy-dim);
                    animation: chatbotDot 1.1s ease-in-out infinite;
                }
                @keyframes chatbotDot {
                    0%, 100% { opacity: 0.3; transform: translateY(0); }
                    50%      { opacity: 1; transform: translateY(-3px); }
                }
            `}</style>
        </>
    );
};

export default ChatbotWidget;

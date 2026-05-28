import { useState, useRef, useCallback, useEffect, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { sendChat, warmupChat } from '../lib/chatbotApi';
import type { ChatMessage, ChatMode, ChatSource } from '../lib/chatbotApi';
import { ChatBackdrop } from '../components/PageBackdrops';
import ChatOnboardingModal from '../components/ChatOnboardingModal';
import '../styles/ChatPage.css';

/* ── Mode configuration ──────────────────────────────────────────────────── */
type ModeContent = {
    label: string;
    code: string;
    description: string;
    suggestions: string[];
};

const MODE_CONTENT: Record<ChatMode, ModeContent> = {
    deep_dive: {
        label: 'Deep Dive',
        code: 'DD-01',
        description: 'Technical research, IEEE standards, and global engineering trends.',
        suggestions: [
            'Explain IEEE 802.11 standard',
            'Latest trends in 6G research',
            'IEEE 754 floating point guide',
        ],
    },
    student_branch: {
        label: 'Student Branch',
        code: 'SB-02',
        description: 'IEEE Student Branch events, membership, and activities.',
        suggestions: [
            'Upcoming branch events',
            'Current committee members',
            'Membership benefits',
        ],
    },
};

/* ── Strike / ban system ─────────────────────────────────────────────────── */
const STRIKE_KEY = 'ieee_assistant_strikes';
const BAN_KEY = 'ieee_assistant_ban_until';
const MAX_STRIKES = 3;
const BAN_DURATION_MS = 30 * 60 * 1000;

function getStrikes(): number  { return parseInt(localStorage.getItem(STRIKE_KEY) || '0', 10); }
function setStrikes(n: number) { localStorage.setItem(STRIKE_KEY, String(n)); }
function getBanUntil(): number { return parseInt(localStorage.getItem(BAN_KEY) || '0', 10); }
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
    if (Date.now() >= until) { clearBan(); return false; }
    return true;
}
function banRemainingMinutes(): number {
    const until = getBanUntil();
    if (!until) return 0;
    return Math.max(0, Math.ceil((until - Date.now()) / 60000));
}

/* ── Message type ────────────────────────────────────────────────────────── */
type DisplayMessage = {
    role: 'user' | 'assistant';
    content: string;
    sources?: ChatSource[];
    timestamp: Date;
};

/* ── Status steps (Deep Dive loader) ─────────────────────────────────────── */
const STATUS_STEPS = [
    { code: '001', text: 'Request received' },
    { code: '002', text: 'Engaging language model' },
    { code: '003', text: 'Querying IEEE Xplore index' },
    { code: '004', text: 'Synthesizing response' },
    { code: '005', text: 'Verifying sources' },
];

/* ── Markdown renderer: convert assistant content to safe HTML ───────────── */
function renderMarkdown(content: string): string {
    // Basic but safe markdown → HTML conversion (no external dep needed)
    let html = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Code blocks first (protect inner content)
    html = html.replace(/```[\s\S]*?```/g, (match) => {
        const inner = match.slice(3, -3).replace(/^\w*\n/, '');
        return `<pre><code>${inner}</code></pre>`;
    });

    // Headings
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold / italic / inline code
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Blockquotes
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

    // Unordered lists
    html = html.replace(/((?:^[*\-] .+\n?)+)/gm, (match) => {
        const items = match.trim().split('\n').map(l => `<li>${l.replace(/^[*\-] /, '')}</li>`).join('');
        return `<ul>${items}</ul>`;
    });

    // Ordered lists
    html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (match) => {
        const items = match.trim().split('\n').map(l => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('');
        return `<ol>${items}</ol>`;
    });

    // Paragraphs — wrap lines not already wrapped
    html = html
        .split('\n\n')
        .map(block => {
            const b = block.trim();
            if (!b) return '';
            if (/^<(h[1-6]|ul|ol|pre|blockquote)/.test(b)) return b;
            return `<p>${b.replace(/\n/g, '<br/>')}</p>`;
        })
        .join('\n');

    return html;
}

/* ── MessageBubble ───────────────────────────────────────────────────────── */
const MessageBubble = memo(function MessageBubble({
    role, content, sources = [], timestamp,
}: {
    role: 'user' | 'assistant';
    content: string;
    sources?: ChatSource[];
    timestamp: Date;
}) {
    const timeStr = useMemo(() => {
        const d = timestamp ?? new Date();
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }, [timestamp]);

    const renderedContent = useMemo(
        () => role === 'assistant' ? renderMarkdown(content) : null,
        [role, content]
    );

    return (
        <div className={`msg msg--${role}`} role="article" aria-label={`${role === 'user' ? 'Your' : 'AI'} message`}>
            <div className="msg__rail" aria-hidden="true">
                <span className="msg__rail-tick" />
                <span className="msg__rail-line" />
                <span className="msg__rail-tick" />
            </div>

            <div className="msg__body">
                <div className="msg__meta">
                    <span className="msg__author">
                        {role === 'user' ? 'USER' : 'IEEE ASSISTANT'}
                        <span className="msg__author-dot" />
                    </span>
                    <span className="msg__time">{timeStr}</span>
                </div>

                <div className="msg__panel">
                    <span className="msg__corner msg__corner--tl" aria-hidden="true" />
                    <span className="msg__corner msg__corner--tr" aria-hidden="true" />
                    <span className="msg__corner msg__corner--bl" aria-hidden="true" />
                    <span className="msg__corner msg__corner--br" aria-hidden="true" />

                    <div className="msg__content">
                        {role === 'assistant'
                            ? <div dangerouslySetInnerHTML={{ __html: renderedContent! }} />
                            : <span>{content}</span>
                        }
                    </div>

                    {sources.length > 0 && (
                        <div className="msg__sources">
                            <span className="msg__sources-label">
                                <span className="msg__sources-bracket">[</span>
                                VERIFIED IEEE REFERENCES
                                <span className="msg__sources-bracket">]</span>
                            </span>
                            <ul className="msg__sources-list">
                                {sources.map((src, idx) => (
                                    <li key={idx} className="msg__source">
                                        <a href={src.link} target="_blank" rel="noopener noreferrer" title={src.title}>
                                            <span className="msg__source-idx">{String(idx + 1).padStart(2, '0')}</span>
                                            <span className="msg__source-title">{src.title}</span>
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <path d="M7 17L17 7M17 7H7M17 7V17" />
                                            </svg>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

/* ── SuggestionChip ──────────────────────────────────────────────────────── */
const SuggestionChip = memo(function SuggestionChip({
    text, index, onClick, disabled,
}: {
    text: string; index: number; onClick: (t: string) => void; disabled: boolean;
}) {
    return (
        <button
            className={`sugg${disabled ? ' sugg--disabled' : ''}`}
            onClick={() => !disabled && onClick(text)}
            disabled={disabled}
            aria-label={`Suggestion: ${text}`}
            type="button"
            style={{ '--i': index } as React.CSSProperties}
        >
            <span className="sugg__corner sugg__corner--tl" aria-hidden="true" />
            <span className="sugg__corner sugg__corner--tr" aria-hidden="true" />
            <span className="sugg__corner sugg__corner--bl" aria-hidden="true" />
            <span className="sugg__corner sugg__corner--br" aria-hidden="true" />
            <span className="sugg__idx">{String(index + 1).padStart(2, '0')}</span>
            <span className="sugg__text">{text}</span>
            <span className="sugg__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
            </span>
        </button>
    );
});

/* ── DeepDiveLoader ──────────────────────────────────────────────────────── */
function DeepDiveLoader({ step }: { step: number }) {
    const current = STATUS_STEPS[step];
    return (
        <div className="cw-loader">
            <div className="cw-loader__inner">
                <div className="cw-loader__corner cw-loader__corner--tl" aria-hidden="true" />
                <div className="cw-loader__corner cw-loader__corner--tr" aria-hidden="true" />
                <div className="cw-loader__corner cw-loader__corner--bl" aria-hidden="true" />
                <div className="cw-loader__corner cw-loader__corner--br" aria-hidden="true" />
                <div className="cw-loader__head">
                    <span>STEP {current.code}/005</span>
                    <span className="cw-loader__dot" aria-hidden="true" />
                </div>
                <div className="cw-loader__text" key={step}>{current.text}</div>
                <div className="cw-loader__progress" aria-hidden="true">
                    <span style={{ width: `${((step + 1) / STATUS_STEPS.length) * 100}%` }} />
                </div>
            </div>
        </div>
    );
}

/* ── Chat page ───────────────────────────────────────────────────────────── */
function Chat() {
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [mode, setMode] = useState<ChatMode>('deep_dive');
    const [isTyping, setIsTyping] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(() =>
        !sessionStorage.getItem('ieee_chat_session_initialized')
    );
    const [showGuideTooltip, setShowGuideTooltip] = useState(false);
    const [isReady, setIsReady] = useState(() =>
        !!sessionStorage.getItem('ieee_chat_session_initialized')
    );
    const [banned, setBanned] = useState(isBanned());
    const [banMins, setBanMins] = useState(banRemainingMinutes());
    const [statusStep, setStatusStep] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [focused, setFocused] = useState(false);

    const chatWrapperRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    /* Warmup on mount */
    useEffect(() => {
        warmupChat().catch(() => { /* silent — first request just takes longer */ });
    }, []);

    /* Ban countdown */
    useEffect(() => {
        if (!banned) return;
        const timer = setInterval(() => {
            if (!isBanned()) { setBanned(false); setBanMins(0); clearInterval(timer); }
            else setBanMins(banRemainingMinutes());
        }, 1000);
        return () => clearInterval(timer);
    }, [banned]);

    /* Status-step rotator */
    useEffect(() => {
        if (!isTyping) { setStatusStep(0); return; }
        const t = setInterval(() => {
            setStatusStep((s) => (s < STATUS_STEPS.length - 1 ? s + 1 : s));
        }, 2400);
        return () => clearInterval(t);
    }, [isTyping]);

    /* Auto-scroll */
    const scrollToBottom = useCallback(() => {
        if (chatWrapperRef.current) {
            chatWrapperRef.current.scrollTo({ top: chatWrapperRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, []);
    useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

    /* Onboarding */
    const handleOnboardingDismiss = useCallback(() => {
        sessionStorage.setItem('ieee_chat_session_initialized', 'true');
        setShowOnboarding(false);
        setIsReady(true);
        setShowGuideTooltip(true);
    }, []);

    const handleGuideTooltipDismiss = useCallback(() => setShowGuideTooltip(false), []);

    /* Send message */
    const handleSendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return;

        if (isBanned()) {
            setBanned(true);
            const mins = banRemainingMinutes();
            setMessages((prev) => [...prev, {
                role: 'assistant',
                content: `🚫 You're temporarily on cooldown for ${mins} more minute${mins !== 1 ? 's' : ''}. Please come back later!`,
                sources: [],
                timestamp: new Date(),
            }]);
            return;
        }

        setShowWelcome(false);
        setMessages((prev) => [...prev, { role: 'user', content: text, timestamp: new Date() }]);
        const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: text }];
        setChatHistory(newHistory);
        setIsTyping(true);

        try {
            const data = await sendChat(newHistory, mode);

            if (data.is_warning) {
                const currentStrikes = getStrikes() + 1;
                setStrikes(currentStrikes);
                let warningContent: string;
                if (currentStrikes >= MAX_STRIKES) {
                    setBan(); setBanned(true);
                    warningContent = `🚫 Too many nonsense messages. You've been put on a 30-minute cooldown. Please use this time wisely!`;
                } else {
                    warningContent = `⚠️ Warning ${currentStrikes}/${MAX_STRIKES}: Please send meaningful messages. ${MAX_STRIKES - currentStrikes} more warning${MAX_STRIKES - currentStrikes !== 1 ? 's' : ''} before a temporary cooldown.`;
                }
                setMessages((prev) => [...prev, { role: 'assistant', content: warningContent, sources: [], timestamp: new Date() }]);
                return;
            }

            if (data.choices?.[0]) {
                const assistantContent = data.choices[0].message.content;
                const sources = data.sources || [];
                setMessages((prev) => [...prev, { role: 'assistant', content: assistantContent, sources, timestamp: new Date() }]);
                setChatHistory((prev) => [...prev, { role: 'assistant', content: assistantContent }]);
            } else {
                setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', sources: [], timestamp: new Date() }]);
            }
        } catch {
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Technical error: Could not connect to the server.', sources: [], timestamp: new Date() }]);
        } finally {
            setIsTyping(false);
        }
    }, [chatHistory, mode]);

    /* Mode change */
    const handleModeChange = useCallback((newMode: ChatMode) => {
        setMode(newMode);
        setMessages([]);
        setChatHistory([]);
        setShowWelcome(true);
    }, []);

    /* Textarea helpers */
    const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        const ta = e.target;
        ta.style.height = 'auto';
        ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }, []);

    const handleSend = useCallback(() => {
        const text = inputValue.trim();
        if (!text || !isReady || banned || isTyping) return;
        handleSendMessage(text);
        setInputValue('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [inputValue, isReady, banned, isTyping, handleSendMessage]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    }, [handleSend]);

    const modeKeys = Object.keys(MODE_CONTENT) as ChatMode[];
    const currentModeContent = useMemo(() => MODE_CONTENT[mode], [mode]);
    const inputDisabled = !isReady || banned || isTyping;
    const charCount = inputValue.length;

    return (
        <>
            {/* ── Background ── */}
            <div className="site-bg" aria-hidden="true">
                <div className="site-bg__grid" />
                <div className="site-bg__noise" />
                <div className="site-bg__glow" />
                <div className="site-bg__scan" />
            </div>
            <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
                <ChatBackdrop />
            </div>

            {/* ── Shell ── */}
            <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative' }}>

                {/* Header */}
                <header className="hdr">
                    <Link to="/" className="hdr__back" aria-label="Back to site">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M19 12H5M5 12L11 6M5 12L11 18" />
                        </svg>
                        <span>Back</span>
                    </Link>
                    <div className="hdr__brand">
                        <div className="hdr__logo" aria-hidden="true">
                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 3L42.7846 13.5V34.5L24 45L5.21539 34.5V13.5L24 3Z" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                                <path d="M24 9L37.5933 16.75V32.25L24 40L10.4067 32.25V16.75L24 9Z" fill="url(#cw-hex-grad)" opacity="0.15" />
                                <path d="M24 9L37.5933 16.75V32.25L24 40L10.4067 32.25V16.75L24 9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                <path d="M18 21H30M18 27H26" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
                                <circle cx="24" cy="3" r="2" fill="currentColor" />
                                <circle cx="42.7846" cy="13.5" r="2" fill="currentColor" />
                                <circle cx="42.7846" cy="34.5" r="2" fill="currentColor" />
                                <circle cx="24" cy="45" r="2" fill="currentColor" />
                                <circle cx="5.21539" cy="34.5" r="2" fill="currentColor" />
                                <circle cx="5.21539" cy="13.5" r="2" fill="currentColor" />
                                <defs>
                                    <linearGradient id="cw-hex-grad" x1="10" y1="9" x2="38" y2="40" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#00e5ff" />
                                        <stop offset="1" stopColor="#ffb84d" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="hdr__title">
                            <h1>
                                <span className="hdr__title-main">IEEE</span>
                                <span className="hdr__title-sep">/</span>
                                <span className="hdr__title-sub">Assistant</span>
                            </h1>
                            <span className="hdr__subtitle">
                                <span className="hdr__pulse" />
                                IEEE INTELLIGENCE NODE
                            </span>
                        </div>
                    </div>

                    <div className="hdr__controls">
                        <div className="modeswitch" role="tablist" aria-label="Select mode">
                            {modeKeys.map((k) => {
                                const m = MODE_CONTENT[k];
                                const active = mode === k;
                                return (
                                    <button
                                        key={k}
                                        role="tab"
                                        aria-selected={active}
                                        className={`modeswitch__tab${active ? ' is-active' : ''}`}
                                        onClick={() => !active && handleModeChange(k)}
                                    >
                                        <span className="modeswitch__code">{m.code}</span>
                                        <span className="modeswitch__label">{m.label}</span>
                                    </button>
                                );
                            })}
                            <span
                                className="modeswitch__indicator"
                                style={{ transform: `translateX(${modeKeys.indexOf(mode) * 100}%)` }}
                                aria-hidden="true"
                            />
                        </div>

                        {showGuideTooltip && (
                            <div className="guide">
                                <div className="guide__arrow" aria-hidden="true" />
                                <div className="guide__body">
                                    <strong>// SWITCH CHANNELS</strong>
                                    <p>Tap a tab to swap context. Deep Dive for research, Student Branch for local info.</p>
                                    <button className="guide__btn" onClick={handleGuideTooltipDismiss}>
                                        ACKNOWLEDGE
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Status bar */}
                <div className="chat-statusbar" aria-hidden="true">
                    <div className="chat-statusbar__group">
                        <span className="chat-statusbar__label">SYS</span>
                        <span className="chat-statusbar__value">IEEE.ASSISTANT</span>
                    </div>
                    <div className="chat-statusbar__group">
                        <span className="chat-statusbar__label">CHAN</span>
                        <span className="chat-statusbar__value">{currentModeContent.code}</span>
                    </div>
                    <div className="chat-statusbar__group chat-statusbar__group--grow">
                        <span className="chat-statusbar__bar" />
                    </div>
                    <div className="chat-statusbar__group">
                        <span className="chat-statusbar__label">STATE</span>
                        <span className={`chat-statusbar__value${isTyping ? ' chat-statusbar__value--active' : ''}`}>
                            {!isReady ? 'BOOT' : banned ? 'LOCKED' : isTyping ? 'PROCESSING' : 'READY'}
                        </span>
                    </div>
                </div>

                {/* Chat scroll area */}
                <main className="chat-scroll" ref={chatWrapperRef}>
                    <div className="chat-scroll__inner">

                        {/* Welcome screen */}
                        {showWelcome && (
                            <div className="cw-welcome">
                                <div className="cw-welcome__tag">
                                    <span className="cw-welcome__tag-bracket">[</span>
                                    {currentModeContent.code} · {currentModeContent.label.toUpperCase()}
                                    <span className="cw-welcome__tag-bracket">]</span>
                                </div>
                                <h2 className="cw-welcome__title">
                                    <span className="cw-welcome__title-line">Hi, I'm</span>
                                    <span className="cw-welcome__title-name">
                                        IEEE Assistant<span className="cw-welcome__title-dot">.</span>
                                        <span className="cw-welcome__cursor" aria-hidden="true" />
                                    </span>
                                </h2>
                                <p className="cw-welcome__desc">{currentModeContent.description}</p>

                                <div className="cw-welcome__divider" aria-hidden="true">
                                    <span /><em>TRY ASKING</em><span />
                                </div>

                                <div className="cw-welcome__suggestions">
                                    {currentModeContent.suggestions.map((text, idx) => (
                                        <SuggestionChip
                                            key={idx}
                                            text={text}
                                            index={idx}
                                            onClick={handleSendMessage}
                                            disabled={!isReady}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        <div className="msglist">
                            {messages.map((msg, idx) => (
                                <MessageBubble
                                    key={idx}
                                    role={msg.role}
                                    content={msg.content}
                                    sources={msg.sources}
                                    timestamp={msg.timestamp}
                                />
                            ))}
                        </div>

                        {/* Typing / Loading indicator */}
                        {isTyping && (
                            mode === 'deep_dive'
                                ? <DeepDiveLoader step={statusStep} />
                                : (
                                    <div className="cw-typing">
                                        <div className="cw-typing__rail" aria-hidden="true">
                                            <span className="msg__rail-tick" />
                                            <span className="msg__rail-line" />
                                            <span className="msg__rail-tick" />
                                        </div>
                                        <div className="cw-typing__body">
                                            <span className="cw-typing__label">IEEE ASSISTANT is composing</span>
                                            <div className="cw-typing__dots">
                                                <span /><span /><span />
                                            </div>
                                        </div>
                                    </div>
                                )
                        )}
                    </div>
                </main>

                {/* Ban banner */}
                {banned && (
                    <div className="cw-ban">
                        <div className="cw-ban__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                            </svg>
                        </div>
                        <div className="cw-ban__text">
                            <strong>SESSION LOCKED</strong>
                            <span>Cooldown: <b>{banMins}</b> min{banMins !== 1 ? 's' : ''} remaining</span>
                        </div>
                    </div>
                )}

                {/* Composer */}
                <footer className="cw-composer">
                    <div className={`cw-composer__box${focused ? ' is-focused' : ''}${inputDisabled ? ' is-disabled' : ''}`}>
                        <span className="cw-composer__corner cw-composer__corner--tl" aria-hidden="true" />
                        <span className="cw-composer__corner cw-composer__corner--tr" aria-hidden="true" />
                        <span className="cw-composer__corner cw-composer__corner--bl" aria-hidden="true" />
                        <span className="cw-composer__corner cw-composer__corner--br" aria-hidden="true" />

                        <div className="cw-composer__prefix" aria-hidden="true">
                            <span className="cw-composer__chevron">&gt;</span>
                            <span className="cw-composer__chan">{currentModeContent.code}</span>
                        </div>

                        <textarea
                            ref={textareaRef}
                            className="cw-composer__input"
                            placeholder={
                                !isReady ? 'Initializing system...' :
                                banned ? 'Session locked...' :
                                isTyping ? 'IEEE Assistant is thinking...' :
                                'Transmit message to IEEE Assistant...'
                            }
                            rows={1}
                            value={inputValue}
                            onChange={handleInput}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            onKeyDown={handleKeyDown}
                            disabled={inputDisabled}
                            aria-label="Message input"
                        />

                        <div className="cw-composer__meta">
                            <span className="cw-composer__count" aria-hidden="true">
                                {String(charCount).padStart(4, '0')}
                            </span>
                            <button
                                className="cw-composer__send"
                                disabled={!inputValue.trim() || inputDisabled}
                                onClick={handleSend}
                                aria-label="Send message"
                            >
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M5 12L19 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                    <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="cw-composer__send-label">SEND</span>
                            </button>
                        </div>
                    </div>
                    <div className="cw-composer__hint" aria-hidden="true">
                        <kbd>Enter</kbd> to send <span>·</span> <kbd>Shift</kbd>+<kbd>Enter</kbd> for newline
                    </div>
                </footer>
            </div>

            {/* Onboarding modal */}
            {showOnboarding && (
                <ChatOnboardingModal onDismiss={handleOnboardingDismiss} />
            )}
        </>
    );
}

export default Chat;

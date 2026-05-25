import { useState, useCallback, useEffect } from 'react';
import { warmupChat } from '../lib/chatbotApi';
import type { ChatMode } from '../lib/chatbotApi';
import '../styles/ChatOnboarding.css';

const BOOT_LINES = [
  '> initiating handshake...',
  '> dialing IEEE knowledge cluster',
  '> establishing secure channel',
  '> loading neural inference layer',
  '> calibrating context window',
  '> session ready',
];

interface ChatOnboardingModalProps {
  onDismiss: () => void;
  mode: ChatMode;
}

function ChatOnboardingModal({ onDismiss, mode }: ChatOnboardingModalProps) {
  const [phase, setPhase] = useState<'intro' | 'warming' | 'error'>('intro');
  const [errorMsg, setErrorMsg] = useState('');
  const [bootStep, setBootStep] = useState(0);

  useEffect(() => {
    if (phase !== 'warming') return;
    setBootStep(0);
    const t = setInterval(() => {
      setBootStep((s) => Math.min(s + 1, BOOT_LINES.length - 1));
    }, 700);
    return () => clearInterval(t);
  }, [phase]);

  const handleWarmup = useCallback(async () => {
    setPhase('warming');
    setErrorMsg('');
    try {
      const result = await warmupChat();
      if (!result) {
        throw new Error('No response from backend');
      }
      
      // Just dismiss - don't try to send initial message
      // This prevents timeouts and connection issues during onboarding
      setTimeout(() => onDismiss(), 500);
    } catch (e) {
      console.error('Warmup failed:', e);
      setPhase('error');
      setErrorMsg('Could not connect to the chatbot backend. Please make sure it is running and try again.');
    }
  }, [onDismiss]);

  return (
    <div className="chat-modal">
      <div className="chat-modal__backdrop" aria-hidden="true">
        <div className="chat-modal__grid"></div>
      </div>
      <div className="chat-modal__panel">
        <span className="chat-modal__corner chat-modal__corner--tl" aria-hidden="true"></span>
        <span className="chat-modal__corner chat-modal__corner--tr" aria-hidden="true"></span>
        <span className="chat-modal__corner chat-modal__corner--bl" aria-hidden="true"></span>
        <span className="chat-modal__corner chat-modal__corner--br" aria-hidden="true"></span>

        <div className="chat-modal__topbar" aria-hidden="true">
          <span className="chat-modal__dot"></span>
          <span className="chat-modal__dot"></span>
          <span className="chat-modal__dot"></span>
          <span className="chat-modal__path">~/ieee-assistant/session/new</span>
        </div>

        {phase === 'intro' && (
          <div className="chat-modal__inner">
            <div className="chat-modal__tag">[BRIEFING · 001]</div>
            <h2 className="chat-modal__title">
              Welcome to <span className="chat-modal__title-accent">IEEE Assistant</span>
            </h2>
            <p className="chat-modal__lead">
              Your intelligent companion for all things IEEE. Built for research and branch excellence.
            </p>

            <ul className="chat-modal__list">
              <li>
                <span className="chat-modal__list-num">01</span>
                <div>
                  <strong>Dual channels</strong>
                  <span>Switch between <em>Deep Dive</em> research and <em>Student Branch</em> intel.</span>
                </div>
              </li>
              <li>
                <span className="chat-modal__list-num">02</span>
                <div>
                  <strong>Verified citations</strong>
                  <span>Every technical answer is anchored to real IEEE references.</span>
                </div>
              </li>
              <li>
                <span className="chat-modal__list-num">03</span>
                <div>
                  <strong>Ask sharply</strong>
                  <span>Specific queries surface specific answers — vague ones get vague replies.</span>
                </div>
              </li>
            </ul>

            <button className="chat-modal__btn" onClick={handleWarmup}>
              <span>INITIATE SESSION</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {phase === 'warming' && (
          <div className="chat-modal__inner chat-modal__inner--boot">
            <div className="chat-modal__tag">[BOOTING SESSION]</div>
            <h2 className="chat-modal__title">Coming online</h2>
            <div className="chat-boot">
              {BOOT_LINES.slice(0, bootStep + 1).map((line, i) => (
                <div key={i} className={`chat-boot__line ${i === bootStep ? 'chat-boot__line--active' : ''}`}>
                  <span className="chat-boot__num">[{String(i + 1).padStart(2, '0')}]</span>
                  <span className="chat-boot__txt">{line}</span>
                  {i === bootStep && <span className="chat-boot__cursor"></span>}
                </div>
              ))}
            </div>
            <div className="chat-boot__bar" aria-hidden="true">
              <span style={{ width: `${((bootStep + 1) / BOOT_LINES.length) * 100}%` }}></span>
            </div>
          </div>
        )}

        {phase === 'error' && (
          <div className="chat-modal__inner chat-modal__inner--err">
            <div className="chat-modal__tag chat-modal__tag--err">[FAULT · 502]</div>
            <div className="chat-modal__err-icon" aria-hidden="true">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className="chat-modal__title">Connection failed</h2>
            <p className="chat-modal__lead">{errorMsg}</p>
            <button className="chat-modal__btn chat-modal__btn--retry" onClick={handleWarmup}>
              <span>RETRY HANDSHAKE</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatOnboardingModal;

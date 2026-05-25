import { useLocation, useNavigate } from 'react-router-dom';

/* ─── ChatLauncher ────────────────────────────────────────────────────────
   Floating launcher button. Navigates to /chat (full-page) instead of
   opening a side panel. Hidden when already on the chat page.
   --------------------------------------------------------------------- */
const ChatLauncher = () => {
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === '/chat') return null;

    return (
        <button
            onClick={() => navigate('/chat')}
            aria-label="Open chatbot"
            className="fixed bottom-5 right-5 z-[60] w-14 h-14 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            style={{
                background: 'var(--cy)',
                color: 'var(--bg-0)',
                boxShadow: '0 6px 28px rgba(0, 229, 255, 0.45)',
                clipPath:
                    'polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))',
                animation: 'chat-fab-float 4s ease-in-out infinite',
            }}
        >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <style>{`
                @keyframes chat-fab-float {
                    0%, 100% { transform: translateY(0); box-shadow: 0 6px 28px rgba(0,229,255,0.45); }
                    50%      { transform: translateY(-4px); box-shadow: 0 10px 34px rgba(0,229,255,0.6); }
                }
            `}</style>
        </button>
    );
};

export default ChatLauncher;

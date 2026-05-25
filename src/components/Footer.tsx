import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const year = new Date().getFullYear();
    const location = useLocation();
    const isChatPage = location.pathname === '/chat';

    return (
        <footer className={`relative z-10 mt-auto ${isChatPage ? 'hidden md:block' : ''}`} style={{ borderTop: '1px solid rgba(150,178,220,0.1)' }}>
            {/* Status bar */}
            <div className="px-6 md:px-14 py-2.5 flex items-center gap-4 overflow-x-auto" style={{ background: 'rgba(0,229,255,0.025)', borderBottom: '1px solid rgba(0,229,255,0.06)' }}>
                <span className="font-mono-ieee text-[9px] tracking-[0.22em] uppercase whitespace-nowrap" style={{ color: 'var(--txt-3)' }}>IEEE SB AOT</span>
                <div className="h-3 w-px" style={{ background: 'var(--line-2)' }} />
                <span className="font-mono-ieee text-[9px] tracking-[0.18em] uppercase whitespace-nowrap" style={{ color: 'rgba(0,229,255,0.4)' }}>Advancing Technology for Humanity</span>
                <div className="flex-1" />
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="status-dot" />
                    <span className="font-mono-ieee text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--txt-3)' }}>Online</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-14 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="font-mono-ieee text-[10px] tracking-wider" style={{ color: 'var(--txt-3)' }}>
                        © {year} IEEE Student Branch AOT. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <Link className="font-mono-ieee text-[10px] tracking-wider hover:text-primary transition-colors" style={{ color: 'var(--txt-3)' }} to="#">Privacy</Link>
                        <Link className="font-mono-ieee text-[10px] tracking-wider hover:text-primary transition-colors" style={{ color: 'var(--txt-3)' }} to="#">Terms</Link>
                        <Link className="font-mono-ieee text-[10px] tracking-wider hover:text-primary transition-colors" style={{ color: 'var(--txt-3)' }} to="#">IEEE.org</Link>
                    </div>
                    <div className="flex gap-3">
                        <a
                            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all"
                            style={{ border: '1px solid var(--line)' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line-cy)')}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line)')}
                            href="#"
                        >
                            <span className="material-symbols-outlined text-sm">public</span>
                        </a>
                        <a
                            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all"
                            style={{ border: '1px solid var(--line)' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line-cy)')}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line)')}
                            href="#"
                        >
                            <span className="material-symbols-outlined text-sm">alternate_email</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

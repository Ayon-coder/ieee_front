import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? "font-mono-ieee text-[11px] tracking-[0.18em] uppercase text-primary border-b border-primary pb-0.5 transition-all"
            : "font-mono-ieee text-[11px] tracking-[0.18em] uppercase text-on-surface-variant hover:text-on-surface transition-all";

    return (
        <nav
            className="fixed top-0 w-full z-50 transition-all duration-300"
            style={{
                background: scrolled ? 'rgba(8,11,20,0.85)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(0,229,255,0.12)' : '1px solid transparent',
                boxShadow: scrolled ? '0 4px 32px rgba(0,229,255,0.04)' : 'none',
            }}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-14 h-16">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <div className="absolute inset-0 rotate-45 border border-primary/30 scale-[0.72]" />
                        <div className="absolute inset-0 rotate-45 border border-primary/15" />
                        <span className="font-mono-ieee text-[10px] font-bold text-primary relative z-10 tracking-tight">IE</span>
                    </div>
                    <div>
                        <div className="font-display-ieee font-bold text-on-surface text-[15px] leading-none tracking-tight">IEEE SB AOT</div>
                        <div className="font-mono-ieee text-[9px] tracking-[0.22em] uppercase leading-none mt-0.5" style={{ color: 'var(--txt-3)' }}>Student Branch</div>
                    </div>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink end className={navLinkClass} to="/">Home</NavLink>
                    <NavLink className={navLinkClass} to="/events">Events</NavLink>
                    <NavLink className={navLinkClass} to="/teams">Team</NavLink>
                    <NavLink className={navLinkClass} to="/chat">Chat</NavLink>
                    <NavLink className={navLinkClass} to="/contact">Contact</NavLink>
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="status-dot" />
                        <span className="font-mono-ieee text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--txt-3)' }}>Active</span>
                    </div>
                    <button className="btn-gradient px-5 py-2.5 text-[10px] tracking-[0.15em] uppercase font-bold">
                        Join Us
                    </button>
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <div className="w-5 flex flex-col gap-[5px]">
                        <span className={`h-px w-full bg-current transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
                        <span className={`h-px w-full bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
                        <span className={`h-px w-full bg-current transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
                    </div>
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t" style={{ borderColor: 'rgba(0,229,255,0.1)', background: 'rgba(8,11,20,0.96)', backdropFilter: 'blur(20px)' }}>
                    <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-5">
                        <NavLink end className={navLinkClass} to="/" onClick={() => setMobileOpen(false)}>Home</NavLink>
                        <NavLink className={navLinkClass} to="/events" onClick={() => setMobileOpen(false)}>Events</NavLink>
                        <NavLink className={navLinkClass} to="/teams" onClick={() => setMobileOpen(false)}>Team</NavLink>
                        <NavLink className={navLinkClass} to="/chat" onClick={() => setMobileOpen(false)}>Chat</NavLink>
                        <NavLink className={navLinkClass} to="/contact" onClick={() => setMobileOpen(false)}>Contact</NavLink>
                        <button className="btn-gradient w-full py-3 text-[10px] tracking-[0.15em] uppercase font-bold mt-1">
                            Join Us
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

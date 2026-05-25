import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatLauncher from './ChatLauncher';
import CustomCursor from './CustomCursor';

const Layout = () => {
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let raf = 0;
        let pendingX = 0;
        let pendingY = 0;

        const apply = () => {
            raf = 0;
            const el = bgRef.current;
            if (!el) return;
            el.style.setProperty('--mx', `${pendingX}px`);
            el.style.setProperty('--my', `${pendingY}px`);
        };

        const handleMove = (e: PointerEvent) => {
            pendingX = e.clientX;
            pendingY = e.clientY;
            if (!raf) raf = requestAnimationFrame(apply);
        };

        window.addEventListener('pointermove', handleMove, { passive: true });
        return () => {
            window.removeEventListener('pointermove', handleMove);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen font-body dark relative" style={{ background: 'var(--bg-0)', color: 'var(--txt)' }}>
            <div className="site-bg" ref={bgRef} aria-hidden="true">
                <div className="site-bg__grid" />
                <div className="site-bg__noise" />
                <div className="site-bg__glow" />
                <div className="site-bg__scan" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-grow">
                    <Outlet />
                </div>
                <Footer />
            </div>

            <ChatLauncher />
            <CustomCursor />
        </div>
    );
};

export default Layout;

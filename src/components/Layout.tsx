import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });

    useEffect(() => {
        const handleMove = (e: PointerEvent) => {
            setCursorPos({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };
        window.addEventListener('pointermove', handleMove);
        return () => window.removeEventListener('pointermove', handleMove);
    }, []);

    return (
        <div className="flex flex-col min-h-screen font-body dark relative" style={{ background: 'var(--bg-0)', color: 'var(--txt)' }}>
            <div
                className="site-bg"
                style={{ '--mx': `${cursorPos.x}%`, '--my': `${cursorPos.y}%` } as React.CSSProperties}
                aria-hidden="true"
            >
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
        </div>
    );
};

export default Layout;

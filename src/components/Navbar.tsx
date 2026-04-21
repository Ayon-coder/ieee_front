import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? "text-sky-400 font-bold border-b-2 border-sky-400 pb-1 transition-all"
            : "text-slate-300 hover:text-white transition-all";

    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/40">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-14 py-4">
                <div className="text-xl font-bold tracking-tighter text-slate-50 font-headline">IEEE SB AOT</div>
                <div className="hidden md:flex items-center gap-8 font-manrope text-sm tracking-tight font-medium">
                    <NavLink end className={navLinkClass} to="/">Home</NavLink>
                    <NavLink className={navLinkClass} to="/events">Events</NavLink>
                    <NavLink className={navLinkClass} to="/teams">Teams</NavLink>
                    <NavLink className={navLinkClass} to="/contact">Contact Us</NavLink>
                </div>
                <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-primary-container/20">
                    Join Us
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

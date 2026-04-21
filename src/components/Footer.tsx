import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full mt-auto py-12 bg-slate-900/40 backdrop-blur-md border-t border-white/5">
            <div className="max-w-7xl mx-auto px-14 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-on-surface-variant font-manrope text-xs">
                    © 2024 IEEE Student Branch AOT. All rights reserved.
                </div>
                <div className="flex gap-8">
                    <Link className="text-slate-400 hover:text-slate-200 transition-colors font-manrope text-xs" to="#">Privacy Policy</Link>
                    <Link className="text-slate-400 hover:text-slate-200 transition-colors font-manrope text-xs" to="#">Terms of Service</Link>
                    <Link className="text-slate-400 hover:text-slate-200 transition-colors font-manrope text-xs" to="#">IEEE.org</Link>
                </div>
                <div className="flex gap-4">
                    <a className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-primary/20 transition-colors" href="#">
                        <span className="material-symbols-outlined text-sm">public</span>
                    </a>
                    <a className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-primary/20 transition-colors" href="#">
                        <span className="material-symbols-outlined text-sm">alternate_email</span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

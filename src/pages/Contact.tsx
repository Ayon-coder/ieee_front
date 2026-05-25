import { ContactBackdrop } from '../components/PageBackdrops';
import { useScrollReveal, useTilt3D } from '../lib/use3d';

const Contact = () => {
    const formTilt = useTilt3D<HTMLDivElement>({ max: 5 });
    const infoRef = useScrollReveal<HTMLDivElement>(0.15);
    const formRef = useScrollReveal<HTMLDivElement>(0.15);
    return (
        <main className="min-h-screen pt-28 pb-20 px-6 md:px-14 relative overflow-hidden scene-3d">
            <div className="absolute inset-0 -z-10">
                <ContactBackdrop />
            </div>
            {/* Ambient glows */}
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none -z-10" style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.06), transparent 70%)', filter: 'blur(80px)' }} />
            <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] rounded-full pointer-events-none -z-10" style={{ background: 'radial-gradient(circle, rgba(255,184,77,0.05), transparent 70%)', filter: 'blur(80px)' }} />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-20 max-w-2xl">
                    <span className="font-mono-ieee text-[10px] tracking-[0.22em] uppercase text-primary block mb-4">Contact / Connect</span>
                    <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.05] text-on-surface">
                        Let's Build the <span className="text-gradient">Future</span> Together.
                    </h1>
                    <p className="text-lg md:text-xl leading-relaxed" style={{ color: 'var(--txt-2)' }}>
                        Have a question about our upcoming events, membership, or technical projects? Our team at the Academy of Technology is here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
                    {/* Left: Contact Info */}
                    <div ref={infoRef} className="reveal-stagger lg:col-span-5 space-y-10">
                        <div className="space-y-6">
                            {[
                                { icon: 'mail', title: 'Email Us', sub: 'General Inquiries', value: 'contact@ieeesbaot.org', href: 'mailto:contact@ieeesbaot.org', isLink: true },
                                { icon: 'call', title: 'Call Us', sub: 'Mon - Fri, 9am - 5pm', value: '+91 98765 43210', isLink: false },
                                { icon: 'location_on', title: 'Visit Us', sub: 'Academy of Technology', value: 'Adisaptagram, Hooghly,\nWest Bengal 712121', isLink: false },
                            ].map(({ icon, title, sub, value, href, isLink }) => (
                                <div key={title} className="flex items-start gap-5 group">
                                    <div
                                        className="w-11 h-11 flex items-center justify-center text-primary flex-shrink-0 transition-all duration-300"
                                        style={{ border: '1px solid var(--line)' }}
                                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--cy)'; el.style.background = 'rgba(0,229,255,0.08)'; }}
                                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--line)'; el.style.background = 'transparent'; }}
                                    >
                                        <span className="material-symbols-outlined text-lg">{icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-headline font-bold text-on-surface mb-0.5">{title}</h3>
                                        <p className="font-mono-ieee text-[10px] tracking-widest uppercase mb-1" style={{ color: 'var(--txt-3)' }}>{sub}</p>
                                        {isLink ? (
                                            <a className="text-primary hover:underline transition-all" href={href}>{value}</a>
                                        ) : (
                                            <p className="text-on-surface" style={{ whiteSpace: 'pre-line' }}>{value}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social links */}
                        <div className="pt-8" style={{ borderTop: '1px solid var(--line)' }}>
                            <h4 className="font-mono-ieee text-[10px] tracking-[0.22em] uppercase mb-5" style={{ color: 'var(--txt-3)' }}>Connect With Us</h4>
                            <div className="flex gap-3">
                                {['public', 'groups', 'share'].map(icon => (
                                    <a
                                        key={icon}
                                        className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all"
                                        style={{ border: '1px solid var(--line)' }}
                                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line-cy)')}
                                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line)')}
                                        href="#"
                                    >
                                        <span className="material-symbols-outlined text-sm">{icon}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Campus visual */}
                        <div className="relative w-full h-56 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700" style={{ border: '1px solid var(--line)' }}>
                            <img className="w-full h-full object-cover" alt="Campus" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRyMKig7sIztqvkgqEemBgNYNvJX0o005iCUaL8pP659yyrwKZBzmB2lojpXVdGiRMLRoxSXBe5K1gytJ6duvxg0ZyurA_CRflqX9QRQqsRIsXU69X1E94T8A6n92Nz0KQrh4R5MhHhIoTnCmrcpTT5tr45k9Q2wN2lI4HMkZae9aVtN6t3KbE3mQz3owEN1JP-ywiSjCY4CpewGGs7UM3rSAv51ceOXodsJ9x0mudjM71D1BfT8u4aPXG9_CWg1r03B2q59BKmC2W" />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg-0) 0%, transparent 60%)' }} />
                            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5" style={{ background: 'rgba(8,11,20,0.85)', border: '1px solid var(--line)' }}>
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '14px' }}>explore</span>
                                <span className="font-mono-ieee text-[9px] tracking-[0.18em] uppercase text-on-surface">Main Engineering Block</span>
                            </div>
                            <div className="absolute top-0 left-0 w-5 h-5 pointer-events-none" style={{ borderTop: '2px solid var(--cy)', borderLeft: '2px solid var(--cy)' }} />
                            <div className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none" style={{ borderBottom: '2px solid var(--cy)', borderRight: '2px solid var(--cy)' }} />
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div ref={formRef} className="reveal lg:col-span-7">
                        <div className="corner-accent holo-edge tilt-3d depth-card p-8 md:p-12 relative" {...formTilt.bind}>
                            <div className="tilt-layer" style={{ '--z': '28px' } as React.CSSProperties}>
                            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, var(--cy), transparent)' }} />

                            <div className="mb-10">
                                <span className="font-mono-ieee text-[10px] tracking-[0.2em] uppercase text-primary block mb-2">Send a Message</span>
                                <h2 className="font-headline text-2xl font-bold text-on-surface">We're listening.</h2>
                                <p className="mt-2 font-mono-ieee text-[11px] tracking-wider" style={{ color: 'var(--txt-3)' }}>Typical response within 24 business hours.</p>
                            </div>

                            <form className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="font-mono-ieee text-[10px] tracking-[0.18em] uppercase block" style={{ color: 'var(--txt-3)' }}>Name</label>
                                        <input
                                            className="w-full py-3.5 px-4 text-on-surface bg-transparent focus:outline-none transition-all"
                                            style={{ border: '1px solid var(--line)', fontFamily: 'var(--font-body)', fontSize: '14px', background: 'rgba(5,7,13,0.6)' }}
                                            onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--cy)')}
                                            onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line)')}
                                            placeholder="John Doe"
                                            type="text"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-mono-ieee text-[10px] tracking-[0.18em] uppercase block" style={{ color: 'var(--txt-3)' }}>Email</label>
                                        <input
                                            className="w-full py-3.5 px-4 text-on-surface bg-transparent focus:outline-none transition-all"
                                            style={{ border: '1px solid var(--line)', fontFamily: 'var(--font-body)', fontSize: '14px', background: 'rgba(5,7,13,0.6)' }}
                                            onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--cy)')}
                                            onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line)')}
                                            placeholder="john@example.com"
                                            type="email"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-mono-ieee text-[10px] tracking-[0.18em] uppercase block" style={{ color: 'var(--txt-3)' }}>Subject</label>
                                    <input
                                        className="w-full py-3.5 px-4 text-on-surface bg-transparent focus:outline-none transition-all"
                                        style={{ border: '1px solid var(--line)', fontFamily: 'var(--font-body)', fontSize: '14px', background: 'rgba(5,7,13,0.6)' }}
                                        onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--cy)')}
                                        onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line)')}
                                        placeholder="How can we help you?"
                                        type="text"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="font-mono-ieee text-[10px] tracking-[0.18em] uppercase block" style={{ color: 'var(--txt-3)' }}>Message</label>
                                    <textarea
                                        className="w-full py-3.5 px-4 text-on-surface bg-transparent focus:outline-none resize-none transition-all"
                                        style={{ border: '1px solid var(--line)', fontFamily: 'var(--font-body)', fontSize: '14px', background: 'rgba(5,7,13,0.6)' }}
                                        onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--cy)')}
                                        onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line)')}
                                        placeholder="Write your message here..."
                                        rows={5}
                                    />
                                </div>

                                <div className="pt-2">
                                    <button className="btn-gradient w-full md:w-auto px-10 py-4 text-[11px] tracking-[0.18em] uppercase font-bold flex items-center justify-center gap-2" type="submit">
                                        Send Message
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>send</span>
                                    </button>
                                </div>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Contact;

import { useEffect, useRef } from 'react';
import Hero3D from '../components/Hero3D';
import { useCountUp, useScrollReveal, useTilt3D, useParallax, useScrollProgress } from '../lib/use3d';

/* ─── Animated count-up stat tile ─────────────────────────────────────── */
const StatTile = ({
    value,
    suffix,
    label,
    accent,
}: {
    value: number;
    suffix: string;
    label: string;
    accent: string;
}) => {
    const [n, ref] = useCountUp<HTMLDivElement>(value, 1600);
    const { bind } = useTilt3D({ max: 8 });

    return (
        <div
            ref={ref}
            className="stat-3d corner-accent tilt-3d p-8 text-center relative"
            style={{ background: 'rgba(13,19,32,0.6)', border: '1px solid var(--line)' }}
            {...bind}
        >
            <div className="tilt-layer" style={{ '--z': '24px' } as React.CSSProperties}>
                <div className="font-headline text-5xl md:text-6xl font-extrabold mb-2 tabular-nums" style={{ color: accent }}>
                    {n}
                    <span>{suffix}</span>
                </div>
                <div className="font-mono-ieee text-[11px] tracking-[0.2em] uppercase" style={{ color: 'var(--txt-3)' }}>
                    {label}
                </div>
            </div>
        </div>
    );
};

/* ─── 3D-tilt panel for Mission / Vision ──────────────────────────────── */
const InfoPanel = ({
    num,
    title,
    body,
    accent,
}: {
    num: string;
    title: string;
    body: string;
    accent: 'primary' | 'tertiary';
}) => {
    const { bind } = useTilt3D({ max: 7 });
    const colorClass = accent === 'primary' ? 'text-primary' : 'text-tertiary';
    return (
        <div
            className="corner-accent holo-edge tilt-3d depth-card p-10 flex flex-col justify-center relative"
            {...bind}
        >
            <div className="tilt-layer relative" style={{ '--z': '30px' } as React.CSSProperties}>
                <div className="inline-flex items-center gap-2 mb-6">
                    <span className={`font-mono-ieee text-[10px] tracking-[0.2em] uppercase ${colorClass}`}>{num} /</span>
                    <h2 className={`font-headline text-2xl font-bold ${colorClass}`}>{title}</h2>
                </div>
                <p className="leading-relaxed text-lg" style={{ color: 'var(--txt-2)' }}>
                    {body}
                </p>
            </div>
        </div>
    );
};

const Home = () => {
    const progress = useScrollProgress();

    /* Section reveal refs */
    const statsRef = useScrollReveal<HTMLDivElement>(0.2);
    const mvRef = useScrollReveal<HTMLDivElement>(0.15);
    const advisorRef = useScrollReveal<HTMLDivElement>(0.2);
    const partnersRef = useScrollReveal<HTMLDivElement>(0.2);
    const faqRef = useScrollReveal<HTMLDivElement>(0.2);

    /* Parallax for hero text — slight upward drift on scroll */
    const heroTextRef = useParallax<HTMLDivElement>(-0.08);

    /* Faculty image parallax */
    const advisorImgRef = useParallax<HTMLDivElement>(0.05);

    /* 3D tilt for faculty panel + hero badge */
    const advisorTilt = useTilt3D<HTMLDivElement>({ max: 6 });

    /* Make sure the in-view check for above-the-fold runs immediately */
    useEffect(() => {
        const node = document.querySelector('[data-hero-reveal]') as HTMLElement | null;
        if (node) requestAnimationFrame(() => node.classList.add('is-visible'));
    }, []);

    return (
        <main>
            {/* Scroll progress bar */}
            <div className="scroll-progress" style={{ ['--p' as string]: `${(progress * 100).toFixed(2)}%` } as React.CSSProperties} />

            {/* ─── HERO ────────────────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden scene-3d">
                <div className="absolute inset-0 hero-gradient pointer-events-none" />

                {/* 3D wireframe + particle backdrop */}
                <Hero3D />

                {/* Ambient blobs (kept from original) */}
                <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none float-y-slow" style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.07), transparent 70%)', filter: 'blur(60px)' }} />
                <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full pointer-events-none float-y" style={{ background: 'radial-gradient(circle, rgba(255,184,77,0.05), transparent 70%)', filter: 'blur(60px)' }} />

                <div
                    ref={heroTextRef}
                    data-hero-reveal
                    className="reveal-stagger relative z-10 max-w-5xl mx-auto px-6 md:px-14 text-center parallax-layer"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-10" style={{ border: '1px solid rgba(0,229,255,0.2)', background: 'rgba(0,229,255,0.05)' }}>
                        <div className="status-dot" />
                        <span className="font-mono-ieee text-[10px] tracking-[0.22em] uppercase text-primary">Advancing Technology for Humanity</span>
                    </div>

                    <h1 className="font-headline text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 leading-[1.05]" style={{ color: 'var(--txt)' }}>
                        Join the Legacy of<br />
                        <span className="text-gradient">Innovation</span>
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: 'var(--txt-2)' }}>
                        IEEE Student Branch of Academy of Technology is a hub for aspiring engineers and innovators to collaborate, learn, and build the future of technology together.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="btn-gradient w-full sm:w-auto px-8 py-4 text-sm tracking-widest uppercase font-bold">
                            Become a Member
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 font-mono-ieee text-sm tracking-widest uppercase font-bold text-on-surface transition-all hover:text-primary" style={{ border: '1px solid var(--line)', background: 'transparent' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line-cy)')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line)')}>
                            Explore Events
                        </button>
                    </div>

                    {/* Decorative line */}
                    <div className="mt-20 flex items-center justify-center gap-4 opacity-30">
                        <div className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(to right, transparent, var(--cy))' }} />
                        <span className="font-mono-ieee text-[9px] tracking-[0.3em] uppercase text-primary">SB-AOT</span>
                        <div className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(to left, transparent, var(--cy))' }} />
                    </div>
                </div>

                {/* Scroll-cue */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none">
                    <span className="font-mono-ieee text-[9px] tracking-[0.3em] uppercase" style={{ color: 'var(--txt-3)' }}>Scroll</span>
                    <div className="w-px h-10 float-y" style={{ background: 'linear-gradient(to bottom, var(--cy), transparent)' }} />
                </div>
            </section>

            {/* ─── STATS ───────────────────────────────────────────────────────── */}
            <section className="py-20 relative z-10 scene-3d">
                <div ref={statsRef} className="reveal-stagger max-w-7xl mx-auto px-6 md:px-14 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatTile value={500} suffix="+" label="Active Members" accent="var(--cy)" />
                    <StatTile value={40}  suffix="+" label="Events Organized" accent="var(--am)" />
                    <StatTile value={2}   suffix="K+" label="Total Followers" accent="var(--txt-2)" />
                </div>
            </section>

            {/* ─── MISSION & VISION ────────────────────────────────────────────── */}
            <section className="py-24 scene-3d" style={{ background: 'rgba(5,7,13,0.8)' }}>
                <div ref={mvRef} className="reveal-stagger max-w-7xl mx-auto px-6 md:px-14 grid lg:grid-cols-2 gap-8 items-stretch">
                    <InfoPanel
                        num="01"
                        title="Our Mission"
                        accent="primary"
                        body="To foster technological innovation and excellence for the benefit of humanity. We provide students with the platform to engage with global engineering standards, participate in world-class competitions, and connect with industry leaders through workshops and technical seminars."
                    />
                    <InfoPanel
                        num="02"
                        title="Our Vision"
                        accent="tertiary"
                        body="To become a premiere technical observatory that empowers students to lead in a rapidly evolving digital landscape. We envision a community where technical literacy and ethical innovation are the core pillars of professional development."
                    />
                </div>
            </section>

            {/* ─── FACULTY ADVISOR ─────────────────────────────────────────────── */}
            <section ref={advisorRef} className="reveal py-24 relative overflow-hidden scene-3d">
                <div className="max-w-5xl mx-auto px-6 md:px-14">
                    <div
                        className="corner-accent holo-edge tilt-3d depth-card p-8 md:p-16 relative overflow-hidden"
                        {...advisorTilt.bind}
                    >
                        {/* Large quote mark */}
                        <div className="absolute top-6 right-8 font-mono-ieee text-[8rem] leading-none font-bold pointer-events-none select-none" style={{ color: 'rgba(0,229,255,0.04)' }}>"</div>

                        {/* Scan line accent */}
                        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, var(--cy), transparent)' }} />

                        <div className="tilt-layer relative z-10 flex flex-col md:flex-row items-center gap-12" style={{ '--z': '32px' } as React.CSSProperties}>
                            <div ref={advisorImgRef} className="parallax-layer w-44 h-44 flex-shrink-0 overflow-hidden relative float-y-slow" style={{ border: '2px solid rgba(0,229,255,0.2)' }}>
                                <img
                                    alt="Faculty Advisor"
                                    className="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvlVItpj-5VKK0v_rlt9GGDdVrKAG33X0thh4MLUa8CFzcDAT553ASYJFNoVph0NtaLM4divED4tIeme23apq7KwmRGbrJm4d3QxogejIeT8dV4wtSqeG-rl5wk_ksdl5cRytxYH3drd1Qf7Dd0cmosxc47MTq-wQfCtESDrFHWlNkrLWtlsrSSuOiHdECDtm-UY_u_Av46ooKRRstP1abvR71_yPtHS069MisVGYwBRQqhMSMdbse-0dVmP4rq6LI7nA9IVu8HTiy"
                                />
                                <div className="absolute top-0 left-0 w-4 h-4" style={{ borderTop: '2px solid var(--cy)', borderLeft: '2px solid var(--cy)' }} />
                                <div className="absolute bottom-0 right-0 w-4 h-4" style={{ borderBottom: '2px solid var(--cy)', borderRight: '2px solid var(--cy)' }} />
                            </div>
                            <div>
                                <p className="text-xl md:text-2xl italic font-medium leading-relaxed mb-8 text-on-surface">
                                    "At IEEE SB AOT, we don't just teach technology; we cultivate the mindset required to solve global challenges. Our students are the architects of tomorrow's digital infrastructure."
                                </p>
                                <div className="pl-4" style={{ borderLeft: '2px solid var(--cy)' }}>
                                    <h4 className="text-lg font-bold font-headline text-on-surface">Prof. Aindrajit Pal</h4>
                                    <p className="font-mono-ieee text-[11px] tracking-widest uppercase mt-1" style={{ color: 'var(--txt-3)' }}>Faculty Advisor, IEEE SB AOT</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── COLLABORATIONS MARQUEE ──────────────────────────────────────── */}
            <section ref={partnersRef} className="reveal py-24 overflow-hidden" style={{ background: 'rgba(5,7,13,0.9)' }}>
                <div className="max-w-7xl mx-auto px-6 md:px-14 mb-12 text-center">
                    <div className="inline-flex items-center gap-3">
                        <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, var(--line-2))' }} />
                        <h3 className="font-mono-ieee text-[11px] font-bold tracking-[0.22em] uppercase text-on-surface-variant">Our Partners & Collaborators</h3>
                        <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, var(--line-2))' }} />
                    </div>
                </div>
                <div className="marquee-container py-8">
                    <div className="marquee-content flex flex-nowrap gap-20 items-center w-max">
                        <div className="flex flex-nowrap gap-20 items-center">
                            {[
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuBwSzTl6_fT7QUr-jVqVn3etJCpjhFXi1ElWgWrPAJzj3gIGIXXOU7qRNnWzSBqb5Xh_vLFIdibLijzwYR2o6Gge1KbwH_RWgKvsnxcI-NUVnYQXJ9yBTZPcpn6qdjg1IXIcFOLLQxTYqGRyBZMi0KDJJ1sYpMznXg9YpesJOHPLFWwGUmihtqmA_v73iOZFI-XtHWwydwl9m60MMgZQrxMLg-CBYbFG7sVeFo0PAltdgA6b--iVLKKg5LGvUCE39IQcM2mOiSjo4xq",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuARA0Hj5v8dzsi97Ch7X441ZTZuYl_V1jf4-04sgu20H0Z_M4icNH4Q7H8C_wGTk9PyFDTy4CZOkmn8nZZoBHf6HmGHDWk7BvtGyKJOcU8h1Jz7F0mNZCzP8fWNsNlO8JPV6O0ensXUTmhBJICO0hp1w788VO_h7ctKXKMF9GBshyfZaqg19PWwrB0fO9DWoudzuLuyImH1uu-k762LSff4hHC7Bkm7nEH3EMIgIK4qt9qwKm7_2PsOpK4wWA_zzEqKtnH4cg3eGbtI",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuC4RWMsBaua3I_K69TpelfIQdzxh69V80t1e80Bi0-6EML2tjeBBxZLrAKyAAVro50Q1GOKqmUeOtNHI9E4fHcAhVqd8y8Gs7imJW-5__wB4cLksmTa0jPrhEUSG7J_iiA0kc27T98VNff3o_ci__KVGqwY_vEQvmkxhQr9NclxmkaKcM0ICqvsyhdasgAw0lnngCKpJ1xJIQ_Ehbi5YAuPnYwiARIm2btWKGXbye-AscXFcwsHg5P8Q86qRb5DrhSlVks_QBAAy2wD",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuDMOMYi8iClCdQcpkKEjD2IE4BIZkmBxoPde-ZODqi8eZvlgLdBaVeCdJEe-ORL1DTZcSS2nIgpTv8PBExIf5Fgam41jPFFpx1sAb2UOvpIvPZOEkZpHJBURCYlWM5G718aO8IWzRE1NDaGZYKsmrx0LGUhYL1EGm-I1Ib6dre0Kq2GMG1UDMiHui4qn-j2xStWjaGnHCoW-svkGd2_dCPQ72DAzp3RjdKofFztau5qXmeTOm9pJiQLs9lemaa0MGde7mV2d_ZOYd6h",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuC7GlLzis1bKKMqA5OQkr4rXduMWdXvb0iHSZB9TNKl2zmfKSO7hApz_CO_ph9-U-Lt7urGqAKKVl8JxlzykSByxU3C02GRIau9YF2Bp9teLIDq_sUe1qRVkRxxgWgYCyx30fLgEfv89bqtJSsoQ9pKhhUILDvyCuNrJlOoZgO177bwI5Ds7fJQY2ai1iZnssK6gf4LZUDqjCJn9MFq2-5GXNIJZhSY7zmN7nBbC6uMKfLIyulLWmeSWlooJRUeWbb0ipYNMI--OYwR",
                            ].map((src, i) => (
                                <img key={i} alt="Partner Logo" className="h-10 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-50 hover:opacity-100" src={src} />
                            ))}
                        </div>
                        {/* Duplicate for seamless loop */}
                        <div className="flex flex-nowrap gap-20 items-center">
                            {[
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuC8wzGF1Q3Q1yFFXTW3Esj8jwXjmmrq8Am2Jufgz-AMEVKV7dWiI6GBeygxV3G0kTxE8SmbSKKhMfrsQyz7LpZrJ_ZKOGzuBGXZucOVu4mYKOQUxbU9-m7mN5OguVlRsRwwtkKeMWBGgMfcyqkqFEJFD-p_-OaqFnGAiY8bbzLqys8oCa8uoOgu4g_T-eFZMF8x0yz-Sozfnh-acruKrvHpDwfhKEOXABBRNwfOg_L1Ud-kpOHW7vjgn7m99tqflJPiV2JpBpEWgI2d",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuDGlf31g9iYSCJmPW12IwhM-PiDK7HS9-GjRAkLUclSSMcdJ8ULgVoHcEU_yB652XD272_WVl2kyOVPb-fS-xMCdPi2_Qtuq1S_085rW_FVUheq7NndKbaxxFVujetW_VNr9E_bVqfC0N0HkBY3qE4L2MMW1aHhEBEneL3OHuy5mQ5GQ5vApwFpN7-TbnhnaC7kWmOiHgvrxeEPNbKSSiQjiRjm0eRguEdiZaVnYm8weVDNsxdLetWUXe8rx9hrDDLKsBKBsZ-K8fQL",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuDjUw0lHB6MsvpXADbHmXLF26DMoV29dLzCs6kT-EL-wLGMaidC-0heMJxDcWvpj-6oRwQDIbUBaRIoAO9QI6PhfWdFW6rLY04HwYstnIftNnEKlUGnSmiaj_Nk4kt3sNqe7qU5Ov7z7qX73B363DJ3P0J6gbnosFF5goLUox2KBTQA6V9KT-9Rzz0hBUR55cc2WZ5jwzp39L1CYQl0D50-drShX-sZAa-hwtgVwli0CJ4fge1YYDXrKd4haLMNSDR4GJcn1Tf1sZsc",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuBeD7PdhnMQWiLixHulgAmkQwLucltCJQNTBVz8iGVTHJtn-tunKMBfzQaf9A_qCiHQD1i7os35jNhGx9eZsIIZ8YuIf_0lQwWhH0Fr9vTDj4wkZAFWxsxGW-5DZ30hMOJiJ8-xNt6wwy4XhdFYAlSU78xWaq8IE0cl8RJAsH35xKxx-J9uBzdREnATQhWWoRJwOJCkIDCO7OvVqPJ2UaI9CgQtwWiSjkTiZZMF1sqHmU4vYOms6udUBTkQsJ0mMu8dXO1LGJXJyjrf",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuBhDI-M27TRQj4lpdjifWwf7BB8DzclHxoKl7dD40-5eTTC6dwrIa5o-1SL4x1RKOXtrTP0ceA7P_Yw_0HPwFPOQNQ0NF3RJiJT3xOfWFy5tZcNj2Na8JR9FrXlIzHCoLkkdJ1KnMsEsCXAdhhMbPi-Dwypj-POm05MY4lt0HFAaxNAb4aNSBFHwE1CTBxK1m3Cvv9utU9YgulukWa7Zu-Cxb8rjCqw_7gD_9uMCl1rNq0PNelPtOUnIeCLeCnLdep4makErMxLQT9p",
                            ].map((src, i) => (
                                <img key={i} alt="Partner Logo" className="h-10 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-50 hover:opacity-100" src={src} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FAQ ─────────────────────────────────────────────────────────── */}
            <section ref={faqRef} className="reveal-stagger py-24">
                <div className="max-w-3xl mx-auto px-6 md:px-14">
                    <div className="text-center mb-16">
                        <span className="font-mono-ieee text-[10px] tracking-[0.22em] uppercase text-primary mb-3 block">FAQ</span>
                        <h2 className="font-headline text-4xl font-bold text-on-surface">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-3">
                        {[
                            {
                                q: 'Who can join IEEE SB AOT?',
                                a: 'Any student currently enrolled in Academy of Technology with a passion for engineering, technology, and professional growth is welcome to join us. No prior technical experience is required!',
                                open: true,
                            },
                            {
                                q: 'What are the benefits of membership?',
                                a: 'Members get exclusive access to workshops, technical certifications, networking with IEEE global experts, and funding opportunities for research projects.',
                            },
                            {
                                q: 'How do I register for events?',
                                a: 'Registration for events is typically handled through our internal portal or the specific event link shared on our social media handles and this website.',
                            },
                        ].map(({ q, a, open }) => (
                            <FaqItem key={q} q={q} a={a} open={open} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

/* ─── FAQ item with 3D pop on open ───────────────────────────────────── */
const FaqItem = ({ q, a, open }: { q: string; a: string; open?: boolean }) => {
    const detailsRef = useRef<HTMLDetailsElement | null>(null);
    return (
        <details ref={detailsRef} className="group" open={open}>
            <summary
                className="flex justify-between items-center p-6 cursor-pointer list-none transition-all holo-edge"
                style={{ background: 'rgba(13,19,32,0.6)', border: '1px solid var(--line)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line-cy)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line)')}
            >
                <span className="font-headline font-bold text-on-surface">{q}</span>
                <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180 text-primary flex-shrink-0 ml-4">expand_more</span>
            </summary>
            <div
                className="px-6 pb-6 pt-4 text-on-surface-variant leading-relaxed"
                style={{ background: 'rgba(13,19,32,0.3)', border: '1px solid var(--line)', borderTop: 'none' }}
            >
                {a}
            </div>
        </details>
    );
};

export default Home;

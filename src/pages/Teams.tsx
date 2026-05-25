const execMembers = [
    {
        name: 'Arjun Mehta', role: 'Chairperson',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ30qd22tksGiZZI6x_2L4Ql4mOzurbATPIhu8KO0qylJQ8YROY08qgBbBZTWaEzRqEF49pWhZzR-nU8euoCdCcj6nGglOjqRHExLElrWs0ZT4VYE0ZVPbkuFDm9-nkXgIy6iYaNWGw1dmlb8ntNLVJYnZskg2mEIeKvFtHeK5LG42Ds4sAMoUuVlqXRfULjbrbJ1qWz00QP9WS6RaA9Kwj_RO-MYmLUU7sVaF7TeC9dAkJGZb2rG2GwiPjKwXkjQrryXtsFBd-jkD',
        icons: ['share', 'person', 'link'],
    },
    {
        name: 'Sneha Roy', role: 'Vice-Chairperson',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1irK9gqDphRSNESG5LTVsosdVpPSGfxlCEY-SDmAd5t08OUCy1cly9muBAuSKt-8lpmwKHopK6KzH-LXbg3cXfZ-w0OFhUviwxKlPrtogf03dQG7XZWUCs8ZcUnK8jKYhh5ostSAW7ACM8x5aVZNRq9piRv1Qi2FUlvPScRlMDxNQuQI8HO4_QJ4thjO78xXE9BhZBlUW3AHUZK74qDUK4WIzHibAKexLzTjLk16B8NZIgg5CM1TlfXjNE6o7x4fbZvuJQNwSy0gQ',
        icons: ['share', 'person'],
    },
    {
        name: 'Rohan Das', role: 'Secretary',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0UBPEUi2lmLKFMHcB9wpWiIqcaIRrnNpUJli6TsCdmfDOa5Cton8jcMG7MgPN391qnF4VGb5C9sAVkTTPvZiRHdSSG8H0lx0J3MqpX122zKWMFOXyFItZnwX7fjmO9QHNq8HK2VMaxJl7YgIMOTsR98auKOWgRf9RRrw5Kqr1GbscCX3x01_PZxHT2826pJfCLko82KkzzWvRYMFYIBrdPBs0LFoCRFctyShnjEsus5Wxx6SS8AxevdqeV3YQhejLj9R0VRHgoPLJ',
        icons: ['link'],
    },
];

const techMembers = [
    { name: 'Vikram Singh', role: 'Lead Developer', icons: ['code', 'terminal'], src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7kJyZ_mPmiSkUEljRdXN3hOZtYJ8GjrKfbJU5tv1xz72ZXtbt6IjTxdVOAzQ1Sv79TjMyZYUKrSiA4CpJdU6CLFm7veP3mcbpNRiVO2Mx-srPw9C4Czr5zedqkoLZjwHw2t5hfKAWwXA0j8r_AVUNUDoavcoFAvog1agZPkYRImwNh6cmtd4nRut_xlwZrCNrqmXcHvc5NOe9Pd_xnqv6X9H9_jzRpZiuQPBkpEDC7KmR50Ao-dVk-HlEL7b-j6UPXpO7hq6m7ZDs' },
    { name: 'Ishita Paul', role: 'Cloud Architect', icons: ['database'], src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6P121z-fpFJltDqk0FoQUZDcglGtKIWzR2VZffE4UxX_gYGMwcsd8Kk2O9qUjSO_wpjUtuY1fxWGrfOV-h_Nw0GN_EqX90rFKN-BCqA_GJEpKsM3ir4i1N82mZyRdOyskpy-CkMy8mVzzGFuJzJUXaWKrwZbDsUHa1tnhhtEfuoQAxjJV84TjEwyPAnP_rwB2-9b3Y4wpK1BVizMkdvdgaZGkzPEKJUiWJIN-HDKFlC7uQYn3Ao1WMFBhrj1QtdyzJTwccI2qZECw' },
    { name: 'Aayush Gupta', role: 'Robotics Lead', icons: ['memory'], src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqJ9jddSayiJcYQ9dwIAf3j57iz1fwsG9q50FXWNqeN0N0GX-89tzPOS5p1BFrM0wuic6A8POEAa1evvf274dlKuh1KOvYX7kRP-ybyyMFckCSUX9BGy3i2IGXAWKrBW3Q_JX32S4LerZOnwDplt35SmzBgOWZp4_u96xSQmA4g1vgotqFEGeShNuR7Yjp5PoJ0vGjqTnfuuvMr9OXW8cG269igt2Rjjb2PlBubgkl0bOgfHC2Zp19HaDUfS2IOycaUfGW9t73O3h3' },
    { name: 'Ananya Sen', role: 'AI Researcher', icons: ['security'], src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhqNF3bmGbWUnDVml4oFo5F2srpjIFBD7QidtRlxnYNupy5CIVyV262NwxOAqbo9rfDNjgKEK0eDh1Bbh0fJoPbeUaDiJH0GlpiMTQnlutJzbVJAo7vnyG-K7b_qUBDCwg-H1G-_jXxz-FcLLlL4Z8PIdjSjedZyd0MgdgFw5FAGGM6PCGTV_jFhm_mbGSxrTBXo8ogJ4rS5yFQF_vUT8o90tJuTsRb9Bd9sRcrwiz1qDLuVEtf90ACNpT6T0psStfrFt5Wz92nDfW' },
];

const creativeMembers = [
    { name: 'Priya Sharma', role: 'UI/UX Strategist', icons: ['palette', 'brush'], src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADr3gP_l3FEJ1Zg2rL6cXkjcRjpQHFtcxnVt5enBvEqP5XmqF7AReWi_ShfXmgIfrqujsQg_FXI4B2VCyXdG8-Ll0ftbOCt9zLUPw_eYq7P2EuWh3AVuaBh9Tv-Xv3c2HD4unqInJjqMy_LTYOYo8UvIvESDmmgvFMEN2CPuHGOV27EB-Ez9fYy9vOG1o7vCxtmt1qLplug_4zdGG34hxGmhQNi9geOw9gBSsuMvGnDrSNt6VZ0ozXp7f-sbO6wVqnH4svYmAj9DZ8' },
    { name: 'Kabir Bose', role: 'Media Head', icons: ['videocam', 'camera'], src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaEd_DwmWofHsgx2XqxU5lXeHLwMKHnwj7WEt36BxV09roO0nT-JTgkncdbPkm7j3NT7geJrxqWd6Fbj7giE6BxGgT4pCwtSuG7JvPKDptoyoYR2wGmncjkewYg7yDgfyr8Vsqjaae177B81Z9sHXxqxWkBSVvH8m9os5BICQORwrQ4RiAqdWefz3QQjzG3996PwLEHLDi5RiCTMcLMkVpch8rltgZ9g0gOG1_yaoCa4XcyAnDY2UN31Ntm6nwqTyD_zRzOyYWNsDi' },
    { name: 'Megha Dutta', role: 'Visual Designer', icons: ['layers', 'draw'], src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVqLwr4KSi0KKT_xnOQU0ZaVk-TRqXkjNns2Jfljn1PcZazor6-mJOMyVKfi85reFdt89uaEtfrFqDwpIqrEztoXAO-XN3Wj3ezN5dQumCK5sCvsZf1bF8aldjNnD9gDy-WFiShiJeJRZmxSH3ECAPaA2ih1rLEIg714OoXObTIZUzOf4BlZeGAeFRkQotqF9HGRy1_p8YH4qe2XjKxTQtnKx5qKAXFZnX2Cdq4FFpFK8e1UseIu7yb6Ynrox83TI5Hh3h6SfqNlMN' },
];

const SectionLabel = ({ code, label, align = 'center' }: { code: string; label: string; align?: 'center' | 'left' | 'right' }) => (
    <div className={`flex items-center gap-4 mb-12 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        {align !== 'left' && <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, var(--line))' }} />}
        <div className="flex items-center gap-2 flex-shrink-0">
            <span className="font-mono-ieee text-[9px] tracking-[0.22em] uppercase" style={{ color: 'var(--txt-3)' }}>{code}</span>
            <span className="font-headline text-xl font-bold tracking-tight text-primary uppercase">{label}</span>
        </div>
        {align !== 'right' && <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, var(--line))' }} />}
    </div>
);

const Teams = () => {
    return (
        <main className="pt-28 pb-24 min-h-screen max-w-7xl mx-auto px-6 md:px-12">
            {/* Header */}
            <header className="mb-20 text-center md:text-left">
                <span className="font-mono-ieee text-[10px] tracking-[0.22em] uppercase text-primary block mb-4">Team / Members</span>
                <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-on-surface">
                    Our <span className="text-gradient">Architects</span>
                </h1>
                <p className="max-w-2xl text-on-surface-variant text-lg leading-relaxed">
                    Meet the minds behind the innovation. A collaborative force of engineers, designers, and visionaries shaping the future of technology at AOT.
                </p>
            </header>

            {/* ─── Executive Core ────────────────────────────────────────── */}
            <section className="mb-24">
                <SectionLabel code="01 /" label="Executive Core" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {execMembers.map(({ name, role, src, icons }) => (
                        <div key={name} className="glass-card overflow-hidden group transition-all duration-300 hover:translate-y-[-4px] relative">
                            {/* Top accent */}
                            <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to right, var(--cy), transparent)' }} />
                            <div className="relative aspect-square overflow-hidden">
                                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108" src={src} alt={name} style={{ transition: 'transform 0.5s ease' }} />
                                <div className="member-overlay absolute inset-0 flex items-center justify-center gap-4" style={{ background: 'rgba(5,7,13,0.7)', backdropFilter: 'blur(8px)' }}>
                                    {icons.map(icon => (
                                        <a key={icon} className="w-10 h-10 flex items-center justify-center text-primary hover:text-on-primary transition-all" style={{ border: '1px solid var(--line-cy)', background: 'transparent' }} onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--cy)'; el.style.color = 'var(--bg-0)'; }} onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'var(--cy)'; }} href="#">
                                            <span className="material-symbols-outlined text-xl">{icon}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6" style={{ borderTop: '1px solid var(--line)' }}>
                                <h3 className="font-headline text-lg font-bold text-on-surface mb-1">{name}</h3>
                                <p className="font-mono-ieee text-[10px] tracking-[0.15em] uppercase text-primary">{role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Technical Operations ──────────────────────────────────── */}
            <section className="mb-24">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, var(--line))' }} />
                    <span className="font-mono-ieee text-[9px] tracking-[0.22em] uppercase" style={{ color: 'var(--txt-3)' }}>02 /</span>
                    <h2 className="font-headline text-xl font-bold text-primary uppercase tracking-tight">Technical Operations</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {techMembers.map(({ name, role, icons, src }) => (
                        <div key={name} className="glass-card overflow-hidden group relative">
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src={src} alt={name} />
                                <div className="member-overlay absolute bottom-0 left-0 right-0 p-3 flex justify-center gap-3" style={{ background: 'linear-gradient(to top, rgba(5,7,13,0.9), transparent)' }}>
                                    {icons.map(icon => (
                                        <span key={icon} className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>{icon}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4" style={{ background: 'rgba(12,17,28,0.5)', borderTop: '1px solid var(--line)' }}>
                                <h4 className="font-headline font-bold text-sm text-on-surface truncate">{name}</h4>
                                <p className="font-mono-ieee text-[9px] tracking-[0.15em] uppercase mt-0.5" style={{ color: 'var(--txt-3)' }}>{role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Creative Collective ───────────────────────────────────── */}
            <section className="mb-24">
                <div className="flex items-center gap-4 mb-12 flex-row-reverse">
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, var(--line))' }} />
                    <span className="font-mono-ieee text-[9px] tracking-[0.22em] uppercase" style={{ color: 'var(--txt-3)' }}>03 /</span>
                    <h2 className="font-headline text-xl font-bold text-secondary uppercase tracking-tight">Creative Collective</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {creativeMembers.map(({ name, role, icons, src }) => (
                        <div key={name} className="glass-card flex items-center p-4 gap-5 group hover:translate-y-[-3px] transition-transform">
                            <div className="w-20 h-20 overflow-hidden flex-shrink-0" style={{ border: '1px solid var(--line)' }}>
                                <img className="w-full h-full object-cover" src={src} alt={name} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-headline font-bold text-base text-on-surface">{name}</h4>
                                <p className="font-mono-ieee text-[10px] tracking-[0.12em] uppercase text-secondary mb-3">{role}</p>
                                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {icons.map(icon => (
                                        <span key={icon} className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors" style={{ fontSize: '18px' }}>{icon}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Teams;

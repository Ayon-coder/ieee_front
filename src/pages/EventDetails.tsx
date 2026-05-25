import { EventDetailsBackdrop } from '../components/PageBackdrops';
import { useScrollReveal, useTilt3D } from '../lib/use3d';

const SpeakerCard = ({ name, role, src }: { name: string; role: string; src: string }) => {
    const { bind } = useTilt3D({ max: 6 });
    return (
        <div className="glass-card tilt-3d p-4 flex items-center gap-4 group transition-transform" {...bind}>
            <div className="tilt-layer flex items-center gap-4" style={{ '--z': '16px' } as React.CSSProperties}>
                <img alt={name} className="w-14 h-14 object-cover flex-shrink-0 grayscale group-hover:grayscale-0 transition-all" src={src} />
                <div>
                    <h4 className="font-headline font-bold text-on-surface text-sm">{name}</h4>
                    <p className="font-mono-ieee text-[10px] tracking-[0.12em] uppercase text-primary mt-0.5">{role}</p>
                </div>
            </div>
        </div>
    );
};

const EventDetails = () => {
    const aboutRef = useScrollReveal<HTMLElement>(0.15);
    const scheduleRef = useScrollReveal<HTMLElement>(0.15);
    const speakersRef = useScrollReveal<HTMLElement>(0.15);
    const testimonialTilt = useTilt3D({ max: 6 });

    const speakers = [
        { name: 'Dr. Elena Kostic', role: 'Quantum Research Lead', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYVLNmIrrJGgqCFjA7mYn4c5msUiO-vVC37WD9pXKIUetqh-GVjmd0GRtnS3pJmEuOAuEZ-yb12TrkgVPQvyJ243uE9AYY04T68Zih62W9Oxtt2yXPqnvlgVGlFfwnHJBQpXaIyPCbQiebKL5Q8b71tf8xwVDx42oo9R7KzYe7eW8eXVPQAV69Pz5hPrKN7qswTYAwfSsoFD4r1oBXlGTGVXwAtkvuibQJFyYEwMZuq33yrotmCS5AL95j4JK3vMOtO-ssjIjAvm0-' },
        { name: 'Marcus Chen', role: 'Senior AI Engineer', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLVxqbB75ZR_gI7gvQ-JBBoZjlRdNo6dHChr6wBX748yEsXdEhgz3BQwZugnCFlbaYRMQga6mR25kFIpElLgb4HN5d9lqUQYMIGOwozjLJZQ-B_qfqLp-Ud3mohADr9yvKIHnSX0NnVMJS6NJe1A-d4AOvxxatptRKzY4D9MscOB2Sdx0DQib_CsBPPKPw3QCFugIePYM8WnulM7kvI3WUUfjrPhOufeZLZ3s_ZMiWCi_BVSkeY-MNI37anZkdYaoQG2AkVTXK-rD3' },
        { name: 'Sarah Jenkins', role: 'IoT Specialist', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqHsa28BmAajax9IBr6zwbxwPIoM1Knn1L1sSNiTdZTgIN5C8zvlh9etMfMWfL4l1zQo0FNrQjeUTCHVcL6lnpLw78iwstwwoDqVZgpjESFoWatE23O-xdFurh2pY2LbfFaQsMSc-bB6pw3x0x3BU4GeDVG34VlJylWcOQLW_L1DDYofwIeUA_dVUCq9z1ozIiCX9Mni11DKFXnT833f-E-evgfN0rGEFGic0-aizmCBWQVGNYkbaryT_wtvJQJN8nf23g2rjlp3p' },
    ];

    const schedule = [
        { time: '10:00 AM', title: 'Inauguration Ceremony', desc: 'Opening remarks by our faculty advisor and the Chief Guest.', active: true },
        { time: '11:30 AM', title: 'Keynote: The Qubit Revolution', desc: 'Dr. Elena Kostic discusses the transition from classical to quantum architectures.', active: false },
        { time: '01:00 PM', title: 'Networking Lunch', desc: 'Casual interaction session at the university dining hall.', active: false },
        { time: '02:30 PM', title: 'Panel Discussion: Ethical Quantum AI', desc: 'A deep dive into the security and ethics of high-speed computation.', active: true },
    ];

    return (
        <main className="relative overflow-hidden scene-3d">
            <div className="absolute inset-0 -z-10">
                <EventDetailsBackdrop />
            </div>
            <div className="max-w-7xl mx-auto py-28 grid grid-cols-1 lg:grid-cols-12 gap-14 px-6 md:px-12 relative">
            {/* ─── Left Column ─────────────────────────────────────────────── */}
            <div className="lg:col-span-8 space-y-20">
                {/* About */}
                <section ref={aboutRef} className="reveal">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="font-mono-ieee text-[10px] tracking-[0.2em] uppercase text-primary">01 /</span>
                        <h2 className="font-headline text-3xl font-bold text-on-surface">About the Event</h2>
                    </div>
                    <div className="space-y-5 text-on-surface-variant leading-relaxed">
                        <p className="text-lg">Step into the future of computing with "Quantum Frontiers," the flagship technical symposium organized by the IEEE Student Branch at AOT. This event bridges the gap between theoretical research and practical engineering in the realm of quantum technologies.</p>
                        <p>Participants will engage with industry leaders, participate in hands-on workshops, and witness groundbreaking demonstrations of quantum entanglement and algorithmic efficiency. Whether you're a seasoned researcher or a curious beginner, this symposium offers a unique lens into the next era of digital transformation.</p>
                    </div>
                </section>

                {/* Timeline */}
                <section ref={scheduleRef} className="reveal-stagger">
                    <div className="flex items-center gap-3 mb-12">
                        <span className="font-mono-ieee text-[10px] tracking-[0.2em] uppercase text-primary">02 /</span>
                        <h2 className="font-headline text-3xl font-bold text-on-surface">Event Schedule</h2>
                    </div>
                    <div className="space-y-0">
                        {schedule.map(({ time, title, desc, active }, i) => (
                            <div key={i} className="flex gap-6 relative pb-8 last:pb-0">
                                {/* Line */}
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 flex-shrink-0 mt-1" style={{ background: active ? 'var(--cy)' : 'var(--line-2)', boxShadow: active ? '0 0 12px rgba(0,229,255,0.5)' : 'none' }} />
                                    {i < schedule.length - 1 && <div className="w-px flex-1 mt-2" style={{ background: 'var(--line)', minHeight: '32px' }} />}
                                </div>
                                <div className="pb-2">
                                    <span className="font-mono-ieee text-[11px] tracking-widest uppercase mb-1 block" style={{ color: active ? 'var(--cy)' : 'var(--txt-3)' }}>{time}</span>
                                    <h3 className="font-headline text-lg font-bold text-on-surface mb-1">{title}</h3>
                                    <p className="text-on-surface-variant text-sm">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* ─── Right Column ────────────────────────────────────────────── */}
            <div className="lg:col-span-4 space-y-12">
                {/* Speakers */}
                <section ref={speakersRef} className="reveal-stagger">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="font-mono-ieee text-[10px] tracking-[0.2em] uppercase text-primary">03 /</span>
                        <h2 className="font-headline text-xl font-bold text-on-surface">Speakers</h2>
                    </div>
                    <div className="space-y-4">
                        {speakers.map((s) => (
                            <SpeakerCard key={s.name} {...s} />
                        ))}
                    </div>
                </section>

                {/* Testimonial */}
                <section className="corner-accent holo-edge tilt-3d depth-card p-7 relative" {...testimonialTilt.bind}>
                    <div className="tilt-layer" style={{ '--z': '24px' } as React.CSSProperties}>
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, var(--cy), transparent)' }} />
                    <span className="material-symbols-outlined text-primary mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                    <p className="text-on-surface italic leading-relaxed mb-6 text-sm">
                        "Last year's symposium completely changed my perspective on distributed systems. A must-attend for every engineering student!"
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center font-mono-ieee text-[11px] font-bold text-primary" style={{ border: '1px solid var(--line-cy)', background: 'rgba(0,229,255,0.06)' }}>JD</div>
                        <div>
                            <p className="text-sm font-bold text-on-surface">Jane Doe</p>
                            <p className="font-mono-ieee text-[9px] tracking-widest uppercase" style={{ color: 'var(--txt-3)' }}>Computer Science Senior</p>
                        </div>
                    </div>
                    </div>
                </section>
            </div>
            </div>
        </main>
    );
};

export default EventDetails;

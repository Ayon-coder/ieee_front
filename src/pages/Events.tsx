import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import type { EventRecord } from '../lib/api';
import { useScrollReveal, useTilt3D } from '../lib/use3d';

/* ─── EventCard with 3D tilt + holo edge ──────────────────────────────── */
type EventCardProps = {
    event: EventRecord;
    getCategoryLabel: (c?: string) => string;
    formatDate: (d?: string) => string;
    onCertificate: () => void;
    onLearnMore: () => void;
};
const EventCard = ({ event, getCategoryLabel, formatDate, onCertificate, onLearnMore }: EventCardProps) => {
    const { bind } = useTilt3D({ max: 7 });
    return (
        <article
            className="glass-card holo-edge tilt-3d flex flex-col group transition-all duration-300 relative"
            {...bind}
        >
            <div className="tilt-layer flex flex-col" style={{ '--z': '20px' } as React.CSSProperties}>
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to right, var(--cy), transparent)' }} />

                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                    {event.imageUrl ? (
                        <img
                            alt={event.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            src={event.imageUrl}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                (e.currentTarget.nextElementSibling as HTMLElement | null)?.classList.remove('hidden');
                            }}
                        />
                    ) : null}
                    <div className={`absolute inset-0 flex items-center justify-center ${event.imageUrl ? 'hidden' : ''}`} style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.05), rgba(255,184,77,0.05))' }}>
                        <span className="material-symbols-outlined text-5xl" style={{ color: 'var(--line-cy)' }}>event</span>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(5,7,13,0.7), transparent 60%)' }} />
                    {/* Category badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1" style={{ background: 'rgba(8,11,20,0.85)', border: '1px solid var(--line-cy)' }}>
                        <span className="font-mono-ieee text-[9px] tracking-[0.18em] uppercase text-primary">{getCategoryLabel(event.category)}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-7 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-sm" style={{ color: 'var(--txt-3)', fontSize: '14px' }}>calendar_today</span>
                        <span className="font-mono-ieee text-[10px] tracking-wider" style={{ color: 'var(--txt-3)' }}>{formatDate(event.date)}</span>
                    </div>
                    <h3 className="font-headline text-xl font-bold mb-3 leading-tight text-on-surface group-hover:text-primary transition-colors">
                        {event.name}
                    </h3>
                    <p className="text-sm mb-8 line-clamp-3" style={{ color: 'var(--txt-2)' }}>
                        {event.description || 'Join us for this exciting IEEE event.'}
                    </p>
                    <div className="mt-auto flex gap-3">
                        <button
                            type="button"
                            onClick={onCertificate}
                            className="btn-gradient flex-1 py-3 text-[10px] tracking-widest uppercase font-bold"
                        >
                            View Certificate
                        </button>
                        <button
                            type="button"
                            onClick={onLearnMore}
                            className="flex-1 py-3 font-mono-ieee text-[10px] tracking-widest uppercase font-bold text-on-surface hover:text-primary transition-colors"
                            style={{ border: '1px solid var(--line)' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line-cy)')}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line)')}
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

const PastEventTile = ({ month, title, desc }: { month: string; title: string; desc: string }) => {
    const { bind } = useTilt3D({ max: 5 });
    return (
        <div
            className="p-6 tilt-3d transition-all duration-300 group relative"
            style={{ background: 'rgba(13,19,32,0.4)', border: '1px solid var(--line)', opacity: 0.85 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--line-cy)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; }}
            {...bind}
        >
            <div className="tilt-layer" style={{ '--z': '18px' } as React.CSSProperties}>
                <div className="font-mono-ieee text-[9px] tracking-[0.22em] uppercase text-primary mb-3">{month}</div>
                <h4 className="font-headline font-bold text-on-surface mb-2">{title}</h4>
                <p className="text-xs leading-relaxed mb-5" style={{ color: 'var(--txt-3)' }}>{desc}</p>
                <a className="font-mono-ieee text-[10px] tracking-wider uppercase flex items-center gap-1.5 text-on-surface hover:text-primary transition-colors" href="#">
                    View Recap
                    <span className="material-symbols-outlined text-xs" style={{ fontSize: '14px' }}>arrow_forward</span>
                </a>
            </div>
        </div>
    );
};

const Events = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<EventRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const upcomingRef = useScrollReveal<HTMLDivElement>(0.1);
    const pastRef = useScrollReveal<HTMLDivElement>(0.1);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const data = await api.getEvents();
                setEvents(data);
                setError('');
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to load events. Please try again later.');
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Date TBA';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const getCategoryLabel = (category?: string) => {
        const map: Record<string, string> = {
            Workshop: 'Workshop', Hackathon: 'Hackathon',
            Seminar: 'Seminar', Conference: 'Conference', Webinar: 'Webinar',
        };
        return map[category ?? ''] ?? 'Event';
    };

    const pastEvents = [
        { month: 'April 2024', title: 'Signal Processing Expo', desc: 'Showcasing graduate research in audio and visual signal manipulation.' },
        { month: 'March 2024', title: 'Cloud Infrastructure 101', desc: 'Hands-on session with AWS and Azure fundamentals for beginners.' },
        { month: 'Feb 2024',   title: 'IEEE Day Celebration', desc: 'Networking and awards ceremony for active student members.' },
        { month: 'Jan 2024',   title: 'PCB Design Workshop', desc: 'Mastering Eagle and KiCad for hardware prototyping.' },
    ];

    return (
        <main className="pt-24 pb-20 scene-3d">
            {/* ─── HERO ────────────────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto py-16 md:py-24 text-center relative overflow-hidden px-6 md:px-12">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-5%] w-[40%] h-[80%] rounded-full opacity-15 float-y-slow" style={{ background: 'radial-gradient(circle, var(--cy), transparent 70%)', filter: 'blur(80px)' }} />
                    <div className="absolute bottom-[-20%] right-[-5%] w-[35%] h-[80%] rounded-full opacity-10 float-y" style={{ background: 'radial-gradient(circle, var(--am), transparent 70%)', filter: 'blur(80px)' }} />
                </div>
                <div className="relative z-10 reveal-stagger is-visible">
                    <span className="font-mono-ieee text-[10px] tracking-[0.22em] uppercase text-primary block mb-4">Events / Archive</span>
                    <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
                        Technological <span className="text-gradient">Horizons</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl font-light" style={{ color: 'var(--txt-2)' }}>
                        Explore the nexus of innovation and academia through our curated workshops, seminars, and hackathons.
                    </p>
                </div>
            </section>

            {/* ─── UPCOMING EVENTS ─────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto py-12 px-6 md:px-12">
                <div className="flex items-center gap-4 mb-12">
                    <span className="font-mono-ieee text-[10px] tracking-[0.22em] uppercase text-primary">Upcoming</span>
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, var(--line-cy), transparent)' }} />
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="relative w-10 h-10">
                            <div className="absolute inset-0 border border-primary/20 animate-spin" style={{ borderTopColor: 'var(--cy)', borderRadius: 0 }} />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-6 mb-8" style={{ background: 'rgba(255,61,113,0.08)', border: '1px solid rgba(255,61,113,0.25)', borderLeft: '2px solid var(--mg)' }}>
                        <p className="font-mono-ieee text-[11px] tracking-widest uppercase text-[var(--mg)] mb-2">Error Loading Events</p>
                        <p className="text-sm text-on-surface-variant">{error}</p>
                        <p className="font-mono-ieee text-[10px] tracking-wider mt-3" style={{ color: 'var(--txt-3)' }}>Ensure backend is running on port 5001</p>
                    </div>
                )}

                {!loading && events.length === 0 && !error && (
                    <div className="text-center py-16">
                        <p className="font-mono-ieee text-[11px] tracking-widest uppercase text-on-surface-variant">No events available at this time.</p>
                    </div>
                )}

                <div ref={upcomingRef} className="reveal-stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            getCategoryLabel={getCategoryLabel}
                            formatDate={formatDate}
                            onCertificate={() => navigate(`/events/${event.id}/certificate`, { state: { event } })}
                            onLearnMore={() => navigate('/event-details')}
                        />
                    ))}
                </div>
            </section>

            {/* ─── PAST EVENTS ─────────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto py-20 px-6 md:px-12">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, var(--line))' }} />
                    <span className="font-mono-ieee text-[10px] tracking-[0.22em] uppercase text-on-surface-variant">Past Milestones</span>
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, var(--line))' }} />
                </div>
                <div ref={pastRef} className="reveal-stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {pastEvents.map(({ month, title, desc }) => (
                        <PastEventTile key={title} month={month} title={title} desc={desc} />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Events;

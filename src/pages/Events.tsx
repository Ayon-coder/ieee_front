
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import type { EventRecord } from '../lib/api';

const Events = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<EventRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch {
            return dateString;
        }
    };

    const getCategoryColor = (category?: string) => {
        const categoryMap = {
            'Workshop': 'Workshop',
            'Hackathon': 'Hackathon',
            'Seminar': 'Seminar',
            'Conference': 'Conference',
            'Webinar': 'Webinar'
        };
        if (!category) {
            return 'Event';
        }

        return categoryMap[category as keyof typeof categoryMap] || 'Event';
    };

    return (
        <>
            <main className="pt-24 pb-20">
{/*  Hero Section  */}
<section className="max-w-7xl mx-auto py-12 md:py-20 text-center relative overflow-hidden px-12">
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary blur-[120px] rounded-full"></div>
<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary-container blur-[120px] rounded-full"></div>
</div>
<h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 relative">
                Technological <span className="text-gradient">Horizons</span>
</h1>
<p className="text-on-surface-variant max-w-2xl mx-auto text-lg md:text-xl font-light">
                Explore the nexus of innovation and academia through our curated workshops, seminars, and hackathons.
            </p>
</section>
{/*  Upcoming Events  */}
<section className="max-w-7xl mx-auto py-12 px-12">
<div className="flex items-center justify-between mb-12">
<h2 className="font-headline text-3xl font-bold tracking-tight">Upcoming Events</h2>
<div className="h-px flex-1 mx-8 bg-gradient-to-r from-outline-variant/50 to-transparent"></div>
</div>

{loading && (
    <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
)}

{error && (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-red-800">
        <p className="font-semibold mb-2">⚠ Error Loading Events</p>
        <p className="text-sm">{error}</p>
        <p className="text-xs mt-3">Ensure the backend server is running on port 5001</p>
    </div>
)}

{!loading && events.length === 0 && !error && (
    <div className="text-center py-12">
        <p className="text-on-surface-variant">No events available at this time.</p>
    </div>
)}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
{events.map((event) => (
    <article key={event.id} className="glass-panel ghost-border rounded-full overflow-hidden flex flex-col group transition-all duration-300 hover:scale-[1.02] hover:bg-surface-bright/20">
        <div className="relative h-56 overflow-hidden">
            {event.imageUrl ? (
                <img 
                    alt={event.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src={event.imageUrl}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                />
            ) : null}
            <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 to-tertiary-container/10 flex items-center justify-center ${event.imageUrl ? 'hidden' : ''}`}>
                <span className="material-symbols-outlined text-6xl text-primary/20">event</span>
            </div>
            <div className="absolute top-4 left-4 glass-panel px-3 py-1 rounded-lg text-xs font-bold tracking-widest text-primary uppercase">
                {getCategoryColor(event.category)}
            </div>
        </div>
        <div className="p-8 flex flex-col flex-1">
            <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-4">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                <span>{formatDate(event.date)}</span>
            </div>
            <h3 className="font-headline text-2xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors">
                {event.name}
            </h3>
            <p className="text-on-surface-variant text-sm mb-8 line-clamp-3">
                {event.description || 'Join us for this exciting IEEE event.'}
            </p>
            <div className="mt-auto flex gap-4">
                <button
                    type="button"
                    onClick={() => navigate(`/events/${event.id}/certificate`, { state: { event } })}
                    className="btn-gradient flex-1 py-3 rounded-xl font-headline font-bold text-on-primary text-sm tracking-wide hover:shadow-lg transition-shadow"
                >
                    View Certificate
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/event-details')}
                    className="flex-1 py-3 rounded-xl border border-outline/40 text-on-surface font-headline font-bold text-sm tracking-wide hover:bg-white/5 transition-colors"
                >
                    Learn More
                </button>
            </div>
        </div>
    </article>
))}
</div>
</section>
{/*  Past Events  */}
<section className="max-w-7xl mx-auto py-20 px-12">
<div className="flex items-center justify-between mb-12">
<h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface-variant">Past Milestones</h2>
<div className="h-px flex-1 mx-8 bg-gradient-to-r from-outline-variant/30 to-transparent"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{/*  Past Card 1  */}
<div className="bg-surface-container-low/40 rounded-full border border-outline-variant/20 p-6 opacity-80 hover:opacity-100 transition-opacity">
<div className="text-primary font-headline text-xs font-bold uppercase tracking-widest mb-3">April 2024</div>
<h4 className="font-headline font-bold mb-2">Signal Processing Expo</h4>
<p className="text-on-surface-variant text-xs mb-4">Showcasing graduate research in audio and visual signal manipulation.</p>
<a className="text-xs font-bold text-on-surface flex items-center gap-1 hover:text-primary transition-colors" href="#">
                        View Recap <span className="material-symbols-outlined text-xs">arrow_forward</span>
</a>
</div>
{/*  Past Card 2  */}
<div className="bg-surface-container-low/40 rounded-full border border-outline-variant/20 p-6 opacity-80 hover:opacity-100 transition-opacity">
<div className="text-primary font-headline text-xs font-bold uppercase tracking-widest mb-3">March 2024</div>
<h4 className="font-headline font-bold mb-2">Cloud Infrastructure 101</h4>
<p className="text-on-surface-variant text-xs mb-4">Hands-on session with AWS and Azure fundamentals for beginners.</p>
<a className="text-xs font-bold text-on-surface flex items-center gap-1 hover:text-primary transition-colors" href="#">
                        View Recap <span className="material-symbols-outlined text-xs">arrow_forward</span>
</a>
</div>
{/*  Past Card 3  */}
<div className="bg-surface-container-low/40 rounded-full border border-outline-variant/20 p-6 opacity-80 hover:opacity-100 transition-opacity">
<div className="text-primary font-headline text-xs font-bold uppercase tracking-widest mb-3">Feb 2024</div>
<h4 className="font-headline font-bold mb-2">IEEE Day Celebration</h4>
<p className="text-on-surface-variant text-xs mb-4">Networking and awards ceremony for active student members.</p>
<a className="text-xs font-bold text-on-surface flex items-center gap-1 hover:text-primary transition-colors" href="#">
                        View Recap <span className="material-symbols-outlined text-xs">arrow_forward</span>
</a>
</div>
{/*  Past Card 4  */}
<div className="bg-surface-container-low/40 rounded-full border border-outline-variant/20 p-6 opacity-80 hover:opacity-100 transition-opacity">
<div className="text-primary font-headline text-xs font-bold uppercase tracking-widest mb-3">Jan 2024</div>
<h4 className="font-headline font-bold mb-2">PCB Design Workshop</h4>
<p className="text-on-surface-variant text-xs mb-4">Mastering Eagle and KiCad for hardware prototyping.</p>
<a className="text-xs font-bold text-on-surface flex items-center gap-1 hover:text-primary transition-colors" href="#">
                        View Recap <span className="material-symbols-outlined text-xs">arrow_forward</span>
</a>
</div>
</div>
</section>
</main>
        </>
    );
};

export default Events;

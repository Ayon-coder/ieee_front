
const EventDetails = () => {
    return (
        <>
            <main className="max-w-7xl mx-auto py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 px-12">
{/*  Left Column: Description & Timeline  */}
<div className="lg:col-span-8 space-y-24">
{/*  Description  */}
<section>
<h2 className="text-3xl font-headline font-bold mb-8 text-on-surface">About the Event</h2>
<div className="prose prose-invert max-w-none text-on-surface-variant leading-relaxed space-y-6">
<p className="text-lg">Step into the future of computing with "Quantum Frontiers," the flagship technical symposium organized by the IEEE Student Branch at AOT. This event bridges the gap between theoretical research and practical engineering in the realm of quantum technologies.</p>
<p>Participants will engage with industry leaders, participate in hands-on workshops, and witness groundbreaking demonstrations of quantum entanglement and algorithmic efficiency. Whether you're a seasoned researcher or a curious beginner, this symposium offers a unique lens into the next era of digital transformation.</p>
</div>
</section>
{/*  Timeline  */}
<section>
<h2 className="text-3xl font-headline font-bold mb-12 text-on-surface text-center lg:text-left">Event Schedule</h2>
<div className="relative pl-8 border-l border-outline-variant/50 space-y-12">
<div className="relative">
<div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-primary ring-4 ring-surface-container-lowest"></div>
<div className="space-y-2">
<span className="text-primary font-bold text-sm">10:00 AM</span>
<h3 className="text-xl font-headline font-bold text-on-surface">Inauguration Ceremony</h3>
<p className="text-on-surface-variant">Opening remarks by our faculty advisor and the Chief Guest.</p>
</div>
</div>
<div className="relative">
<div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-outline-variant ring-4 ring-surface-container-lowest"></div>
<div className="space-y-2">
<span className="text-on-surface-variant font-bold text-sm">11:30 AM</span>
<h3 className="text-xl font-headline font-bold text-on-surface">Keynote: The Qubit Revolution</h3>
<p className="text-on-surface-variant">Dr. Elena Kostic discusses the transition from classical to quantum architectures.</p>
</div>
</div>
<div className="relative">
<div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-outline-variant ring-4 ring-surface-container-lowest"></div>
<div className="space-y-2">
<span className="text-on-surface-variant font-bold text-sm">01:00 PM</span>
<h3 className="text-xl font-headline font-bold text-on-surface">Networking Lunch</h3>
<p className="text-on-surface-variant">Casual interaction session at the university dining hall.</p>
</div>
</div>
<div className="relative">
<div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-primary ring-4 ring-surface-container-lowest"></div>
<div className="space-y-2">
<span className="text-primary font-bold text-sm">02:30 PM</span>
<h3 className="text-xl font-headline font-bold text-on-surface">Panel Discussion: Ethical Quantum AI</h3>
<p className="text-on-surface-variant">A deep dive into the security and ethics of high-speed computation.</p>
</div>
</div>
</div>
</section>
</div>
{/*  Right Column: Speakers & Context  */}
<div className="lg:col-span-4 space-y-16">
{/*  Speakers  */}
<section>
<h2 className="text-2xl font-headline font-bold mb-8 text-on-surface">Featured Speakers</h2>
<div className="grid grid-cols-1 gap-6">
{/*  Speaker Card  */}
<div className="glass-panel p-4 rounded-2xl flex items-center gap-4 group hover:bg-surface-container-high transition-all">
<img alt="Speaker" className="w-16 h-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" data-alt="Professional portrait of a middle-aged female scientist with short dark hair in a modern tech office setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYVLNmIrrJGgqCFjA7mYn4c5msUiO-vVC37WD9pXKIUetqh-GVjmd0GRtnS3pJmEuOAuEZ-yb12TrkgVBQvyJ243uE9AYY04T68Zih62W9Oxtt2yXPqnvlgVGlFfwnHJBQpXaIyPCbQiebKL5Q8b71tf8xwVDx42oo9R7KzYe7eW8eXVPQAV69Pz5hPrKN7qswTYAwfSsoFD4r1oBXlGTGVXwAtkvuibQJFyYEwMZuq33yrotmCS5AL95j4JK3vMOtO-ssjIjAvm0-"/>
<div>
<h4 className="font-headline font-bold text-on-surface">Dr. Elena Kostic</h4>
<p className="text-sm text-primary">Quantum Research Lead</p>
</div>
</div>
<div className="glass-panel p-4 rounded-2xl flex items-center gap-4 group hover:bg-surface-container-high transition-all">
<img alt="Speaker" className="w-16 h-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" data-alt="Portrait of a young male software engineer with glasses smiling against a clean architectural background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLVxqbB75ZR_gI7gvQ-JBBoZjlRdNo6dHChr6wBX748yEsXdEhgz3BQwZugnCFlbaYRMQga6mR25kFIpElLgb4HN5d9lqUQYMIGOwozjLJZQ-B_qfqLp-Ud3mohADr9yvKIHnSX0NnVMJS6NJe1A-d4AOvxxatptRKzY4D9MscOB2Sdx0DQib_CsBPPKPw3QCFugIePYM8WnulM7kvI3WUUfjrPhOufeZLZ3s_ZMiWCi_BVSkeY-MNI37anZkdYaoQG2AkVTXK-rD3"/>
<div>
<h4 className="font-headline font-bold text-on-surface">Marcus Chen</h4>
<p className="text-sm text-primary">Senior AI Engineer</p>
</div>
</div>
<div className="glass-panel p-4 rounded-2xl flex items-center gap-4 group hover:bg-surface-container-high transition-all">
<img alt="Speaker" className="w-16 h-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" data-alt="Headshot of a focused woman in a lab coat with sophisticated industrial machinery in the background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqHsa28BmAajax9IBr6zwbxwPIoM1Knn1L1sSNiTdZTgIN5C8zvlh9etMfMWfL4l1zQo0FNrQjeUTCHVcL6lnpLw78iwstwwoDqVZgpjESFoWatE23O-xdFurh2pY2LbfFaQsMSc-bB6pw3x0x3BU4GYeDVG34VlJylWcOQLW_L1DDYofwIeUA_dVUCq9z1ozIiCX9Mni11DKFXnT833f-E-evgfN0rGEFGic0-aizmCBWQVGNYkbaryT_wtvJQJN8nf23g2rjlp3p"/>
<div>
<h4 className="font-headline font-bold text-on-surface">Sarah Jenkins</h4>
<p className="text-sm text-primary">IoT Specialist</p>
</div>
</div>
</div>
</section>
{/*  Testimonial Widget  */}
<section className="glass-panel p-8 rounded-3xl border border-primary/5">
<span className="material-symbols-outlined text-primary mb-4" data-weight="fill">format_quote</span>
<p className="text-on-surface italic leading-relaxed mb-6">"Last year's symposium completely changed my perspective on distributed systems. A must-attend for every engineering student!"</p>
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-xs font-bold">JD</div>
<div>
<p className="text-sm font-bold text-on-surface">Jane Doe</p>
<p className="text-xs text-on-surface-variant">Computer Science Senior</p>
</div>
</div>
</section>
</div>
</main>
        </>
    );
};

export default EventDetails;

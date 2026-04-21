
const Contact = () => {
    return (
        <>
            <main className="min-h-screen pt-32 pb-20 px-6 md:px-14 relative overflow-hidden">
{/*  Background Ambient Glows  */}
<div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10"></div>
<div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary-container/20 blur-[100px] rounded-full -z-10"></div>
<div className="max-w-7xl mx-auto">
{/*  Header Section  */}
<div className="mb-20 max-w-2xl">
<h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tight mb-6 leading-[1.1]">
                    Let's Build the <span className="text-gradient">Future</span> Together.
                </h1>
<p className="text-on-surface-variant text-lg md:text-xl leading-relaxed">
                    Have a question about our upcoming events, membership, or technical projects? Our team at the Academy of Technology is here to help.
                </p>
</div>
{/*  Two-Column Layout  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
{/*  Left Column: Contact Info  */}
<div className="lg:col-span-5 space-y-12">
<div className="space-y-8">
{/*  Contact Item  */}
<div className="flex items-start gap-6 group">
<div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center ghost-border text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
<span className="material-symbols-outlined" data-icon="mail">mail</span>
</div>
<div>
<h3 className="font-headline font-bold text-lg mb-1">Email Us</h3>
<p className="text-on-surface-variant mb-1 font-medium">General Inquiries</p>
<a className="text-primary hover:underline transition-all" href="mailto:contact@ieeesbaot.org">contact@ieeesbaot.org</a>
</div>
</div>
{/*  Contact Item  */}
<div className="flex items-start gap-6 group">
<div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center ghost-border text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
<span className="material-symbols-outlined" data-icon="call">call</span>
</div>
<div>
<h3 className="font-headline font-bold text-lg mb-1">Call Us</h3>
<p className="text-on-surface-variant mb-1 font-medium">Mon - Fri, 9am - 5pm</p>
<p className="text-on-surface">+91 98765 43210</p>
</div>
</div>
{/*  Contact Item  */}
<div className="flex items-start gap-6 group">
<div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center ghost-border text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
<span className="material-symbols-outlined" data-icon="location_on">location_on</span>
</div>
<div>
<h3 className="font-headline font-bold text-lg mb-1">Visit Us</h3>
<p className="text-on-surface-variant mb-1 font-medium">Academy of Technology</p>
<p className="text-on-surface leading-relaxed">Adisaptagram, Hooghly,<br/>West Bengal 712121</p>
</div>
</div>
</div>
{/*  Social Media  */}
<div className="pt-8 border-t border-white/5">
<h4 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant mb-6">Connect With Us</h4>
<div className="flex gap-4">
<a className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center hover:bg-surface-container-highest transition-colors ghost-border" href="#">
<span className="material-symbols-outlined text-sm" data-icon="public">public</span>
</a>
<a className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center hover:bg-surface-container-highest transition-colors ghost-border" href="#">
<span className="material-symbols-outlined text-sm" data-icon="groups">groups</span>
</a>
<a className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center hover:bg-surface-container-highest transition-colors ghost-border" href="#">
<span className="material-symbols-outlined text-sm" data-icon="share">share</span>
</a>
</div>
</div>
{/*  Campus Map Visual  */}
<div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 ghost-border">
<img className="w-full h-full object-cover" data-alt="abstract architectural minimalist view of modern technology campus building with clean lines and glass facades at twilight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRyMKig7sIztqvkgqEemBgNYNvJX0o005iCUaL8pP659yyrwKZBzmB2lojpXVdGiRMLRoxSXBe5K1gytJ6duvxg0ZyurA_CRflqX9QRQqsRIsXU69X1E94T8A6n92Nz0KQrh4R5MhHhIoTnCmrcpTT5tr45k9Q2wN2lI4HMkZae9aVtN6t3KbE3mQz3owEN1JP-ywiSjCY4CpewGGs7UM3rSAv51ceOXodsJ9x0mudjM71D1BfT8u4aPXG9_CWg1r03B2q59BKmC2W"/>
<div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
<div className="absolute bottom-4 left-4 flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
<span className="material-symbols-outlined text-xs text-primary" data-icon="explore">explore</span>
<span className="text-xs font-headline font-bold uppercase tracking-tight">Main Engineering Block</span>
</div>
</div>
</div>
{/*  Right Column: Contact Form  */}
<div className="lg:col-span-7">
<div className="glass-panel p-8 md:p-12 lg:p-16 rounded-[2rem] ghost-border shadow-2xl relative">
{/*  Form Header  */}
<div className="mb-10">
<h2 className="text-2xl font-headline font-bold mb-2">Send a Message</h2>
<p className="text-on-surface-variant">We typically respond within 24 business hours.</p>
</div>
<form className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/*  Name  */}
<div className="space-y-2">
<label className="text-sm font-headline font-semibold text-on-surface-variant px-1">Name</label>
<input className="w-full bg-surface-container-highest/30 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline text-on-surface" placeholder="John Doe" type="text"/>
</div>
{/*  Email  */}
<div className="space-y-2">
<label className="text-sm font-headline font-semibold text-on-surface-variant px-1">Email</label>
<input className="w-full bg-surface-container-highest/30 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline text-on-surface" placeholder="john@example.com" type="email"/>
</div>
</div>
{/*  Subject  */}
<div className="space-y-2">
<label className="text-sm font-headline font-semibold text-on-surface-variant px-1">Subject</label>
<input className="w-full bg-surface-container-highest/30 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline text-on-surface" placeholder="How can we help you?" type="text"/>
</div>
{/*  Message  */}
<div className="space-y-2">
<label className="text-sm font-headline font-semibold text-on-surface-variant px-1">Message</label>
<textarea className="w-full bg-surface-container-highest/30 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline text-on-surface resize-none" placeholder="Write your message here..." rows={5}></textarea>
</div>
{/*  Submit Button  */}
<div className="pt-4">
<button className="w-full md:w-auto bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold py-4 px-12 rounded-xl flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]" type="submit">
                                    Send Message
                                    <span className="material-symbols-outlined" data-icon="send">send</span>
</button>
</div>
</form>
</div>
</div>
</div>
</div>
</main>
        </>
    );
};

export default Contact;

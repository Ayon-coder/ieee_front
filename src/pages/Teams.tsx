
const Teams = () => {
    return (
        <>
            <main className="pt-32 pb-24 min-h-screen max-w-7xl mx-auto px-12">
{/*  Header Section  */}
<header className="mb-20 text-center md:text-left">
<h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-on-surface">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Architects</span>
</h1>
<p className="max-w-2xl text-on-surface-variant text-lg leading-relaxed">
                Meet the minds behind the innovation. A collaborative force of engineers, designers, and visionaries shaping the future of technology at AOT.
            </p>
</header>
{/*  Executive Core Section  */}
<section className="mb-24">
<div className="flex items-center gap-4 mb-12">
<span className="h-px flex-1 bg-outline-variant/30"></span>
<h2 className="font-headline text-2xl font-bold tracking-tight uppercase text-primary">Executive Core</h2>
<span className="h-px flex-1 bg-outline-variant/30"></span>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/*  Member Card 1  */}
<div className="glass-card rounded-2xl overflow-hidden group transition-all duration-300">
<div className="relative aspect-square overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-alt="Professional portrait of a young male engineering student with a confident smile, warm studio lighting, dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ30qd22tksGiZZI6x_2L4Ql4mOzurbATPIhu8KO0qylJQ8YROY08qgBbBZTWaEzRqEF49pWhZzR-nU8euoCdCcj6nGglOjqRHExLElrWs0ZT4VYE0ZVPbkuFDm9-nkXgIy6iYaNWGw1dmlb8ntNLVJYnZskg2mEIeKvFtHeK5LG42Ds4sAMoUuVlqXRfULjbrbJ1qWz00QP9WS6RaA9Kwj_RO-MYmLUU7sVaF7TeC9dAkJGZb2rG2GwiPjKwXkjQrryXtsFBd-jkD"/>
<div className="member-overlay absolute inset-0 bg-surface-container-lowest/60 backdrop-blur-sm flex items-center justify-center gap-6">
<a className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all" href="#">
<span className="material-symbols-outlined text-xl">share</span>
</a>
<a className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all" href="#">
<span className="material-symbols-outlined text-xl" data-weight="fill">person</span>
</a>
<a className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all" href="#">
<span className="material-symbols-outlined text-xl">link</span>
</a>
</div>
</div>
<div className="p-6">
<h3 className="font-headline text-xl font-bold mb-1">Arjun Mehta</h3>
<p className="text-on-surface-variant font-medium text-sm">Chairperson</p>
</div>
</div>
{/*  Member Card 2  */}
<div className="glass-card rounded-2xl overflow-hidden group transition-all duration-300">
<div className="relative aspect-square overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-alt="Professional headshot of a female student in formal attire, sophisticated look, soft bokeh background with subtle blue tones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1irK9gqDphRSNESG5LTVsosdVpPSGfxlCEY-SDmAd5t08OUCy1cly9muBAuSKt-8lpmwKHopK6KzH-LXbg3cXfZ-w0OFhUviwxKlPrtogf03dQG7XZWUCs8ZcUnK8jKYhh5ostSAW7ACM8x5aVZNRq9piRv1Qi2FUlvPScRlMDxNQuQI8HO4_QJ4thjO78xXE9BhZBlUW3AHUZK74qDUK4WIzHibAKexLzTjLk16B8NZIgg5CM1TlfXjNE6o7x4fbZvuJQNwSy0gQ"/>
<div className="member-overlay absolute inset-0 bg-surface-container-lowest/60 backdrop-blur-sm flex items-center justify-center gap-6">
<a className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all" href="#">
<span className="material-symbols-outlined text-xl">share</span>
</a>
<a className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all" href="#">
<span className="material-symbols-outlined text-xl" data-weight="fill">person</span>
</a>
</div>
</div>
<div className="p-6">
<h3 className="font-headline text-xl font-bold mb-1">Sneha Roy</h3>
<p className="text-on-surface-variant font-medium text-sm">Vice-Chairperson</p>
</div>
</div>
{/*  Member Card 3  */}
<div className="glass-card rounded-2xl overflow-hidden group transition-all duration-300">
<div className="relative aspect-square overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-alt="Young man in smart casual clothing, creative professional look, minimal tech studio background, focused expression" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0UBPEUi2lmLKFMHcB9wpWiIqcaIRrnNpUJli6TsCdmfDOa5Cton8jcMG7MgPN391qnF4VGb5C9sAVkTTPvZiRHdSSG8H0lx0J3MqpX122zKWMFOXyFItZnwX7fjmO9QHNq8HK2VMaxJl7YgIMOTsR98auKOWgRf9RRrw5Kqr1GbscCX3x01_PZxHT2826pJfCLko82KkzzWvRYMFYIBrdPBs0LFoCRFctyShnjEsus5Wxx6SS8AxevdqeV3YQhejLj9R0VRHgoPLJ"/>
<div className="member-overlay absolute inset-0 bg-surface-container-lowest/60 backdrop-blur-sm flex items-center justify-center gap-6">
<a className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all" href="#">
<span className="material-symbols-outlined text-xl">link</span>
</a>
</div>
</div>
<div className="p-6">
<h3 className="font-headline text-xl font-bold mb-1">Rohan Das</h3>
<p className="text-on-surface-variant font-medium text-sm">Secretary</p>
</div>
</div>
</div>
</section>
{/*  Technical Team Section  */}
<section className="mb-24">
<h2 className="font-headline text-2xl font-bold mb-10 text-on-surface-variant border-l-4 border-primary pl-4">Technical Operations</h2>
<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
{/*  Tech Member 1  */}
<div className="glass-card rounded-2xl overflow-hidden group">
<div className="relative aspect-[3/4] overflow-hidden">
<img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="Portrait of a male developer wearing glasses, neon accent lighting on face, futuristic dark tech aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7kJyZ_mPmiSkUEljRdXN3hOZtYJ8GjrKfbJU5tv1xz72ZXtbt6IjTxdVOAzQ1Sv79TjMyZYUKrSiA4CpJdU6CLFm7veP3mcbpNRiVO2Mx-srPw9C4Czr5zedqkoLZjwHw2t5hfKAWwXA0j8r_AVUNUDoavcoFAvog1agZPkYRImwNh6cmtd4nRut_xlwZrCNrqmXcHvc5NOe9Pd_xnqv6X9H9_jzRpZiuQPBkpEDC7KmR50Ao-dVk-HlEL7b-j6UPXpO7hq6m7ZDs"/>
<div className="member-overlay absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-surface-container-lowest flex justify-center gap-3">
<span className="material-symbols-outlined text-primary text-lg">code</span>
<span className="material-symbols-outlined text-primary text-lg">terminal</span>
</div>
</div>
<div className="p-4 bg-surface-container-low/50">
<h4 className="font-bold text-base truncate">Vikram Singh</h4>
<p className="text-xs text-on-surface-variant">Lead Developer</p>
</div>
</div>
{/*  Tech Member 2  */}
<div className="glass-card rounded-2xl overflow-hidden group">
<div className="relative aspect-[3/4] overflow-hidden">
<img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="Close up of a female student focused on a screen, reflection of code on her face, cinematic blue lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6P121z-fpFJltDqk0FoQUZDcglGtKIWzR2VZffE4UxX_gYGMwcsd8Kk2O9qUjSO_wpjUtuY1fxWGrfOV-h_Nw0GN_EqX90rFKN-BCqA_GJEpKsM3ir4i1N82mZyRdOyskpy-CkMy8mVzzGFuJzJUXaWKrwZbDsUHa1tnhhtEfuoQAxjJV84TjEwyPAnP_rwB2-9b3Y4wpK1BVizMkdvdgaZGkzPEKJUiWJIN-HDKFlC7uQYn3Ao1WMFBhrj1QtdyzJTwccI2qZECw"/>
<div className="member-overlay absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-surface-container-lowest flex justify-center gap-3">
<span className="material-symbols-outlined text-primary text-lg">database</span>
</div>
</div>
<div className="p-4 bg-surface-container-low/50">
<h4 className="font-bold text-base truncate">Ishita Paul</h4>
<p className="text-xs text-on-surface-variant">Cloud Architect</p>
</div>
</div>
{/*  Tech Member 3  */}
<div className="glass-card rounded-2xl overflow-hidden group">
<div className="relative aspect-[3/4] overflow-hidden">
<img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="Portrait of an energetic young male engineer, hands in pockets, modern architectural office background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqJ9jddSayiJcYQ9dwIAf3j57iz1fwsG9q50FXWNqeN0N0GX-89tzPOS5p1BFrM0wuic6A8POEAa1evvf274dlKuh1KOvYX7kRP-ybyyMFckCSUX9BGy3i2IGXAWKrBW3Q_JX32S4LerZOnwDplt35SmzBgOWZp4_u96xSQmA4g1vgotqFEGeShNuR7Yjp5PoJ0vGjqTnfuuvMr9OXW8cG269igt2Rjjb2PlBubgkl0bOgfHC2Zp19HaDUfS2IOycaUfGW9t73O3h3"/>
<div className="member-overlay absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-surface-container-lowest flex justify-center gap-3">
<span className="material-symbols-outlined text-primary text-lg">memory</span>
</div>
</div>
<div className="p-4 bg-surface-container-low/50">
<h4 className="font-bold text-base truncate">Aayush Gupta</h4>
<p className="text-xs text-on-surface-variant">Robotics Lead</p>
</div>
</div>
{/*  Tech Member 4  */}
<div className="glass-card rounded-2xl overflow-hidden group">
<div className="relative aspect-[3/4] overflow-hidden">
<img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="Intelligent looking female student with high-tech headset, dark workspace background with glowing keyboards" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhqNF3bmGbWUnDVml4oFo5F2srpjIFBD7QidtRlxnYNupy5CIVyV262NwxOAqbo9rfDNjgKEK0eDh1Bbh0fJoPbeUaDiJH0GlpiMTQnlutJzbVJAo7vnyG-K7b_qUBDCwg-H1G-_jXxz-FcLLlL4Z8PIdjSjedZyd0MgdgFw5FAGGM6PCGTV_jFhm_mbGSxrTBXo8ogJ4rS5yFQF_vUT8o90tJuTsRb9Bd9sRcrwiz1qDLuVEtf90ACNpT6T0psStfrFt5Wz92nDfW"/>
<div className="member-overlay absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-surface-container-lowest flex justify-center gap-3">
<span className="material-symbols-outlined text-primary text-lg">security</span>
</div>
</div>
<div className="p-4 bg-surface-container-low/50">
<h4 className="font-bold text-base truncate">Ananya Sen</h4>
<p className="text-xs text-on-surface-variant">AI Researcher</p>
</div>
</div>
</div>
</section>
{/*  Design & Media Team  */}
<section className="mb-24">
<h2 className="font-headline text-2xl font-bold mb-10 text-on-surface-variant text-right border-r-4 border-secondary pr-4">Creative Collective</h2>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
{/*  Design Member 1  */}
<div className="glass-card flex items-center p-4 rounded-3xl gap-6 group hover:translate-y-[-4px] transition-transform">
<div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-outline-variant/30">
<img className="w-full h-full object-cover" data-alt="Stylized portrait of a young female designer, artistic lighting with pink and purple hues, creative atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADr3gP_l3FEJ1Zg2rL6cXkjcRjpQHFtcxnVt5enBvEqP5XmqF7AReWi_ShfXmgIfrqujsQg_FXI4B2VCyXdG8-Ll0ftbOCt9zLUPw_eYq7P2EuWh3AVuaBh9Tv-Xv3c2HD4unqInJjqMy_LTYOYo8UvIvESDmmgvFMEN2CPuHGOV27EB-Ez9fYy9vOG1o7vCxtmt1qLplug_4zdGG34hxGmhQNi9geOw9gBSsuMvGnDrSNt6VZ0ozXp7f-sbO6wVqnH4svYmAj9DZ8"/>
</div>
<div className="flex-1">
<h4 className="font-headline font-bold text-lg">Priya Sharma</h4>
<p className="text-secondary text-sm font-medium mb-3">UI/UX Strategist</p>
<div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">palette</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">brush</span>
</div>
</div>
</div>
{/*  Design Member 2  */}
<div className="glass-card flex items-center p-4 rounded-3xl gap-6 group hover:translate-y-[-4px] transition-transform">
<div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-outline-variant/30">
<img className="w-full h-full object-cover" data-alt="Portrait of a male videographer holding a camera lens, cinematic lighting, industrial studio vibe" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaEd_DwmWofHsgx2XqxU5lXeHLwMKHnwj7WEt36BxV09roO0nT-JTgkncdbPkm7j3NT7geJrxqWd6Fbj7giE6BxGgT4pCwtSuG7JvPKDptoyoYR2wGmncjkewYg7yDgfyr8Vsqjaae177B81Z9sHXxqxWkBSVvH8m9os5BICQORwrQ4RiAqdWefz3QQjzG3996PwLEHLDi5RiCTMcLMkVpch8rltgZ9g0gOG1_yaoCa4XcyAnDY2UN31Ntm6nwqTyD_zRzOyYWNsDi"/>
</div>
<div className="flex-1">
<h4 className="font-headline font-bold text-lg">Kabir Bose</h4>
<p className="text-secondary text-sm font-medium mb-3">Media Head</p>
<div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">videocam</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">camera</span>
</div>
</div>
</div>
{/*  Design Member 3  */}
<div className="glass-card flex items-center p-4 rounded-3xl gap-6 group hover:translate-y-[-4px] transition-transform">
<div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-outline-variant/30">
<img className="w-full h-full object-cover" data-alt="Smiling student with colorful digital art tablet, bright contemporary studio lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVqLwr4KSi0KKT_xnOQU0ZaVk-TRqXkjNns2Jfljn1PcZazor6-mJOMyVKfi85reFdt89uaEtfrFqDwpIqrEztoXAO-XN3Wj3ezN5dQumCK5sCvsZf1bF8aldjNnD9gDy-WFiShiJeJRZmxSH3ECAPaA2ih1rLEIg714OoXObTIZUzOf4BlZeGAeFRkQotqF9HGRy1_p8YH4qe2XjKxTQtnKx5qKAXFZnX2Cdq4FFpFK8e1UseIu7yb6Ynrox83TI5Hh3h6SfqNlMN"/>
</div>
<div className="flex-1">
<h4 className="font-headline font-bold text-lg">Megha Dutta</h4>
<p className="text-secondary text-sm font-medium mb-3">Visual Designer</p>
<div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">layers</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">draw</span>
</div>
</div>
</div>
</div>
</section>
</main>
        </>
    );
};

export default Teams;

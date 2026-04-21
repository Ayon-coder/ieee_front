
const Home = () => {
    return (
        <>
            <main>
{/*  Hero Section  */}
<section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
<div className="absolute inset-0 hero-gradient"></div>
<div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full"></div>
<div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-tertiary/5 blur-[120px] rounded-full"></div>
<div className="relative z-10 max-w-5xl mx-auto px-14 text-center">
<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-outline-variant/30 bg-surface-container-low mb-8">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span className="text-xs font-medium tracking-wider uppercase text-on-surface-variant" >Advancing Technology for Humanity</span>
</div>
<h1 className="font-headline text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 bg-gradient-to-b from-on-surface to-on-surface-variant bg-clip-text text-transparent leading-[1.1]" >
                    Join the Legacy of <br/><span className="text-primary" >Innovation</span>
</h1>
<p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed" >
                    IEEE Student Branch of Academy of Technology is a hub for aspiring engineers and innovators to collaborate, learn, and build the future of technology together.
                </p>
<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
<button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-2xl shadow-primary/20 hover:scale-105 transition-transform" >
                        Become a Member
                    </button>
<button className="w-full sm:w-auto px-8 py-4 bg-surface-container-highest/50 border border-outline-variant/30 text-on-surface font-bold rounded-xl backdrop-blur-sm hover:bg-surface-container-highest transition-colors" >
                        Explore Events
                    </button>
</div>
</div>
</section>
{/*  Stats Section  */}
<section className="py-24 relative z-10">
<div className="max-w-7xl mx-auto px-14">
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
<div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/10 text-center">
<div className="text-5xl font-extrabold font-headline text-primary mb-2" >500+</div>
<div className="text-on-surface-variant font-medium tracking-wide uppercase text-sm" >Active Members</div>
</div>
<div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/10 text-center">
<div className="text-5xl font-extrabold font-headline text-tertiary mb-2" >40+</div>
<div className="text-on-surface-variant font-medium tracking-wide uppercase text-sm" >Events Organized</div>
</div>
<div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/10 text-center">
<div className="text-5xl font-extrabold font-headline text-secondary mb-2" >2K+</div>
<div className="text-on-surface-variant font-medium tracking-wide uppercase text-sm" >Total Followers</div>
</div>
</div>
</div>
</section>
{/*  About Us: Mission & Vision  */}
<section className="py-24 bg-surface-container-lowest">
<div className="max-w-7xl mx-auto px-14">
<div className="grid lg:grid-cols-2 gap-12 items-stretch">
<div className="glass-panel p-10 rounded-3xl border border-white/5 flex flex-col justify-center">
<h2 className="font-headline text-3xl font-bold mb-6 text-primary" >Our Mission</h2>
<p className="text-on-surface-variant leading-relaxed text-lg" >
                            To foster technological innovation and excellence for the benefit of humanity. We provide students with the platform to engage with global engineering standards, participate in world-class competitions, and connect with industry leaders through workshops and technical seminars.
                        </p>
</div>
<div className="glass-panel p-10 rounded-3xl border border-white/5 flex flex-col justify-center">
<h2 className="font-headline text-3xl font-bold mb-6 text-tertiary" >Our Vision</h2>
<p className="text-on-surface-variant leading-relaxed text-lg" >
                            To become a premiere technical observatory that empowers students to lead in a rapidly evolving digital landscape. We envision a community where technical literacy and ethical innovation are the core pillars of professional development.
                        </p>
</div>
</div>
</div>
</section>
{/*  Faculty Advisor Message  */}
<section className="py-24 relative overflow-hidden">
<div className="max-w-5xl mx-auto px-14">
<div className="glass-panel rounded-[2.5rem] p-8 md:p-16 border border-white/10 relative overflow-hidden">
<div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
<span className="material-symbols-outlined text-[12rem]" >format_quote</span>
</div>
<div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
<div className="w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 border-4 border-primary/20">
<img alt="Faculty Advisor" className="w-full h-full object-cover" data-alt="Professional portrait of a middle-aged academic faculty member with glasses, wearing a sharp suit against a dark office background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvlVItpj-5VKK0v_rlt9GGDdVrKAG33X0thh4MLUa8CFzcDAT553ASYJFNoVph0NtaLM4divED4tIeme23apq7KwmRGbrJm4d3QxogejIeT8dV4wtSqeG-rl5wk_ksdl5cRytxYH3drd1Qf7Dd0cmosxc47MTq-wQfCtESDrFHWlNkrLWtlsrSSuOiHdECDtm-UY_u_Av46ooKRRstP1abvR71_yPtHS069MisVGYwBRQqhMSMdbse-0dVmP4rq6LI7nA9IVu8HTiy" />
</div>
<div>
<p className="text-xl md:text-2xl italic font-medium leading-relaxed mb-8 text-on-surface" >
                                "At IEEE SB AOT, we don't just teach technology; we cultivate the mindset required to solve global challenges. Our students are the architects of tomorrow's digital infrastructure."
                            </p>
<div className="border-l-4 border-primary pl-4">
<h4 className="text-xl font-bold font-headline" >Prof. Aindrajit Pal</h4>
<p className="text-on-surface-variant" >Faculty Advisor, IEEE SB AOT</p>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  Collaborations Marquee  */}
<section className="py-24 bg-surface-container-low overflow-hidden">
<div className="max-w-7xl mx-auto px-14 mb-12 text-center">
<h3 className="font-headline text-sm font-bold tracking-widest uppercase text-on-surface-variant" >Our Partners &amp; Collaborators</h3>
</div>
<div className="marquee-container py-10">
<div className="marquee-content flex flex-nowrap gap-20 items-center w-max">
{/*  Repeated logos for continuous scroll  */}
<div className="flex flex-nowrap gap-20 items-center">
<img alt="Logo" className="h-12 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-60 hover:opacity-100" data-alt="minimalist modern tech company logo in grayscale on a transparent background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwSzTl6_fT7QUr-jVqVn3etJCpjhFXi1ElWgWrPAJzj3gIGIXXOU7qRNnWzSBqb5Xh_vLFIdibLijzwYR2o6Gge1KbwH_RWgKvsnxcI-NUVnYQXJ9yBTZPcpn6qdjg1IXIcFOLLQxTYqGRyBZMi0KDJJ1sYpMznXg9YpesJOHPLFWwGUmihtqmA_v73iOZFI-XtHWwydwl9m60MMgZQrxMLg-CBYbFG7sVeFo0PAltdgA6b--iVLKKg5LGvUCE39IQcM2mOiSjo4xq" />
<img alt="Logo" className="h-12 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-60 hover:opacity-100" data-alt="abstract geometric corporate logo for engineering firm in grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARA0Hj5v8dzsi97Ch7X441ZTZuYl_V1jf4-04sgu20H0Z_M4icNH4Q7H8C_wGTk9PyFDTy4CZOkmn8nZZoBHf6HmGHDWk7BvtGyKJOcU8h1Jz7F0mNZCzP8fWNsNlO8JPV6O0ensXUTmhBJICO0hp1w788VO_h7ctKXKMF9GBshyfZaqg19PWwrB0fO9DWoudzuLuyImH1uu-k762LSff4hHC7Bkm7nEH3EMIgIK4qt9qwKm7_2PsOpK4wWA_zzEqKtnH4cg3eGbtI" />
<img alt="Logo" className="h-12 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-60 hover:opacity-100" data-alt="professional technology organization logo symbol in grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4RWMsBaua3I_K69TpelfIQdzxh69V80t1e80Bi0-6EML2tjeBBxZLrAKyAAVro50Q1GOKqmUeOtNHI9E4fHcAhVqd8y8Gs7imJW-5__wB4cLksmTa0jPrhEUSG7J_iiA0kc27T98VNff3o_ci__KVGqwY_vEQvmkxhQr9NclxmkaKcM0ICqvsyhdasgAw0lnngCKpJ1xJIQ_Ehbi5YAuPnYwiARIm2btWKGXbye-AscXFcwsHg5P8Q86qRb5DrhSlVks_QBAAy2wD" />
<img alt="Logo" className="h-12 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-60 hover:opacity-100" data-alt="clean digital brand identity icon in grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMOMYi8iClCdQcpkKEjD2IE4BIZkmBxoPde-ZODqi8eZvlgLdBaVeCdJEe-ORL1DTZcSS2nIgpTv8PBExIf5Fgam41jPFFpx1sAb2UOvpIvPZOEkZpHJBURCYlWM5G718aO8IWzRE1NDaGZYKsmrx0LGUhYL1EGm-I1Ib6dre0Kq2GMG1UDMiHui4qn-j2xStWjaGnHCoW-svkGd2_dCPQ72DAzp3RjdKofFztau5qXmeTOm9pJiQLs9lemaa0MGde7mV2d_ZOYd6h" />
<img alt="Logo" className="h-12 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-60 hover:opacity-100" data-alt="modern software company logo minimalist design grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7GlLzis1bKKMqA5OQkr4rXduMWdXvb0iHSZB9TNKl2zmfKSO7hApz_CO_ph9-U-Lt7urGqAKKVl8JxlzykSByxU3C02GRIau9YF2Bp9teLIDq_sUe1qRVkRxxgWgYCyx30fLgEfv89bqtJSsoQ9pKhhUILDvyCuNrJlOoZgO177bwI5Ds7fJQY2ai1iZnssK6gf4LZUDqjCJn9MFq2-5GXNIJZhSY7zmN7nBbC6uMKfLIyulLWmeSWlooJRUeWbb0ipYNMI--OYwR" />
</div>
{/*  Duplicate for loop  */}
<div className="flex flex-nowrap gap-20 items-center">
<img alt="Logo" className="h-12 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-60 hover:opacity-100" data-alt="minimalist modern tech company logo in grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8wzGF1Q3Q1yFFXTW3Esj8jwXjmmrq8Am2Jufgz-AMEVKV7dWiI6GBeygxV3G0kTxE8SmbSKKhMfrsQyz7LpZrJ_ZKOGzuBGXZucOVu4mYKOQUxbU9-m7mN5OguVlRsRwwtkKeMWBGgMfcyqkqFEJFD-p_-OaqFnGAiY8bbzLqys8oCa8uoOgu4g_T-eFZMF8x0yz-Sozfnh-acruKrvHpDwfhKEOXABBRNwfOg_L1Ud-kpOHW7vjgn7m99tqflJPiV2JpBpEWgI2d" />
<img alt="Logo" className="h-12 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-60 hover:opacity-100" data-alt="abstract geometric corporate logo for engineering firm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGlf31g9iYSCJmPW12IwhM-PiDK7HS9-GjRAkLUclSSMcdJ8ULgVoHcEU_yB652XD272_WVl2kyOVPb-fS-xMCdPi2_Qtuq1S_085rW_FVUheq7NndKbaxxFVujetW_VNr9E_bVqfC0N0HkBY3qE4L2MMW1aHhEBEneL3OHuy5mQ5GQ5vApwFpN7-TbnhnaC7kWmOiHgvrxeEPNbKSSiQjiRjm0eRguEdiZaVnYm8weVDNsxdLetWUXe8rx9hrDDLKsBKBsZ-K8fQL" />
<img alt="Logo" className="h-12 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-60 hover:opacity-100" data-alt="professional technology organization logo symbol" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjUw0lHB6MsvpXADbHmXLF26DMoV29dLzCs6kT-EL-wLGMaidC-0heMJxDcWvpj-6oRwQDIbUBaRIoAO9QI6PhfWdFW6rLY04HwYstnIftNnEKlUGnSmiaj_Nk4kt3sNqe7qU5Ov7z7qX73B363DJ3P0J6gbnosFF5goLUox2KBTQA6V9KT-9Rzz0hBUR55cc2WZ5jwzp39L1CYQl0D50-drShX-sZAa-hwtgVwli0CJ4fge1YYDXrKd4haLMNSDR4GJcn1Tf1sZsc" />
<img alt="Logo" className="h-12 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-60 hover:opacity-100" data-alt="clean digital brand identity icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeD7PdhnMQWiLixHulgAmkQwLucltCJQNTBVz8iGVTHJtn-tunKMBfzQaf9A_qCiHQD1i7os35jNhGx9eZsIIZ8YuIf_0lQwWhH0Fr9vTDj4wkZAFWxsxGW-5DZ30hMOJiJ8-xNt6wwy4XhdFYAlSU78xWaq8IE0cl8RJAsH35xKxx-J9uBzdREnATQhWWoRJwOJCkIDCO7OvVqPJ2UaI9CgQtwWiSjkTiZZMF1sqHmU4vYOms6udUBTkQsJ0mMu8dXO1LGJXJyjrf" />
<img alt="Logo" className="h-12 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-60 hover:opacity-100" data-alt="modern software company logo minimalist design" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhDI-M27TRQj4lpdjifWwf7BB8DzclHxoKl7dD40-5eTTC6dwrIa5o-1SL4x1RKOXtrTP0ceA7P_Yw_0HPwFPOQNQ0NF3RJiJT3xOfWFy5tZcNj2Na8JR9FrXlIzHCoLkkdJ1KnMsEsCXAdhhMbPi-Dwypj-POm05MY4lt0HFAaxNAb4aNSBFHwE1CTBxK1m3Cvv9utU9YgulukWa7Zu-Cxb8rjCqw_7gD_9uMCl1rNq0PNelPtOUnIeCLeCnLdep4makErMxLQT9p" />
</div>
</div>
</div>
</section>
{/*  FAQ Section  */}
<section className="py-24">
<div className="max-w-3xl mx-auto px-14">
<h2 className="font-headline text-4xl font-bold text-center mb-16" >Frequently Asked Questions</h2>
<div className="space-y-4">
<details className="group glass-panel rounded-2xl border border-white/5" open >
<summary className="flex justify-between items-center p-6 cursor-pointer list-none" >
<span className="font-bold text-lg" >Who can join IEEE SB AOT?</span>
<span className="material-symbols-outlined transition-transform group-open:rotate-180" >expand_more</span>
</summary>
<div className="px-6 pb-6 text-on-surface-variant leading-relaxed" >
                            Any student currently enrolled in Academy of Technology with a passion for engineering, technology, and professional growth is welcome to join us. No prior technical experience is required!
                        </div>
</details>
<details className="group glass-panel rounded-2xl border border-white/5" >
<summary className="flex justify-between items-center p-6 cursor-pointer list-none" >
<span className="font-bold text-lg" >What are the benefits of membership?</span>
<span className="material-symbols-outlined transition-transform group-open:rotate-180" >expand_more</span>
</summary>
<div className="px-6 pb-6 text-on-surface-variant leading-relaxed" >
                            Members get exclusive access to workshops, technical certifications, networking with IEEE global experts, and funding opportunities for research projects.
                        </div>
</details>
<details className="group glass-panel rounded-2xl border border-white/5" >
<summary className="flex justify-between items-center p-6 cursor-pointer list-none" >
<span className="font-bold text-lg" >How do I register for events?</span>
<span className="material-symbols-outlined transition-transform group-open:rotate-180" >expand_more</span>
</summary>
<div className="px-6 pb-6 text-on-surface-variant leading-relaxed" >
                            Registration for events is typically handled through our internal portal or the specific event link shared on our social media handles and this website.
                        </div>
</details>
</div>
</div>
</section>
</main>
        </>
    );
};

export default Home;

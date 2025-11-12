import { Link } from "@tanstack/react-router";

function CTA() {
    return (
        <section className="pt-10 md:pt-20 lg:pt-32 relative overflow-hidden">
            <div className="max-w-7xl px-4 md:px-8 mx-auto">
                <h1 className="text-3xl md:text-4xl lg:text-6xl tracking-tight font-display font-bold">
                    The Open Sourced  <br /> Identity Verification Platform
                </h1>
                <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 font-inter max-w-xl py-8">
                    Platform for identity verification, onboarding, document verification, background check, and more.
                </p>
                <div className="flex items-center gap-6">
                    <Link to="/sign-up" >
                        <button data-slot="button"
                            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([className*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-brand h-9 px-4 py-2 has-[&gt;svg]:px-3 shadow-brand">
                            Start your free trial
                        </button>


                    </Link>
                    <a data-slot="button" className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([className*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[&gt;svg]:px-3" href="#">
                        View demo</a>
                </div>
                <div className="relative">
                    <div className="relative min-h-72 sm:min-h-80 md:min-h-100 lg:min-h-140 w-full pt-20 perspective-distant translate-x-10 md:translate-x-28">
                        <div className="perspective-[4000px] shadow-2xl" >
                            <img />
                        </div>
                        <div className="perspective-[4000px] translate-x-20 -translate-y-10 md:-translate-y-20  lg:-translate-y-40" >
                            <img className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-40 md:h-100 w-full mask-t-from-10% bg-background z-50">
                </div>
            </div>
        </section>
    );
}

export default CTA;

import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";

export default function CTA() {
    return (
        <section className="pt-10 md:pt-20 lg:pt-32 relative overflow-hidden">
            <div className="max-w-7xl px-4 md:px-8 mx-auto">
                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl lg:text-6xl tracking-tight font-display font-bold"
                >
                    The Open Sourced <br /> Identity Verification Platform
                </motion.h1>

                {/* Paragraph */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 font-inter max-w-xl py-8"
                >
                    Platform for identity verification, onboarding, document verification,
                    background check, and more.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    className="flex items-center gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.2,
                            },
                        },
                    }}
                >
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 },
                        }}
                    >
                        <Link to="/sign-up">
                            <button
                                data-slot="button"
                                className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 
                [&_svg]:pointer-events-none [&_svg:not([className*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none 
                focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] 
                bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-brand h-9 px-4 py-2 has-[>svg]:px-3 shadow-brand"
                            >
                                Start your free trial
                            </button>
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 },
                        }}
                    >
                        <a
                            data-slot="button"
                            href="#"
                            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all 
              disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none 
              [&_svg:not([className*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none 
              focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] 
              bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 
              dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3"
                        >
                            View demo
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

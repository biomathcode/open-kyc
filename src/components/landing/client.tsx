
import { motion } from "motion/react";
import { Cloudflare } from "../ui/svgs/cloudflare";
import { CodeRabbit } from "../ui/svgs/codeRabbit";
import { Convex } from "../ui/svgs/convex";
import { Netlify } from "../ui/svgs/netlify";
import { Tanstack } from "../ui/svgs/tanstack";

const Companies = [
    { name: "Convex", url: "https://convex.dev", logo: Convex },
    { name: "Tanstack Start", url: "https://tanstack.com/start", logo: Tanstack },
    { name: "Netlify", url: "https://netlify.com", logo: Netlify },
    { name: "CodeRabbit", url: "https://coderabbit.io", logo: CodeRabbit },
    { name: "Autumn", url: "https://useautumn.com/", logo: "/autumn.avif" },
    { name: "Cloudflare", url: "https://cloudflare.com", logo: Cloudflare },
];

export default function Client() {
    // duplicate array to make seamless infinite effect
    const duplicated = [...Companies, ...Companies];

    return (
        <motion.section
            initial={{ opacity: 0, y: 40, }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            viewport={{ once: true }}
            className="pt-10 md:pt-20 lg:pt-32 relative overflow-hidden mb-10">
            <div className="max-w-7xl px-4 md:px-8 mx-auto">
                <div className="mb-6 font-semibold text-base md:text-lg text-neutral-500 dark:text-neutral-400">
                    Powered By:
                </div>

                {/* Infinite Scroll Container */}
                <div className="relative flex overflow-hidden">
                    <motion.div
                        className="flex gap-10 md:gap-16"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            duration: 20,
                            ease: "linear",
                        }}
                    >
                        {duplicated.map((company, index) => {
                            const Logo = company.logo;
                            const isString = typeof Logo === "string";
                            return (
                                <a
                                    key={`${company.name}-${index}`}
                                    href={company.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center min-w-28 md:min-w-32"
                                >
                                    {isString ? (
                                        <img
                                            src={Logo}
                                            alt={company.name}
                                            className="w-16 h-16 object-contain opacity-80 hover:opacity-100 transition"
                                        />
                                    ) : (
                                        <Logo className="w-16 h-16 opacity-80 hover:opacity-100 transition" />
                                    )}
                                </a>
                            );
                        })}
                    </motion.div>

                    {/* Gradient Fade Edges */}
                    <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white dark:from-neutral-950 to-transparent" />
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white dark:from-neutral-950 to-transparent" />
                </div>
            </div>
        </motion.section>
    );
}

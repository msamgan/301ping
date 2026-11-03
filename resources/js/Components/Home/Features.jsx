import Reveal from "@/Components/Home/Reveal"

const FEATURES = [
    {
        title: "Lightning fast",
        body: "Instantly create short links with our optimized high-performance engine."
    },
    {
        title: "API access",
        body: "Integrate our URL shortening service directly into your applications with our developer-friendly API."
    },
    {
        title: "Secure & reliable",
        body: "Enterprise-grade security keeps your links protected and available."
    },
    {
        title: "Analytics",
        body: "Detailed insights and click tracking to understand your audience."
    },
    {
        title: "Link tags",
        body: "Keep related short links organized with simple, reusable tags."
    },
    {
        title: "Query param passthrough",
        body: "Query parameters added to your short link are automatically preserved in the destination URL."
    }
]

export default function Features() {
    return (
        <section className="border-b border-line bg-paper" aria-labelledby="features-heading">
            <div className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 py-20 md:py-28">
                <Reveal className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-8">
                    <span>03 / Capabilities</span>
                </Reveal>

                <Reveal
                    as="h2"
                    id="features-heading"
                    className="font-grotesk font-extrabold text-ink text-4xl sm:text-5xl leading-[1.05] max-w-3xl mb-14 md:mb-20"
                >
                    Built for the essentials, nothing else.
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-line divide-y divide-line sm:divide-y-0">
                    {FEATURES.map((feature, index) => (
                        <Reveal
                            key={feature.title}
                            delay={index * 60}
                            className="py-8 sm:pt-8 sm:pb-10 sm:pr-8"
                        >
                            <span className="block font-mono text-xs text-muted mb-4">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <h3 className="font-grotesk font-bold text-ink text-lg mb-3">{feature.title}</h3>
                            <p className="font-grotesk text-sm text-muted leading-relaxed max-w-xs">
                                {feature.body}
                            </p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}

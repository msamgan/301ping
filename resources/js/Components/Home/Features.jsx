import Reveal from "@/Components/Home/Reveal"

const FEATURES = [
    {
        title: "Make a link you can share",
        body: "Paste a long URL, shorten it, and copy it without creating an account."
    },
    {
        title: "Shorten links from your app",
        body: "Use the API to make a short link from your own app."
    },
    {
        title: "Know which links get visits",
        body: "See click counts and analytics for the links you share."
    },
    {
        title: "Find links by campaign or client",
        body: "Tag links by launch, channel, or client instead of digging through one long list."
    },
    {
        title: "Keep the same short URL when a page moves",
        body: "Change a saved link's destination without changing its short URL. Edit limits depend on your plan."
    },
    {
        title: "Keep tracking with your link",
        body: "Tracking parameters pass through to the destination, so your campaign links keep their data."
    }
]

export default function Features() {
    return (
        <section className="border-b border-line bg-paper" aria-labelledby="features-heading" id={"features"}>
            <div className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 py-20 md:py-28">
                <Reveal className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-8">
                    <span>03 / Capabilities</span>
                </Reveal>

                <Reveal
                    as="h2"
                    id="features-heading"
                    className="font-grotesk font-extrabold text-ink text-4xl sm:text-5xl leading-[1.05] max-w-3xl mb-14 md:mb-20"
                >
                    Make, manage, and measure the links you share.
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

import UrlShortener from "@/Components/Home/UrlShortener"
import ArrowIcon from "@/Components/Home/ArrowIcon"

const CAPABILITIES = [
    {
        number: "01",
        title: "Click analytics",
        description: "See how your links perform.",
        href: "#features-heading"
    },
    {
        number: "02",
        title: "Branded QR codes",
        description: "Make every link scannable.",
        href: route("services.qr-code-logo")
    },
    {
        number: "03",
        title: "Custom links",
        description: "Give your links a name of their own.",
        href: route("services.custom-links")
    },
    {
        number: "04",
        title: "Link monitoring",
        description: "Keep an eye on broken destinations.",
        href: route("services.broken-destinations")
    }
]

export default function Hero() {
    return (
        <section className="border-b border-line bg-paper" aria-labelledby="hero-heading">
            <div className="mx-auto flex min-h-[calc(100svh-64px)] max-w-grid flex-col px-6 py-10 md:min-h-[calc(100svh-72px)] md:px-10 md:py-12 lg:px-16">
                <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:text-[11px]">
                    <span>More than a URL shortener</span>
                    <span className="hidden sm:inline">Your links, working harder</span>
                </div>

                <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-12 lg:gap-12 lg:py-12">
                    <div className="lg:col-span-6">
                        <p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                            Create / manage / measure
                        </p>
                        <h1
                            id="hero-heading"
                            className="font-editorial text-6xl leading-[0.98] text-ink sm:text-7xl xl:text-8xl"
                        >
                            Short links.
                            <br />
                            <span className="text-accent-dark">Big possibilities.</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                            Shorten a link in seconds. Then do more with it: track clicks, create QR codes, and
                            manage every link in one place.
                        </p>

                        <div className="mt-8 max-w-xl sm:mt-10">
                            <UrlShortener />
                            <p className="mt-4 font-mono text-xs leading-relaxed text-muted">
                                No account needed to shorten. No expiration date set.
                            </p>
                        </div>
                    </div>

                    <div className="bg-ink p-6 text-paper sm:p-8 lg:col-span-6 xl:p-10">
                        <div className="flex items-start justify-between gap-4 border-b border-paper/20 pb-6">
                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/60">
                                    The link toolkit
                                </p>
                                <h2 className="mt-3 max-w-xs font-grotesk text-2xl font-bold leading-tight text-paper sm:text-3xl">
                                    A little link can do a lot.
                                </h2>
                            </div>
                            <span
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-xl text-ink"
                                aria-hidden="true"
                            >
                                ↗
                            </span>
                        </div>

                        <div className="grid grid-cols-2">
                            {CAPABILITIES.map((capability, index) => (
                                <a
                                    key={capability.number}
                                    href={capability.href}
                                    className={`group min-w-0 border-paper/20 py-5 transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
                                        index % 2 === 0 ? "border-r pr-4 sm:pr-6" : "pl-4 sm:pl-6"
                                    } ${index < 2 ? "border-b" : ""}`}
                                >
                                    <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-paper/60">
                                        <span>{capability.number} /</span>
                                        <ArrowIcon className="h-4 w-4" />
                                    </div>
                                    <h3 className="mt-4 text-sm font-bold text-paper transition-colors group-hover:text-accent sm:text-base">
                                        {capability.title}
                                    </h3>
                                    <p className="mt-1 text-xs leading-relaxed text-paper/70 sm:text-sm">
                                        {capability.description}
                                    </p>
                                </a>
                            ))}
                        </div>
                        <p className="border-t border-paper/20 pt-5 font-mono text-[10px] leading-relaxed uppercase tracking-[0.12em] text-paper/60">
                            Plus link tags, editable destinations, API &amp; browser extensions
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    <span>Built for creators, marketers &amp; developers</span>
                    <a
                        href="#features-heading"
                        className="text-ink underline underline-offset-4 hover:text-accent-dark"
                    >
                        Explore the capabilities ↓
                    </a>
                </div>
            </div>
        </section>
    )
}

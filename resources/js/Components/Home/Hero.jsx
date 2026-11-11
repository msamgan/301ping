import UrlShortener from "@/Components/Home/UrlShortener"
import ArrowIcon from "@/Components/Home/ArrowIcon"

const CAPABILITIES = [
    {
        title: "Click analytics",
        href: "#features-heading"
    },
    {
        title: "Branded QR codes",
        href: route("services.qr-code-logo")
    },
    {
        title: "Custom links",
        href: route("services.custom-links")
    },
    {
        title: "Link monitoring",
        href: route("services.broken-destinations")
    }
]

export default function Hero() {
    return (
        <section className="border-b border-line bg-paper" aria-labelledby="hero-heading">
            <div className="mx-auto flex min-h-[calc(100svh-64px)] max-w-grid flex-col px-6 pb-6 pt-8 md:min-h-[calc(100svh-72px)] md:px-10 lg:px-16">
                <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:text-[11px]">
                    <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                        The link toolkit
                    </span>
                    <span className="hidden sm:inline">Make more of every click / 301 Ping</span>
                </div>

                <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-12 lg:gap-12 lg:py-10">
                    <div className="lg:col-span-7">
                        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                            One small link. A whole lot more.
                        </p>
                        <h1
                            id="hero-heading"
                            className="font-editorial text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.92] tracking-[-0.04em] text-ink"
                        >
                            Short links.
                            <br />
                            <span className="relative inline-block text-accent-dark">
                                Big possibilities.
                                <span
                                    className="absolute -bottom-2 left-0 h-1 w-2/3 -rotate-1 bg-accent sm:h-1.5"
                                    aria-hidden="true"
                                />
                            </span>
                        </h1>
                        <p className="mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                            Shorten a link in seconds. Then do more with it: track clicks, create QR codes, and
                            manage every link in one place.
                        </p>

                        <div className="relative isolate mt-8 max-w-xl border border-ink bg-white p-5 sm:mt-10 sm:p-6">
                            <div
                                className="absolute -bottom-2 left-2 right-[-8px] top-2 -z-10 bg-accent"
                                aria-hidden="true"
                            />
                            <p className="mb-5 flex items-center justify-between gap-4 border-b border-line pb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white">
                                <span>Start here</span>
                                <span>Long link → short link</span>
                            </p>
                            <UrlShortener />
                        </div>
                        <p className="mt-5 font-mono text-xs leading-relaxed text-muted">
                            No account needed to shorten. No expiration date set.
                        </p>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="relative overflow-hidden bg-accent px-6 pb-5 pt-6 text-ink sm:px-8 sm:pt-8">
                            <div
                                className="pointer-events-none absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)",
                                    backgroundSize: "32px 32px"
                                }}
                                aria-hidden="true"
                            />
                            <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em]">
                                <span>Not just a shortener</span>
                                <span>01 → ∞</span>
                            </div>

                            <div
                                className="relative flex h-48 items-center justify-center sm:h-56"
                                aria-hidden="true"
                            >
                                <div className="absolute h-36 w-36 rounded-full border border-ink/40 sm:h-44 sm:w-44" />
                                <div className="absolute h-48 w-48 rounded-full border border-ink/30 sm:h-56 sm:w-56" />
                                <div className="absolute h-px w-full -rotate-[20deg] bg-ink/40" />
                                <div className="absolute h-px w-full rotate-[20deg] bg-ink/40" />
                                <span className="absolute left-[12%] top-[25%] h-3 w-3 rounded-full border border-ink bg-paper" />
                                <span className="absolute bottom-[24%] right-[13%] h-4 w-4 rounded-full bg-ink" />
                                <span className="relative -rotate-6 border border-ink bg-paper px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.1em] shadow-[5px_5px_0_#111111] sm:text-base">
                                    Your link ↗
                                </span>
                            </div>

                            <div className="relative flex items-end justify-between gap-4 border-t border-ink/30 pt-4">
                                <p className="max-w-[13rem] font-editorial text-3xl leading-none sm:text-4xl">
                                    One link. Many directions.
                                </p>
                                <span className="pb-1 font-mono text-[10px] uppercase tracking-[0.12em]">
                                    Go further ↗
                                </span>
                            </div>
                        </div>

                        <div className="bg-ink px-6 py-5 text-paper sm:px-8">
                            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/70">
                                A whole toolkit behind every link
                            </p>
                            <div className="grid grid-cols-2 gap-x-5">
                                {CAPABILITIES.map((capability) => (
                                    <a
                                        key={capability.title}
                                        href={capability.href}
                                        className="group flex min-w-0 items-center justify-between gap-2 border-t border-paper/20 py-3 text-paper transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                                    >
                                        <span className="min-w-0 text-xs font-bold sm:text-sm">
                                            {capability.title}
                                        </span>
                                        <ArrowIcon className="h-3.5 w-3.5 shrink-0" />
                                    </a>
                                ))}
                            </div>
                            <p className="border-t border-paper/20 pt-4 font-mono text-[10px] leading-relaxed uppercase tracking-[0.1em] text-paper/70">
                                Plus tags, editable destinations, API &amp; browser extensions
                            </p>
                        </div>
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

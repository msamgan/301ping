import UrlShortener from "@/Components/Home/UrlShortener"
import Reveal from "@/Components/Home/Reveal"

export default function Hero() {
    return (
        <section className="border-b border-line bg-paper" aria-labelledby="hero-heading">
            <div className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 pt-16 md:pt-20 pb-20 md:pb-28">
                <Reveal className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-8 md:mb-12">
                    <span>01 / URL Utility</span>
                    <span className="hidden sm:inline">301p.ing</span>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-14 items-end">
                    <Reveal
                        as="h1"
                        id="hero-heading"
                        className="lg:col-span-7 font-editorial text-ink leading-[1.05] text-6xl sm:text-7xl lg:text-8xl"
                    >
                        Short links
                        <br />
                        that move.
                    </Reveal>

                    <Reveal delay={80} className="lg:col-span-5 lg:pl-6 lg:border-l lg:border-line">
                        <p className="font-grotesk text-lg text-muted max-w-md mb-8">
                            Paste a long URL below to create a short, shareable link in an instant.
                        </p>
                        <UrlShortener />
                    </Reveal>
                </div>
            </div>
        </section>
    )
}

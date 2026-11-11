import Reveal from "@/Components/Home/Reveal"

export default function LinkPromise() {
    const founderOriginLine =
        "It all started in 2026, when I was working on a side project and needed a simple URL shortener. I couldn't find one that met my needs, so I built 301 Ping for myself. I've been using it ever since, and now I want to share it with the world."

    return (
        <section className="border-b border-line bg-paper" aria-labelledby="link-promise-heading">
            <div className="mx-auto grid max-w-grid grid-cols-1 gap-8 px-6 py-16 md:grid-cols-12 md:px-10 md:py-20 lg:px-16">
                <Reveal className="md:col-span-7">
                    <h2
                        id="link-promise-heading"
                        className="max-w-3xl font-editorial text-4xl leading-[1.05] text-ink sm:text-5xl"
                    >
                        Your short links don&apos;t expire. Keep a copy.
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
                        We don&apos;t set an expiry date on short links. Export your saved short URLs,
                        destinations, and tags as a CSV from your Links page.
                    </p>
                </Reveal>

                <Reveal delay={80} className="border-l border-line pl-6 md:col-span-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Built by</p>
                    <p className="mt-3 text-lg font-bold text-ink">Mohammed Samgan Khan</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                        Software engineer and founder of 301 Ping.
                    </p>
                    {founderOriginLine && (
                        <p className="mt-2 text-sm leading-relaxed text-muted">{founderOriginLine}</p>
                    )}
                    <a
                        href={route("founder")}
                        className="mt-5 inline-flex font-mono text-[10px] uppercase tracking-[0.16em] text-accent-dark underline underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-dark"
                    >
                        Meet the founder
                    </a>
                </Reveal>
            </div>
        </section>
    )
}

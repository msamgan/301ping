import Reveal from "@/Components/Home/Reveal"

const STEPS = [
    { title: "Paste", body: "Drop your long URL into the field above." },
    { title: "Shorten", body: "Get a short link with no set expiry date." },
    { title: "Share", body: "Send it anywhere. Copy it in one click." }
]

export default function Process() {
    return (
        <section className="border-b border-line bg-paper" aria-labelledby="process-heading">
            <div className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 py-20 md:py-28">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-12">
                    <div className="lg:col-span-4">
                        <Reveal className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-8">
                            05 / Process
                        </Reveal>
                        <Reveal
                            as="h2"
                            id="process-heading"
                            className="font-grotesk font-extrabold text-ink text-4xl leading-[1.05]"
                        >
                            How to create a short link.
                        </Reveal>
                    </div>

                    <ol className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 border-t border-line">
                        {STEPS.map((step, index) => (
                            <Reveal
                                key={step.title}
                                as="li"
                                delay={index * 80}
                                className="py-8 sm:pr-8 border-b sm:border-b-0 sm:border-r border-line last:border-r-0 last:pr-0"
                            >
                                <span className="font-mono text-xs text-muted">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <h3 className="font-grotesk font-bold text-ink text-xl mt-3 mb-2">
                                    {step.title}
                                </h3>
                                <p className="font-grotesk text-sm text-muted leading-relaxed">{step.body}</p>
                            </Reveal>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    )
}

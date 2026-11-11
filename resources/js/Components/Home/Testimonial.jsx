import Reveal from "@/Components/Home/Reveal"

const TESTIMONIALS = [
    {
        quote: "301 Ping has become an integral part of how we manage and share links at Growthloom Media. It keeps our campaigns organized, our URLs clean, and our team moving without adding complexity.",
        name: "Amaan Ullah Khan",
        company: "Growthloom Media",
        website: "https://growthloommedia.com/",
        role: "CEO",
        photo: null,
        outcome:
            "We've seen a 30% increase in click-through rates on our campaigns since we started using 301 Ping to manage our links."
    },
    {
        quote: "301 Ping has become a dependable part of our day-to-day link sharing at Nexus LogX LLC. Creating clean, trackable links helps us keep communications organized and makes it easier for our team to share the right destination.",
        name: "Ahmed Rami Murad",
        company: "Nexus LogX LLC",
        website: "https://nexuslogx.com/",
        role: "CEO",
        photo: null,
        outcome:
            "We've seen a 25% increase in engagement on our shared links since we started using 301 Ping to manage our links."
    }
]

export default function Testimonial() {
    return (
        <section className="border-b border-line bg-paper" aria-labelledby="testimonial-heading">
            <div className="mx-auto max-w-grid px-6 py-20 md:px-10 md:py-28 lg:px-16">
                <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end">
                    <Reveal className="md:col-span-7">
                        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                            06 / Client perspective
                        </p>
                        <h2
                            id="testimonial-heading"
                            className="max-w-3xl font-editorial text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl"
                        >
                            Good links. Better work.
                        </h2>
                    </Reveal>
                    <Reveal delay={80} className="md:col-span-5 md:justify-self-end">
                        <p className="max-w-md text-base leading-relaxed text-muted">
                            A look at how teams use 301 Ping to keep the links they share clean and organized.
                        </p>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 border-t border-line lg:grid-cols-2">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <Reveal
                            key={testimonial.company}
                            delay={index * 80}
                            className={`flex flex-col justify-between gap-10 py-8 md:py-10 ${
                                index === 0 ? "lg:border-r lg:border-line lg:pr-10" : "lg:pl-10"
                            } ${index > 0 ? "border-t border-line lg:border-t-0" : ""}`}
                        >
                            <figure className="flex h-full flex-col justify-between gap-10">
                                <span
                                    className="font-editorial text-5xl leading-none text-accent"
                                    aria-hidden="true"
                                >
                                    “
                                </span>
                                <blockquote className="-mt-8 font-editorial text-2xl leading-[1.2] text-ink sm:text-3xl">
                                    {testimonial.quote}
                                </blockquote>
                                {testimonial.outcome && (
                                    <p className="font-semibold text-ink">{testimonial.outcome}</p>
                                )}
                                <figcaption className="flex flex-wrap items-end justify-between gap-5 border-t border-line pt-5 font-grotesk">
                                    <div className="flex items-center gap-3">
                                        {testimonial.photo && (
                                            <img
                                                src={testimonial.photo}
                                                alt={testimonial.name}
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
                                        )}
                                        <div>
                                            <span className="block font-bold text-ink">{testimonial.name}</span>
                                            {testimonial.role && (
                                                <span className="mt-1 block text-sm text-muted">
                                                    {testimonial.role}
                                                </span>
                                            )}
                                            <span className="mt-1 block text-sm text-muted">
                                                {testimonial.company}
                                            </span>
                                        </div>
                                    </div>
                                    <a
                                        href={testimonial.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-accent-dark underline underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-dark"
                                    >
                                        Visit website
                                        <span aria-hidden="true">↗</span>
                                    </a>
                                </figcaption>
                            </figure>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}

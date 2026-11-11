import Reveal from "@/Components/Home/Reveal"

const TESTIMONIALS = [
    {
        quote: "301 Ping has become an integral part of how we manage and share links at Growthloom Media. It keeps our campaigns organized, our URLs clean, and our team moving without adding complexity.",
        name: "Amaan Ullah Khan",
        company: "Growthloom Media"
    },
    {
        quote: "301 Ping has become a dependable part of our day-to-day link sharing at Nexus LogX LLC. Creating clean, trackable links helps us keep communications organized and makes it easier for our team to share the right destination.",
        name: "Ahmed Rami Murad",
        company: "Nexus LogX LLC"
    }
]

export default function Testimonial() {
    return (
        <section className="border-b border-line bg-paper" aria-labelledby="testimonial-heading">
            <div className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 py-20 md:py-28">
                <Reveal className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-8">
                    06 / Client perspective
                </Reveal>
                <h2 id="testimonial-heading" className="sr-only">
                    What teams say about 301 Ping
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-10">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <Reveal
                            key={testimonial.company}
                            delay={index * 80}
                            className="flex flex-col justify-between gap-8 border-t border-line pt-8"
                        >
                            <figure className="flex h-full flex-col justify-between gap-8">
                                <blockquote className="font-editorial text-ink text-3xl sm:text-4xl leading-[1.15]">
                                    “{testimonial.quote}”
                                </blockquote>
                                <figcaption className="font-grotesk">
                                    <span className="block font-bold text-ink">{testimonial.name}</span>
                                    <span className="block text-sm text-muted">{testimonial.company}</span>
                                </figcaption>
                            </figure>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}

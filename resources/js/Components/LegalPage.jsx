import { Head, usePage } from "@inertiajs/react"
import Header from "@/Components/Header.jsx"
import Footer from "@/Components/Footer.jsx"
import Reveal from "@/Components/Home/Reveal"

export default function LegalPage({ title, eyebrow, heading, introduction, sections }) {
    const user = usePage().props.auth?.user

    return (
        <>
            <Head title={title} />
            <Header isAuthenticated={!!user} user={user} />

            <main className="bg-paper font-grotesk text-ink">
                <section className="border-b border-line" aria-labelledby="legal-heading">
                    <div className="mx-auto max-w-grid px-6 pb-16 pt-16 md:px-10 md:pb-20 md:pt-20 lg:px-16">
                        <Reveal className="mb-8 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:mb-12">
                            <span>01 / {eyebrow}</span>
                            <span className="hidden sm:inline">301 ping / Policy</span>
                        </Reveal>

                        <div className="grid grid-cols-1 items-end gap-x-10 gap-y-10 lg:grid-cols-12">
                            <Reveal
                                as="h1"
                                id="legal-heading"
                                className="font-editorial text-6xl leading-[1.05] sm:text-7xl lg:col-span-7 lg:text-8xl"
                            >
                                {heading}
                            </Reveal>
                            <Reveal delay={80} className="lg:col-span-5 lg:border-l lg:border-line lg:pl-6">
                                <p className="max-w-md text-lg text-muted">{introduction}</p>
                            </Reveal>
                        </div>
                    </div>
                </section>

                <section className="border-b border-line" aria-label={`${title} details`}>
                    <div className="mx-auto max-w-grid px-6 py-8 md:px-10 md:py-12 lg:px-16">
                        {sections.map((section, index) => (
                            <article
                                key={section.title}
                                className="grid grid-cols-1 gap-x-10 gap-y-4 border-b border-line py-8 last:border-b-0 md:grid-cols-12 md:py-10"
                            >
                                <div className="md:col-span-4">
                                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                                        {String(index + 2).padStart(2, "0")} / 301 ping
                                    </p>
                                    <h2 className="max-w-sm text-2xl font-extrabold leading-tight sm:text-3xl">
                                        {section.title}
                                    </h2>
                                </div>
                                <div className="space-y-4 text-sm leading-relaxed text-muted md:col-span-8 md:text-base">
                                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                                        <p key={paragraphIndex}>{paragraph}</p>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    )
}

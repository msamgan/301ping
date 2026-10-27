import { Head, Link, usePage } from "@inertiajs/react"
import Footer from "@/Components/Footer"
import Header from "@/Components/Header"

const comparison = [
    { label: "Auto-generated", slug: "301p.ing/x7Kq2", muted: true },
    { label: "Custom back-half", slug: "301p.ing/spring", muted: false },
    { label: "Custom back-half", slug: "301p.ing/guide", muted: false }
]

const benefits = [
    {
        number: "01",
        title: "Links people can read and remember",
        description:
            "Replace random characters with a word that says what the link is. Visitors know where they are going before they click."
    },
    {
        number: "02",
        title: "More trust, more clicks",
        description:
            "A meaningful back-half looks intentional and safe. Readable links feel less like spam and earn more clicks."
    },
    {
        number: "03",
        title: "Easy to say out loud",
        description:
            "Share a link on a podcast, a call, or a slide without spelling out letters. Short, pronounceable slugs just work."
    },
    {
        number: "04",
        title: "Great on print and packaging",
        description:
            "Short custom links are simple to type from a flyer, poster, or business card, and pair well with QR codes."
    },
    {
        number: "05",
        title: "Change it anytime",
        description:
            "Picked the wrong word? Edit the back-half from your Links page whenever you like. No need to recreate the link."
    },
    {
        number: "06",
        title: "Same analytics, nicer address",
        description:
            "Custom links keep all the tracking, tags, and QR codes of a regular short link. You only change how it looks."
    }
]

const steps = [
    {
        number: "01",
        title: "Create a short link",
        description: "Paste your long URL on the home page or from your dashboard and shorten it."
    },
    {
        number: "02",
        title: "Edit the back-half",
        description: "Open the link from your Links page and type the slug you want in place of the random one."
    },
    {
        number: "03",
        title: "Share it",
        description: "Your new address is live immediately. Copy it, print it, or turn it into a QR code."
    }
]

const useCases = [
    {
        title: "Campaigns and launches",
        description: "Use names like /spring or /launch so every channel carries a consistent, branded address."
    },
    {
        title: "Social bios and profiles",
        description: "Give your bio link a name people can recall, such as /portfolio or /book."
    },
    {
        title: "Events and talks",
        description: "Put /slides or /rsvp on screen and let the audience type it in seconds."
    },
    {
        title: "Docs and support",
        description: "Point to help articles with links like /setup or /faq that teammates can guess."
    }
]

const specs = [
    { label: "Length", value: "3 to 8 characters" },
    { label: "Allowed characters", value: "Letters, numbers, - _ . ~" },
    { label: "Uniqueness", value: "Each back-half is first come, first served" },
    { label: "Free plan", value: "3 customized links" },
    { label: "Paid plans", value: "Unlimited customized links" },
    { label: "Reserved words", value: "App page names are protected" }
]

function SlugPreview() {
    return (
        <div className="relative mx-auto w-full max-w-xl overflow-hidden border border-line bg-ink p-6 sm:p-8">
            <div
                className="absolute inset-0 opacity-30"
                aria-hidden="true"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
                    backgroundSize: "32px 32px"
                }}
            />
            <div className="relative">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/50">
                    301 Ping / Edit back-half
                </p>
                <div className="mt-4 border border-paper/20 px-4 py-3 font-mono text-sm text-paper/80">
                    301p.ing/<span className="bg-accent px-1 text-white">spring</span>
                </div>
                <div className="mt-6 divide-y divide-paper/15 border border-paper/15 bg-paper text-ink">
                    {comparison.map((row) => (
                        <div key={row.slug} className="flex items-center justify-between gap-3 px-4 py-3.5">
                            <p
                                className={`truncate font-grotesk text-sm ${row.muted ? "text-muted line-through" : "font-bold"}`}
                            >
                                {row.slug}
                            </p>
                            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                                {row.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function CustomLinks() {
    const { auth } = usePage().props
    const user = auth?.user
    const isAuthenticated = !!user

    return (
        <div className="min-h-screen bg-paper">
            <Head
                title="Custom Links"
                description="Customize the back-half of your short links. Replace random characters with a memorable word that builds trust, boosts clicks, and is easy to share."
            />
            <Header isAuthenticated={isAuthenticated} user={user} />

            <main className="font-grotesk text-ink">
                <section className="border-b border-line">
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-12 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-16 lg:py-28">
                        <div className="lg:col-span-6">
                            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Services / Custom links
                            </p>
                            <h1 className="max-w-2xl font-editorial text-5xl font-normal leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
                                Your link, <span className="text-accent">your words.</span>
                            </h1>
                            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                                Customize the back-half of any short link. Swap a random string for something
                                meaningful, so your links are easier to read, remember, and trust.
                            </p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={isAuthenticated ? route("links") : route("register")}
                                    className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-accent-dark hover:bg-accent-dark"
                                >
                                    {isAuthenticated ? "Customize your links" : "Get started"}
                                </Link>
                                <Link
                                    href={route("pricing")}
                                    className="inline-flex items-center justify-center border border-line px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
                                >
                                    Explore plans
                                </Link>
                            </div>
                            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                Memorable / Editable anytime / Works with QR codes
                            </p>
                        </div>

                        <div className="lg:col-span-6">
                            <SlugPreview />
                        </div>
                    </div>
                </section>

                <section className="border-b border-line">
                    <div className="mx-auto max-w-grid px-6 py-16 md:px-10 md:py-24 lg:px-16">
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                            <div className="lg:col-span-4">
                                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                    Why customize?
                                </p>
                                <h2 className="mt-5 max-w-sm font-editorial text-4xl font-normal leading-tight text-ink sm:text-5xl">
                                    A small change that shows.
                                </h2>
                                <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                                    The back-half is the part of a link people actually see. Making it
                                    meaningful turns a utility into part of your brand.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-8 lg:gap-x-7 lg:gap-y-10">
                                {benefits.map((benefit) => (
                                    <article key={benefit.number} className="border-t border-line pt-5">
                                        <span className="font-mono text-xs text-accent">{benefit.number}</span>
                                        <h3 className="mt-4 font-grotesk text-base font-bold text-ink">
                                            {benefit.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-relaxed text-muted">
                                            {benefit.description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-line bg-white">
                    <div className="mx-auto max-w-grid px-6 py-16 md:px-10 md:py-24 lg:px-16">
                        <div className="mb-10 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                    Simple by design
                                </p>
                                <h2 className="mt-4 font-editorial text-4xl font-normal text-ink sm:text-5xl">
                                    Three steps to a better link.
                                </h2>
                            </div>
                            <p className="max-w-sm text-sm leading-relaxed text-muted">
                                No extra tools or domains to configure. Edit the slug and you are done.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3">
                            {steps.map((step, index) => (
                                <article
                                    key={step.number}
                                    className={`py-6 sm:pr-8 ${index > 0 ? "border-t border-line sm:border-l sm:border-t-0 sm:pl-8" : ""}`}
                                >
                                    <span className="font-mono text-xs text-accent">{step.number}</span>
                                    <h3 className="mt-5 font-grotesk text-lg font-bold text-ink">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                                        {step.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-b border-line bg-ink text-paper">
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-10 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-12 lg:items-start lg:px-16">
                        <div className="lg:col-span-5">
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
                                Built for how you share
                            </p>
                            <h2 className="mt-5 font-editorial text-4xl font-normal leading-tight text-paper sm:text-5xl">
                                Wherever a link appears.
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
                            {useCases.map((useCase) => (
                                <div key={useCase.title} className="border-t border-paper/20 pt-5">
                                    <h3 className="font-grotesk text-base font-bold text-paper">
                                        {useCase.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-paper/65">
                                        {useCase.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-b border-line">
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-6 px-6 py-10 md:px-10 lg:grid-cols-12 lg:items-center lg:px-16">
                        <div className="lg:col-span-4">
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                At a glance
                            </p>
                            <h2 className="mt-3 font-grotesk text-lg font-bold text-ink">
                                Simple rules, predictable results.
                            </h2>
                        </div>
                        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
                            {specs.map((spec) => (
                                <div key={spec.label} className="border-l border-line pl-4">
                                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                                        {spec.label}
                                    </dt>
                                    <dd className="mt-1 text-sm text-ink">{spec.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>

                <section className="bg-ink text-paper">
                    <div className="mx-auto flex max-w-grid flex-col gap-8 px-6 py-16 md:px-10 md:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-16">
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
                                Ready to stand out?
                            </p>
                            <h2 className="mt-4 max-w-2xl font-editorial text-4xl font-normal leading-tight text-paper sm:text-5xl">
                                Make every link say something.
                            </h2>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                            <Link
                                href={isAuthenticated ? route("links") : route("register")}
                                className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-accent-dark hover:bg-accent-dark"
                            >
                                {isAuthenticated ? "Customize your links" : "Create your account"}
                            </Link>
                            <Link
                                href={route("pricing")}
                                className="inline-flex items-center justify-center border border-paper/30 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-paper hover:bg-paper/10"
                            >
                                See pricing
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

import { Link, usePage } from "@inertiajs/react"
import Footer from "@/Components/Footer"
import Header from "@/Components/Header"
import SeoHead from "@/Components/SeoHead"

const comparison = [
    { label: "Before", slug: "oldsite.com/spring-sale-2025", muted: true },
    { label: "After", slug: "newsite.com/spring-sale-2026", muted: false },
    { label: "Short link", slug: "301p.ing/spring (unchanged)", muted: false }
]

const benefits = [
    {
        number: "01",
        title: "Fix mistakes without reprinting",
        description:
            "Typo in the URL? Wrong landing page? Update the destination and every flyer, QR code, and post keeps working."
    },
    {
        number: "02",
        title: "Keep the same short link",
        description:
            "Your 301p.ing address never changes, so nobody has to update a bio, a deck, or a printed poster."
    },
    {
        number: "03",
        title: "Rotate campaigns instantly",
        description:
            "Point an evergreen link like /offer at this month's promotion in seconds, with no redeploy and no waiting."
    },
    {
        number: "04",
        title: "Survive site migrations",
        description:
            "Moving domains or restructuring URLs? Repoint your links in one place instead of hunting down every mention."
    },
    {
        number: "05",
        title: "Recover from broken pages",
        description:
            "Pair with broken destination monitoring: when a page goes down, swap in a working one before visitors notice."
    },
    {
        number: "06",
        title: "Analytics stay intact",
        description:
            "Clicks, tags, and QR codes stay attached to the link, so your history is continuous across every destination."
    }
]

const steps = [
    {
        number: "01",
        title: "Open your link",
        description: "Find the short link on your Links page and open its details."
    },
    {
        number: "02",
        title: "Paste the new destination",
        description: "Enter the new URL. We validate it so you do not redirect people to a dead end."
    },
    {
        number: "03",
        title: "Save and go live",
        description: "Visitors are redirected to the new page right away. Nothing to reprint or reshare."
    }
]

const useCases = [
    {
        title: "Seasonal campaigns",
        description: "Keep one /sale link and point it at the current promotion all year."
    },
    {
        title: "Printed materials and QR codes",
        description: "Fix or update the target of a code that is already on packaging, menus, or posters."
    },
    {
        title: "Website redesigns",
        description: "Repoint links to new URLs after a migration without touching a single share."
    },
    {
        title: "Event follow-ups",
        description: "Switch /rsvp to a recording or thank-you page once the event wraps."
    }
]

const specs = [
    { label: "Free plan", value: "1 edited destination" },
    { label: "Redirect plan", value: "10 edited destinations" },
    { label: "Redirect Plus plan", value: "20 edited destinations" },
    { label: "Short link", value: "Stays the same after every edit" },
    { label: "Takes effect", value: "Immediately" },
    { label: "Analytics", value: "Preserved across edits" },
    { label: "QR codes", value: "Keep working, no reprint needed" }
]

function DestinationPreview() {
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
                    301 Ping / Edit destination
                </p>
                <div className="mt-4 border border-paper/20 px-4 py-3 font-mono text-sm text-paper/80">
                    301p.ing/spring <span className="bg-accent px-1 text-white">→ new URL</span>
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

export default function EditDestination() {
    const { auth } = usePage().props
    const user = auth?.user
    const isAuthenticated = !!user

    return (
        <div className="min-h-screen bg-paper">
            <SeoHead
                title="Edit Short Link Destinations"
                description="Change the destination behind a short link without changing its URL. Fix mistakes, rotate campaigns, and update old links without reprinting."
            />
            <Header isAuthenticated={isAuthenticated} user={user} />

            <main className="font-grotesk text-ink">
                <section className="border-b border-line">
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-12 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-16 lg:py-28">
                        <div className="lg:col-span-6">
                            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Services / Edit destination
                            </p>
                            <h1 className="max-w-2xl font-editorial text-5xl font-normal leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
                                Change a short link destination, <span className="text-accent">not the link.</span>
                            </h1>
                            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                                Change where a short link sends people without touching the link itself. Fix a
                                typo, launch a new campaign, or move to a new site while every QR code, post,
                                and printout keeps working.
                            </p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={isAuthenticated ? route("links") : route("register")}
                                    className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-accent-dark hover:bg-accent-dark"
                                >
                                    {isAuthenticated ? "Edit your links" : "Get started"}
                                </Link>
                                <Link
                                    href={route("pricing")}
                                    className="inline-flex items-center justify-center border border-line px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
                                >
                                    Explore plans
                                </Link>
                            </div>
                            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                Instant / No reprinting / Free plan includes 1 edit
                            </p>
                        </div>

                        <div className="lg:col-span-6">
                            <DestinationPreview />
                        </div>
                    </div>
                </section>

                <section className="border-b border-line">
                    <div className="mx-auto max-w-grid px-6 py-16 md:px-10 md:py-24 lg:px-16">
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                            <div className="lg:col-span-4">
                                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                    Why edit destinations?
                                </p>
                                <h2 className="mt-5 max-w-sm font-editorial text-4xl font-normal leading-tight text-ink sm:text-5xl">
                                    Change the target, keep the link.
                                </h2>
                                <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                                    A short link is a promise to the people who hold it. Editing the destination
                                    lets you keep that promise even when the page behind it changes.
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
                                    Three steps to a new target.
                                </h2>
                            </div>
                            <p className="max-w-sm text-sm leading-relaxed text-muted">
                                No redeploys and no new links. Update the URL and you are done.
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
                                Free gets one. Paid gets unlimited.
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
                                Ready to stay flexible?
                            </p>
                            <h2 className="mt-4 max-w-2xl font-editorial text-4xl font-normal leading-tight text-paper sm:text-5xl">
                                Never reprint a link again.
                            </h2>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                            <Link
                                href={isAuthenticated ? route("links") : route("register")}
                                className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-accent-dark hover:bg-accent-dark"
                            >
                                {isAuthenticated ? "Edit your links" : "Create your account"}
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

import { Head, Link, usePage } from "@inertiajs/react"
import Footer from "@/Components/Footer"
import Header from "@/Components/Header"

const benefits = [
    {
        number: "01",
        title: "Catch dead ends earlier",
        description:
            "Find out when a destination is no longer reachable, before a broken page becomes the first impression of your campaign."
    },
    {
        number: "02",
        title: "Protect every place you share",
        description:
            "Keep an eye on destinations behind links in bios, emails, QR codes, ads, and printed materials—all from one link workflow."
    },
    {
        number: "03",
        title: "Spend less time chasing links",
        description:
            "See which destination needs attention and head straight to the short link that points to it instead of checking URLs one by one."
    },
    {
        number: "04",
        title: "Keep campaigns moving",
        description:
            "Spot a problem with a landing page or offer while there is still time to update the destination and keep your audience on track."
    }
]

const steps = [
    {
        number: "01",
        title: "Create and share a short link",
        description:
            "Use a 301 Ping link anywhere your audience needs to go, from a social post to a QR code on a poster."
    },
    {
        number: "02",
        title: "Review destination health",
        description:
            "Check the destination behind your link and identify links that may no longer lead to a working page."
    },
    {
        number: "03",
        title: "Fix the destination",
        description:
            "Update the destination for the affected short link, then share the same short URL with confidence."
    }
]

const useCases = [
    {
        title: "Campaign landing pages",
        description:
            "Catch expired launch pages or changed offers before campaign traffic runs into a dead end."
    },
    {
        title: "Printed QR codes",
        description:
            "Keep the destination behind a flyer, menu, or package useful even after the printed code is out in the world."
    },
    {
        title: "Social and bio links",
        description:
            "Check that the important links in profiles and posts still point people to the right place."
    },
    {
        title: "Team link libraries",
        description:
            "Make it easier to spot stale resources in a shared collection of product, support, or documentation links."
    }
]

function DestinationPreview() {
    const destinations = [
        { short: "301p.ing/summer-sale", destination: "shop.example.com/summer", status: "Reachable" },
        { short: "301p.ing/event-rsvp", destination: "events.example.com/rsvp", status: "Check needed" },
        { short: "301p.ing/help-center", destination: "support.example.com/start", status: "Reachable" }
    ]

    return (
        <div className="relative mx-auto w-full max-w-xl overflow-hidden border border-line bg-ink p-5 sm:p-8">
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
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/50">
                            301 Ping / Destination health
                        </p>
                        <h2 className="mt-2 font-grotesk text-lg font-bold text-paper">Link overview</h2>
                    </div>
                    <span className="border border-paper/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-paper/65">
                        Example
                    </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="border border-paper/15 bg-paper/5 p-3">
                        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper/50">
                            Destinations checked
                        </p>
                        <p className="mt-2 font-editorial text-3xl text-paper">24</p>
                    </div>
                    <div className="border border-accent/40 bg-accent/10 p-3">
                        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper/60">
                            Need a closer look
                        </p>
                        <p className="mt-2 font-editorial text-3xl text-paper">02</p>
                    </div>
                </div>

                <div className="mt-4 divide-y divide-line border border-line bg-paper text-ink">
                    {destinations.map((destination) => (
                        <div key={destination.short} className="px-3 py-3.5 sm:px-4">
                            <div className="flex items-center justify-between gap-3">
                                <p className="truncate font-mono text-[10px] font-bold sm:text-xs">
                                    {destination.short}
                                </p>
                                <span
                                    className={`shrink-0 font-mono text-[8px] uppercase tracking-[0.08em] sm:text-[9px] ${
                                        destination.status === "Reachable"
                                            ? "text-emerald-700"
                                            : "text-accent-dark"
                                    }`}
                                >
                                    {destination.status}
                                </span>
                            </div>
                            <p className="mt-1 truncate font-grotesk text-[10px] text-muted">
                                → {destination.destination}
                            </p>
                        </div>
                    ))}
                </div>
                <p className="mt-3 font-mono text-[9px] text-paper/45">
                    Sample view · status labels are illustrative
                </p>
            </div>
        </div>
    )
}

export default function BrokenDestinations() {
    const { auth } = usePage().props
    const user = auth?.user
    const isAuthenticated = !!user
    const primaryHref = isAuthenticated ? route("links") : route("register")
    const primaryLabel = isAuthenticated ? "Review your links" : "Get started"

    return (
        <div className="min-h-screen bg-paper">
            <Head
                title="Broken Destination Monitoring"
                description="Monitor the destinations behind your short links, catch broken pages earlier, and keep campaigns, QR codes, and shared links working."
            />
            <Header isAuthenticated={isAuthenticated} user={user} />

            <main className="font-grotesk text-ink">
                <section className="border-b border-line">
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-12 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-16 lg:py-28">
                        <div className="lg:col-span-6">
                            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Services / Broken destination monitoring
                            </p>
                            <h1 className="max-w-2xl font-editorial text-5xl font-normal leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
                                Find the dead ends. <span className="text-accent">Keep links alive.</span>
                            </h1>
                            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                                A short link is only useful when it leads somewhere. Monitor the pages behind
                                your links, catch destinations that need attention, and keep people moving
                                toward what matters.
                            </p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={primaryHref}
                                    className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-accent-dark hover:bg-accent-dark"
                                >
                                    {primaryLabel}
                                </Link>
                                <Link
                                    href={route("pricing")}
                                    className="inline-flex items-center justify-center border border-line px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
                                >
                                    Explore plans
                                </Link>
                            </div>
                            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                Spot problems / Update destinations / Keep sharing
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
                                    Why monitor destinations?
                                </p>
                                <h2 className="mt-5 max-w-sm font-editorial text-4xl font-normal leading-tight text-ink sm:text-5xl">
                                    Every click deserves a working page.
                                </h2>
                                <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                                    Pages move, offers expire, and URLs change. A little visibility helps you
                                    catch the links that no longer do their job.
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
                                    Straightforward link care
                                </p>
                                <h2 className="mt-4 font-editorial text-4xl font-normal text-ink sm:text-5xl">
                                    From warning to working link.
                                </h2>
                            </div>
                            <p className="max-w-sm text-sm leading-relaxed text-muted">
                                Find the link that needs attention, update where it points, and keep its short
                                address in circulation.
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
                                Built for links in the real world
                            </p>
                            <h2 className="mt-5 font-editorial text-4xl font-normal leading-tight text-paper sm:text-5xl">
                                Be there when a destination changes.
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
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-8 px-6 py-14 md:px-10 lg:grid-cols-12 lg:px-16">
                        <div className="lg:col-span-4">
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Good to know
                            </p>
                            <h2 className="mt-4 font-editorial text-4xl font-normal leading-tight text-ink">
                                Your short link stays yours.
                            </h2>
                        </div>
                        <div className="divide-y divide-line border-y border-line lg:col-span-8">
                            <div className="py-5">
                                <h3 className="font-grotesk text-sm font-bold text-ink">
                                    What is a broken destination?
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted">
                                    It is the web page behind a short link that is unavailable, has moved, or
                                    otherwise no longer takes visitors where you intended.
                                </p>
                            </div>
                            <div className="py-5">
                                <h3 className="font-grotesk text-sm font-bold text-ink">
                                    Do I need to replace a shared short link?
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted">
                                    No. Update the destination associated with the short link and continue using
                                    the same address in your existing posts, materials, and QR codes.
                                </p>
                            </div>
                            <div className="py-5">
                                <h3 className="font-grotesk text-sm font-bold text-ink">
                                    Does monitoring guarantee a page will always be available?
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted">
                                    No monitor can guarantee another website stays online. Destination checks
                                    help you identify problems; the destination website itself remains outside
                                    301 Ping&apos;s control.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-ink text-paper">
                    <div className="mx-auto flex max-w-grid flex-col gap-8 px-6 py-16 md:px-10 md:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-16">
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
                                Keep every click on track
                            </p>
                            <h2 className="mt-4 max-w-2xl font-editorial text-4xl font-normal leading-tight text-paper sm:text-5xl">
                                Give every link a destination worth reaching.
                            </h2>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                            <Link
                                href={primaryHref}
                                className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-accent-dark hover:bg-accent-dark"
                            >
                                {isAuthenticated ? "Review your links" : "Create your account"}
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

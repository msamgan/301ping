import { Link, usePage } from "@inertiajs/react"
import Footer from "@/Components/Footer"
import Header from "@/Components/Header"
import SeoHead from "@/Components/SeoHead"

const dailyVisits = [31, 44, 37, 58, 49, 72, 64, 82, 59, 91, 76, 100, 68, 87]

const metrics = [
    { label: "Tracked visits", value: "1,284" },
    { label: "Last 30 days", value: "936" },
    { label: "Bot visits", value: "42" }
]

const breakdowns = [
    {
        title: "Where visitors are",
        description: "See the countries sending traffic to each short link.",
        rows: [
            { label: "United States", value: "418", percent: 84 },
            { label: "United Kingdom", value: "206", percent: 62 },
            { label: "Germany", value: "124", percent: 38 }
        ]
    },
    {
        title: "What they use",
        description: "Compare devices, browsers, and operating systems.",
        rows: [
            { label: "Mobile", value: "612", percent: 88 },
            { label: "Desktop", value: "318", percent: 54 },
            { label: "Tablet", value: "74", percent: 22 }
        ]
    },
    {
        title: "How they arrive",
        description: "Review referrers and the languages visitors use.",
        rows: [
            { label: "instagram.com", value: "284", percent: 76 },
            { label: "newsletter", value: "193", percent: 57 },
            { label: "Direct", value: "146", percent: 43 }
        ]
    }
]

const benefits = [
    {
        number: "01",
        title: "Understand every link",
        description:
            "Open a short link to see its visit totals and a clear picture of where its traffic comes from."
    },
    {
        number: "02",
        title: "Spot trends over time",
        description:
            "Use the daily visit chart for the last 30 days to see when a link is getting attention."
    },
    {
        number: "03",
        title: "Learn about your audience",
        description:
            "Explore country, device, browser, operating system, language, and referrer breakdowns."
    },
    {
        number: "04",
        title: "Keep bots in perspective",
        description:
            "Tracked visits include a bot count, while audience breakdowns focus on visits identified as non-robot traffic."
    }
]

function AnalyticsPreview() {
    return (
        <div className="relative mx-auto w-full max-w-xl overflow-hidden border border-line bg-ink p-5 sm:p-7">
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
                <div className="flex items-start justify-between gap-4 border-b border-paper/15 pb-4">
                    <div className="min-w-0">
                        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/50">
                            Link analytics
                        </p>
                        <p className="mt-2 truncate font-grotesk text-sm font-bold text-paper">
                            301p.ing/spring-launch
                        </p>
                    </div>
                    <span className="shrink-0 border border-paper/20 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/65">
                        Last 30 days
                    </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                    {metrics.map((metric) => (
                        <div key={metric.label} className="border border-paper/15 bg-paper/5 p-3 sm:p-4">
                            <p className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-paper/50 sm:text-[9px]">
                                {metric.label}
                            </p>
                            <p className="mt-2 font-grotesk text-xl font-bold tabular-nums text-paper sm:text-2xl">
                                {metric.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-4 border border-paper/15 bg-paper/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper/65">
                            Visits per day
                        </p>
                        <p className="font-mono text-[9px] text-paper/40">30 days</p>
                    </div>
                    <div
                        className="mt-4 flex h-24 items-end gap-1"
                        role="img"
                        aria-label="Illustrative bar chart showing daily visits over 30 days"
                    >
                        {dailyVisits.map((height, index) => (
                            <div
                                key={index}
                                className="flex-1 bg-accent"
                                style={{ height: `${height}%` }}
                            />
                        ))}
                    </div>
                </div>
                <p className="mt-3 font-mono text-[9px] text-paper/40">
                    Example dashboard · figures are illustrative
                </p>
            </div>
        </div>
    )
}

function BreakdownCard({ title, description, rows }) {
    return (
        <article className="border border-line bg-white p-5">
            <h3 className="font-grotesk text-base font-bold text-ink">{title}</h3>
            <p className="mt-2 min-h-10 text-sm leading-relaxed text-muted">{description}</p>
            <div className="mt-4 space-y-4">
                {rows.map((row) => (
                    <div key={row.label}>
                        <div className="flex items-center justify-between gap-3 font-mono text-[10px]">
                            <span className="truncate text-ink">{row.label}</span>
                            <span className="shrink-0 text-muted">{row.value}</span>
                        </div>
                        <div className="mt-2 h-1 bg-line">
                            <div className="h-full bg-accent" style={{ width: `${row.percent}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </article>
    )
}

export default function LinkAnalytics() {
    const { auth } = usePage().props
    const user = auth?.user
    const isAuthenticated = !!user
    const primaryHref = isAuthenticated ? route("links") : route("register")

    return (
        <div className="min-h-screen bg-paper">
            <SeoHead
                title="Link Analytics for Short URLs"
                description="Understand how your short links perform with visit trends and breakdowns by country, device, browser, operating system, language, and referrer."
            />
            <Header isAuthenticated={isAuthenticated} user={user} />

            <main className="font-grotesk text-ink">
                <section className="border-b border-line">
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-12 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-16 lg:py-28">
                        <div className="lg:col-span-6">
                            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Services / Link analytics
                            </p>
                            <h1 className="max-w-2xl font-editorial text-5xl font-normal leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
                                See what happens <span className="text-accent">after the click.</span>
                            </h1>
                            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                                Learn how your short links perform. Track visit trends and explore the
                                countries, devices, browsers, and sources behind your traffic.
                            </p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={primaryHref}
                                    className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-accent-dark hover:bg-accent-dark"
                                >
                                    {isAuthenticated ? "View your links" : "Get started"}
                                </Link>
                                <Link
                                    href={route("pricing")}
                                    className="inline-flex items-center justify-center border border-line px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
                                >
                                    Explore plans
                                </Link>
                            </div>
                            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                Per-link reports / 30-day trends / Audience breakdowns
                            </p>
                        </div>

                        <div className="lg:col-span-6">
                            <AnalyticsPreview />
                        </div>
                    </div>
                </section>

                <section className="border-b border-line">
                    <div className="mx-auto max-w-grid px-6 py-16 md:px-10 md:py-24 lg:px-16">
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                            <div className="lg:col-span-4">
                                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                    The full picture
                                </p>
                                <h2 className="mt-5 max-w-sm font-editorial text-4xl font-normal leading-tight text-ink sm:text-5xl">
                                    Turn clicks into useful context.
                                </h2>
                                <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                                    Each short link has its own analytics view, so you can understand
                                    performance without losing track of which link you shared.
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
                                    See the details
                                </p>
                                <h2 className="mt-4 font-editorial text-4xl font-normal text-ink sm:text-5xl">
                                    Know more than the total.
                                </h2>
                            </div>
                            <p className="max-w-sm text-sm leading-relaxed text-muted">
                                Explore the patterns around a link, from where visits come from to
                                the technology visitors use.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            {breakdowns.map((breakdown) => (
                                <BreakdownCard key={breakdown.title} {...breakdown} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-b border-line">
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-8 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-12 lg:items-start lg:px-16">
                        <div className="lg:col-span-4">
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Getting started
                            </p>
                            <h2 className="mt-5 font-editorial text-4xl font-normal leading-tight text-ink sm:text-5xl">
                                Analytics where your links live.
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:col-span-8">
                            {[
                                {
                                    number: "01",
                                    title: "Create a short link",
                                    description: "Shorten a destination from the home page or your dashboard."
                                },
                                {
                                    number: "02",
                                    title: "Share it anywhere",
                                    description: "Use the same short link in your campaigns, posts, or QR codes."
                                },
                                {
                                    number: "03",
                                    title: "Open its details",
                                    description: "Choose the link from your Links page to review its analytics."
                                }
                            ].map((step, index) => (
                                <article
                                    key={step.number}
                                    className={`py-6 sm:px-5 ${index === 0 ? "sm:pl-0" : ""} ${index === 2 ? "sm:pr-0" : ""}`}
                                >
                                    <span className="font-mono text-xs text-accent">{step.number}</span>
                                    <h3 className="mt-4 font-grotesk text-base font-bold text-ink">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted">
                                        {step.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-ink text-paper">
                    <div className="mx-auto flex max-w-grid flex-col gap-8 px-6 py-16 md:px-10 md:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-16">
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
                                Make your next move count
                            </p>
                            <h2 className="mt-4 max-w-2xl font-editorial text-4xl font-normal leading-tight text-paper sm:text-5xl">
                                Know which links are getting attention.
                            </h2>
                            <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper/60">
                                Link analytics are available on paid plans. Find the plan that fits how
                                you share.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                            <Link
                                href={route("pricing")}
                                className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-accent-dark hover:bg-accent-dark"
                            >
                                Compare plans
                            </Link>
                            <Link
                                href={primaryHref}
                                className="inline-flex items-center justify-center border border-paper/30 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-paper hover:bg-paper/10"
                            >
                                {isAuthenticated ? "View your links" : "Create your account"}
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

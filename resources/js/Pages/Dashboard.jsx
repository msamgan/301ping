import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link } from "@inertiajs/react"
import { useEffect, useState } from "react"
import axios from "axios"

const formatNumber = (value) => (value === undefined ? "—" : Number(value).toLocaleString())

const healthStyles = {
    healthy: "border-green-200 bg-green-50 text-green-800",
    unhealthy: "border-accent/30 bg-accent/10 text-accent-dark",
    unreachable: "border-line bg-ink/5 text-muted"
}

function HealthBadge({ health }) {
    const label = health ? health.charAt(0).toUpperCase() + health.slice(1) : "Unknown"

    return (
        <span
            className={`inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${
                healthStyles[health] || healthStyles.unreachable
            }`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
            {label}
        </span>
    )
}

function SectionLabel({ children }) {
    return <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{children}</p>
}

export default function Dashboard({ auth }) {
    const [dashboardData, setDashboardData] = useState(null)
    const [dashboardError, setDashboardError] = useState("")

    useEffect(() => {
        let isMounted = true

        axios
            .get(route("service.dashboard"))
            .then(({ data }) => {
                if (isMounted) setDashboardData(data)
            })
            .catch(() => {
                if (isMounted) {
                    setDashboardError("Your workspace summary could not be loaded. Please refresh the page.")
                }
            })

        return () => {
            isMounted = false
        }
    }, [])

    const healthSummary = dashboardData?.healthSummary || {}
    const needsAttention = (healthSummary.unhealthy || 0) + (healthSummary.unreachable || 0)
    const stats = [
        { label: "Short links", value: dashboardData?.linkCount },
        { label: "Total visits", value: dashboardData?.visits },
        { label: "Visits · 24 hours", value: dashboardData?.last24Hours },
        {
            label: "Need attention",
            value: dashboardData ? needsAttention : undefined,
            accent: needsAttention > 0
        }
    ]
    const shortcuts = [
        {
            index: "01",
            title: "Short links",
            description: "Create links, edit destinations, and explore click analytics.",
            href: route("links"),
            action: "Manage links"
        },
        {
            index: "02",
            title: "Tags",
            description: "Group links into campaigns and keep your workspace organized.",
            href: route("tags"),
            action: "Organize links"
        },
        {
            index: "03",
            title: "QR branding",
            description: "Add your logo to branded QR codes for your short links.",
            href: route("branding"),
            action: "Manage branding"
        },
        {
            index: "04",
            title: "API access",
            description: "Connect your tools and create short links programmatically.",
            href: route("documentation.api"),
            action: "Explore the API"
        }
    ]

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <SectionLabel>Your workspace</SectionLabel>
                        <h2 className="mt-1 font-editorial text-3xl text-ink">Dashboard</h2>
                    </div>
                    <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:block">
                        301p.ing / overview
                    </span>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="bg-paper font-grotesk text-ink">
                <section className="border-b border-line" aria-labelledby="dashboard-heading">
                    <div className="mx-auto max-w-grid px-6 pb-12 pt-12 md:px-10 md:pb-16 md:pt-16 lg:px-16">
                        <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-10">
                            <div className="lg:col-span-7">
                                <SectionLabel>Good to see you, {auth.user?.name}</SectionLabel>
                                <h1
                                    id="dashboard-heading"
                                    className="mt-5 max-w-3xl font-editorial text-5xl leading-[0.98] text-ink sm:text-6xl lg:text-7xl"
                                >
                                    Every link.
                                    <br />
                                    <span className="text-accent-dark">One clear view.</span>
                                </h1>
                            </div>
                            <div className="lg:col-span-5 lg:border-l lg:border-line lg:pl-8">
                                <p className="max-w-md text-base leading-relaxed text-muted">
                                    Keep redirects healthy, understand what gets clicked, and get to the tools
                                    that keep your links moving.
                                </p>
                                <Link
                                    href={route("links")}
                                    className="mt-6 inline-flex items-center gap-3 border border-ink bg-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-paper hover:text-ink"
                                >
                                    Open link manager
                                    <span aria-hidden="true">↗</span>
                                </Link>
                            </div>
                        </div>

                        {dashboardError && (
                            <p
                                className="mt-8 border-l-2 border-accent bg-white px-4 py-3 text-sm text-accent-dark"
                                role="alert"
                            >
                                {dashboardError}
                            </p>
                        )}

                        <div className="mt-12 grid grid-cols-2 border-l border-t border-line sm:grid-cols-4">
                            {stats.map((stat) => (
                                <article
                                    key={stat.label}
                                    className="border-b border-r border-line bg-white/40 p-4 sm:p-5"
                                >
                                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted sm:text-[10px]">
                                        {stat.label}
                                    </p>
                                    <p
                                        className={`mt-3 font-mono text-3xl tabular-nums sm:text-4xl ${
                                            stat.accent ? "text-accent-dark" : "text-ink"
                                        }`}
                                    >
                                        {formatNumber(stat.value)}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-b border-line" aria-labelledby="recent-links-heading">
                    <div className="mx-auto grid max-w-grid gap-10 px-6 py-12 md:px-10 md:py-16 lg:grid-cols-12 lg:gap-12 lg:px-16">
                        <div className="lg:col-span-4">
                            <SectionLabel>01 / Link health &amp; activity</SectionLabel>
                            <h2
                                id="recent-links-heading"
                                className="mt-4 max-w-sm font-grotesk text-3xl font-extrabold leading-tight sm:text-4xl"
                            >
                                Recent redirects.
                            </h2>
                            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                                A quick read on your latest links. Open any link for its analytics, QR code,
                                tags, and editing controls.
                            </p>

                            <div className="mt-8 border-t border-line">
                                {["healthy", "unhealthy", "unreachable"].map((health) => (
                                    <div
                                        key={health}
                                        className="flex items-center justify-between border-b border-line py-3"
                                    >
                                        <span className="text-sm capitalize text-muted">{health}</span>
                                        <span className="font-mono text-sm tabular-nums">
                                            {dashboardData ? formatNumber(healthSummary[health] || 0) : "—"}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {needsAttention > 0 && (
                                <p className="mt-4 border-l-2 border-accent bg-accent/5 px-3 py-2 text-xs leading-relaxed text-accent-dark">
                                    {needsAttention}{" "}
                                    {needsAttention === 1 ? "redirect needs" : "redirects need"} a closer look.
                                </p>
                            )}
                        </div>

                        <div className="lg:col-span-8">
                            <div className="flex items-end justify-between gap-4 border-b border-ink pb-3">
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                                        Your latest
                                    </p>
                                    <p className="mt-1 text-sm font-semibold">Short links</p>
                                </div>
                                <Link
                                    href={route("links")}
                                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent-dark"
                                >
                                    View all
                                </Link>
                            </div>

                            {dashboardData?.recentLinks?.length ? (
                                <ul>
                                    {dashboardData.recentLinks.map((link) => (
                                        <li key={link.id} className="border-b border-line">
                                            <Link
                                                href={route("links.show", link.shot_slug)}
                                                className="group block py-5 transition-colors hover:bg-white/50 sm:px-3"
                                            >
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate font-mono text-sm font-semibold text-ink group-hover:text-accent-dark">
                                                            {link.shortened_url}
                                                        </p>
                                                        <p className="mt-1 truncate text-xs text-muted">
                                                            {link.url}
                                                        </p>
                                                    </div>
                                                    <HealthBadge health={link.health} />
                                                </div>
                                                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                                                            {formatNumber(link.visits)} visits
                                                        </span>
                                                        {link.tags?.length > 0 && (
                                                            <span className="flex flex-wrap gap-1.5">
                                                                {link.tags.map((tag) => (
                                                                    <span
                                                                        key={tag.slug}
                                                                        className="border border-line px-2 py-0.5 font-mono text-[9px] text-muted"
                                                                    >
                                                                        {tag.name}
                                                                    </span>
                                                                ))}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span
                                                        className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted"
                                                        title={new Date(link.created_at).toLocaleString()}
                                                    >
                                                        {new Date(link.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : dashboardData ? (
                                <div className="border-b border-line py-10 text-center">
                                    <p className="font-editorial text-2xl">Start with one good link.</p>
                                    <p className="mt-2 text-sm text-muted">
                                        Your newest short links and their activity will show up here.
                                    </p>
                                    <Link
                                        href={route("links")}
                                        className="mt-5 inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-accent-dark underline underline-offset-4"
                                    >
                                        Create your first short link
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-5 py-6" aria-label="Loading recent links">
                                    {[0, 1, 2].map((item) => (
                                        <div
                                            key={item}
                                            className="h-16 animate-pulse border-b border-line bg-white/40"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section aria-labelledby="workspace-tools-heading">
                    <div className="mx-auto max-w-grid px-6 py-12 md:px-10 md:py-16 lg:px-16">
                        <div className="flex flex-wrap items-end justify-between gap-6">
                            <div>
                                <SectionLabel>02 / Built for your workflow</SectionLabel>
                                <h2
                                    id="workspace-tools-heading"
                                    className="mt-4 font-grotesk text-3xl font-extrabold leading-tight sm:text-4xl"
                                >
                                    More than a short link.
                                </h2>
                            </div>
                            <Link
                                href={route("services.broken-destinations")}
                                className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent-dark"
                            >
                                How link monitoring works
                            </Link>
                        </div>

                        <div className="mt-8 grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
                            {shortcuts.map((shortcut) => (
                                <Link
                                    key={shortcut.index}
                                    href={shortcut.href}
                                    className="group flex min-h-52 flex-col border-b border-r border-line bg-white/30 p-5 transition-colors hover:bg-white sm:p-6"
                                >
                                    <span className="font-mono text-[10px] tracking-[0.16em] text-accent-dark">
                                        {shortcut.index} /
                                    </span>
                                    <h3 className="mt-7 font-grotesk text-lg font-bold text-ink">
                                        {shortcut.title}
                                    </h3>
                                    <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">
                                        {shortcut.description}
                                    </p>
                                    <span className="mt-5 flex items-center justify-between border-t border-line pt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-ink">
                                        {shortcut.action}
                                        <span
                                            className="transition-transform group-hover:translate-x-1"
                                            aria-hidden="true"
                                        >
                                            →
                                        </span>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    )
}

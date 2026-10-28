import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link } from "@inertiajs/react"
import { useEffect, useState } from "react"
import axios from "axios"
import ArrowIcon from "@/Components/Home/ArrowIcon"

const StatIcon = ({ type }) => {
    const paths = {
        links: "M9.5 14.5l5-5m-7.5-2h-2a4 4 0 000 8h2m6-6h2a4 4 0 010 8h-2",
        visits: "M2.5 12s3.2-5 9.5-5 9.5 5 9.5 5-3.2 5-9.5 5-9.5-5-9.5-5z M12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z",
        average: "M4 17l5-5 3 3 7-8 M15 7h4v4",
        activity: "M12 7v5l3 2"
    }

    return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path d={paths[type]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {type === "activity" && <circle cx="12" cy="12" r="9" strokeWidth="1.5" />}
        </svg>
    )
}

export default function Dashboard({ auth }) {
    const [dashboardData, setDashboardData] = useState(null)
    const [dashboardError, setDashboardError] = useState("")
    const [animateStats, setAnimateStats] = useState(false)

    useEffect(() => {
        setAnimateStats(true)

        let isMounted = true

        axios
            .get(route("service.dashboard"))
            .then(({ data }) => {
                if (isMounted) setDashboardData(data)
            })
            .catch(() => {
                if (isMounted) {
                    setDashboardError("Dashboard data could not be loaded. Please refresh the page.")
                }
            })

        return () => {
            isMounted = false
        }
    }, [])

    const linkCount = dashboardData?.linkCount
    const visits = dashboardData?.visits

    const stats = [
        { label: "Active links", value: linkCount ?? "--", suffix: "total", type: "links" },
        { label: "Total visits", value: visits ?? "--", suffix: "clicks", type: "visits" },
        {
            label: "Average reach",
            value:
                linkCount === undefined || visits === undefined
                    ? "--"
                    : linkCount > 0
                      ? Math.round((visits / linkCount) * 10) / 10
                      : 0,
            suffix: "per link",
            type: "average"
        },
        { label: "Last 24 hours", value: "--", suffix: "visits", type: "activity" }
    ]

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center border border-line bg-paper">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-ink"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 18h16M7 15V9m5 6V5m5 10v-8"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Workspace
                            </p>
                            <h2 className="font-editorial text-3xl text-ink">Dashboard</h2>
                        </div>
                    </div>

                    <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                        01 / Overview
                    </span>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="bg-paper font-grotesk text-ink">
                <section className="border-b border-line" aria-labelledby="dashboard-heading">
                    <div className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 pt-14 md:pt-20 pb-16 md:pb-24">
                        <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-8 md:mb-12">
                            <span>01 / Workspace</span>
                            <span className="hidden sm:inline">301p.ing / dashboard</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 items-end">
                            <div className="lg:col-span-7">
                                <p className="font-mono text-xs text-accent mb-5">
                                    Good to see you, {auth.user?.name}
                                </p>
                                <h1
                                    id="dashboard-heading"
                                    className="font-editorial text-6xl sm:text-7xl lg:text-8xl leading-[0.98]"
                                >
                                    Make sense
                                    <br />
                                    of your links.
                                </h1>
                            </div>
                            <div className="lg:col-span-5 lg:pl-6 lg:border-l lg:border-line">
                                <p className="text-lg text-muted max-w-md leading-relaxed">
                                    A focused view of your short links, their reach, and the tools you use to
                                    build with 301 ping.
                                </p>
                                <Link
                                    href={route("links")}
                                    className="group inline-flex items-center gap-3 mt-7 font-mono text-xs uppercase tracking-[0.12em] text-ink hover:text-accent-dark transition-colors"
                                >
                                    Manage links <ArrowIcon />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-line" aria-labelledby="analytics-heading">
                    <div className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 py-16 md:py-24">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10">
                            <div className="lg:col-span-4">
                                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-6">
                                    02 / Signals
                                </p>
                                <h2
                                    id="analytics-heading"
                                    className="font-grotesk font-extrabold text-4xl sm:text-5xl leading-[1.02] max-w-sm"
                                >
                                    The useful numbers.
                                </h2>
                            </div>

                            <div className="lg:col-span-8 border-t border-line">
                                {dashboardError && (
                                    <p
                                        className="border-b border-line py-4 text-sm text-accent-dark"
                                        role="alert"
                                    >
                                        {dashboardError}
                                    </p>
                                )}
                                {stats.map((stat, index) => (
                                    <div
                                        key={stat.label}
                                        className={`grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6 py-5 border-b border-line transition-all duration-500 ${
                                            animateStats
                                                ? "translate-y-0 opacity-100"
                                                : "translate-y-3 opacity-0"
                                        }`}
                                        style={{ transitionDelay: `${index * 80}ms` }}
                                    >
                                        <span className={index === 0 ? "text-accent" : "text-muted"}>
                                            <StatIcon type={stat.type} />
                                        </span>
                                        <p className="font-grotesk font-semibold text-base">{stat.label}</p>
                                        <div className="flex items-baseline gap-2 text-right">
                                            <span className="font-mono text-2xl sm:text-3xl tabular-nums">
                                                {stat.value}
                                            </span>
                                            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                                {stat.suffix}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    )
}

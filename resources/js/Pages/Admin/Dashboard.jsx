import AdminLayout from "@/Layouts/AdminLayout"
import { Head, Link } from "@inertiajs/react"

const fmt = (v) => Number(v).toLocaleString()

function RedirectTrend({ daily }) {
    const maxTotal = Math.max(...daily.map((day) => day.total), 1)
    const points = daily.map((day, index) => {
        const x = 56 + (index * 924) / (daily.length - 1)
        const y = 166 - (day.total / maxTotal) * 148

        return { ...day, x, y }
    })
    const dateLabel = (date) =>
        new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })

    return (
        <section className="mt-12 border border-line bg-white/40 p-5 sm:p-6">
            <div className="flex items-baseline justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    Redirects · last 30 days
                </p>
                <p className="font-mono text-xs tabular-nums text-muted">
                    {fmt(daily.reduce((sum, day) => sum + day.total, 0))} total
                </p>
            </div>
            <div className="mt-5 overflow-x-auto">
                <svg
                    viewBox="0 0 1000 220"
                    role="img"
                    aria-label="Daily redirect counts over the last 30 days"
                    className="min-w-[640px] w-full"
                >
                    {[0, 0.5, 1].map((fraction) => {
                        const y = 166 - fraction * 148
                        const value = Math.round(maxTotal * fraction)

                        return (
                            <g key={fraction}>
                                <line x1="56" x2="980" y1={y} y2={y} stroke="#e5e2dc" strokeWidth="1" />
                                <text
                                    x="44"
                                    y={y + 4}
                                    textAnchor="end"
                                    className="fill-muted font-mono text-[10px]"
                                >
                                    {value}
                                </text>
                            </g>
                        )
                    })}
                    <polyline
                        points={points.map(({ x, y }) => `${x},${y}`).join(" ")}
                        fill="none"
                        stroke="#111111"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                    {points.map((day) => (
                        <circle key={day.date} cx={day.x} cy={day.y} r="4" fill="#111111">
                            <title>{`${dateLabel(day.date)}: ${fmt(day.total)} redirects`}</title>
                        </circle>
                    ))}
                    {points
                        .filter((_, index) => index % 7 === 0 || index === points.length - 1)
                        .map((day) => (
                            <text
                                key={day.date}
                                x={day.x}
                                y="198"
                                textAnchor={day === points[points.length - 1] ? "end" : "middle"}
                                className="fill-muted font-mono text-[10px]"
                            >
                                {dateLabel(day.date)}
                            </text>
                        ))}
                </svg>
            </div>
        </section>
    )
}

export default function Dashboard({ auth, stats, redirectsDaily, recentUsers }) {
    const cards = [
        { label: "Users", value: stats.users },
        { label: "Verified users", value: stats.verifiedUsers },
        { label: "New · 7 days", value: stats.newUsers7Days },
        { label: "Short links", value: stats.links },
        { label: "Total visits", value: stats.visits }
    ]

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                        Administration
                    </p>
                    <h2 className="mt-1 font-editorial text-3xl text-ink">Dashboard</h2>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="px-6 py-10 md:px-10">
                <div className="grid grid-cols-2 border-l border-t border-line lg:grid-cols-5">
                    {cards.map((card) => (
                        <article
                            key={card.label}
                            className="border-b border-r border-line bg-white/40 p-4 sm:p-5"
                        >
                            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted sm:text-[10px]">
                                {card.label}
                            </p>
                            <p className="mt-3 font-mono text-3xl tabular-nums text-ink">{fmt(card.value)}</p>
                        </article>
                    ))}
                </div>

                <RedirectTrend daily={redirectsDaily} />

                <div className="mt-12">
                    <div className="flex items-center justify-between">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                            Recent sign-ups
                        </p>
                        <Link
                            href={route("admin.users")}
                            className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink hover:text-accent-dark"
                        >
                            All users ↗
                        </Link>
                    </div>
                    <div className="mt-4 border-t border-line">
                        {recentUsers.map((u) => (
                            <div
                                key={u.id}
                                className="flex items-center justify-between gap-4 border-b border-line py-3"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm text-ink">{u.name}</p>
                                    <p className="truncate text-sm text-muted">{u.email}</p>
                                </div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                    {new Date(u.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

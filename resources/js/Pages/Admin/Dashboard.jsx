import AdminLayout from "@/Layouts/AdminLayout"
import { Head, Link } from "@inertiajs/react"

const fmt = (v) => Number(v).toLocaleString()

export default function Dashboard({ auth, stats, recentUsers }) {
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
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Administration</p>
                    <h2 className="mt-1 font-editorial text-3xl text-ink">Dashboard</h2>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="px-6 py-10 md:px-10">
                <div className="grid grid-cols-2 border-l border-t border-line lg:grid-cols-5">
                    {cards.map((card) => (
                        <article key={card.label} className="border-b border-r border-line bg-white/40 p-4 sm:p-5">
                            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted sm:text-[10px]">
                                {card.label}
                            </p>
                            <p className="mt-3 font-mono text-3xl tabular-nums text-ink">{fmt(card.value)}</p>
                        </article>
                    ))}
                </div>

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

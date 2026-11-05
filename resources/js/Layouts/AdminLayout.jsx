import Header from "@/Components/Header"
import { Link } from "@inertiajs/react"

const navItems = [
    { key: "admin.dashboard", label: "Dashboard", index: "01" },
    { key: "admin.users", label: "Users", index: "02" }
]

export default function AdminLayout({ user, header, children }) {
    return (
        <div className="min-h-screen flex flex-col bg-paper">
            <Header isAuthenticated={true} user={user} />

            <div className="mx-auto flex w-full max-w-grid flex-1 flex-col md:flex-row">
                <aside className="border-b border-line bg-paper md:w-60 md:shrink-0 md:border-b-0 md:border-r">
                    <nav
                        aria-label="Admin navigation"
                        className="flex gap-1 overflow-x-auto px-6 py-4 md:sticky md:top-[72px] md:h-[calc(100vh-72px)] md:flex-col md:gap-0 md:overflow-visible md:px-0 md:py-8"
                    >
                        <p className="hidden px-6 pb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted md:block">
                            Workspace
                        </p>
                        {navItems.map((item) => {
                            const active = route().current(item.key)

                            return (
                                <Link
                                    key={item.key}
                                    href={route(item.key)}
                                    aria-current={active ? "page" : undefined}
                                    className={`flex items-center gap-3 whitespace-nowrap border-b-2 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:bg-white/40 md:border-b-0 md:border-l-2 md:px-6 ${
                                        active
                                            ? "border-accent bg-white/50 text-ink"
                                            : "border-transparent text-muted hover:text-ink"
                                    }`}
                                >
                                    <span className={active ? "text-accent-dark" : "text-muted"}>
                                        {item.index}
                                    </span>
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </aside>

                <div className="min-w-0 flex-1">
                    {header && (
                        <header className="bg-paper border-b border-line">
                            <div className="px-6 py-6 md:px-10">{header}</div>
                        </header>
                    )}
                    <main className="font-grotesk text-ink">{children}</main>
                </div>
            </div>
        </div>
    )
}

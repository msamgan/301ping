import AdminLayout from "@/Layouts/AdminLayout"
import { Link, router } from "@inertiajs/react"
import SeoHead from "@/Components/SeoHead"
import { useState } from "react"

const th = "px-4 py-3 text-left font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-muted"

export default function Users({ auth, users, search, adminIds }) {
    const [query, setQuery] = useState(search || "")

    const submit = (e) => {
        e.preventDefault()
        router.get(route("admin.users"), { search: query }, { preserveState: true, replace: true })
    }

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                            Administration
                        </p>
                        <h2 className="mt-1 font-editorial text-3xl text-ink">Users</h2>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                        {Number(users.total).toLocaleString()} total
                    </span>
                </div>
            }
        >
            <SeoHead
                title="Admin Users"
                description="Find and review 301 Ping user accounts from the administration area. Search the user list and access account information needed to manage platform support and operations."
                noindex
            />

            <div className="px-6 py-10 md:px-10">
                <form onSubmit={submit} className="flex max-w-md gap-2">
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search name or email"
                        className="w-full border border-line bg-white px-3 py-2 text-sm text-ink focus:border-ink focus:ring-0"
                    />
                    <button
                        type="submit"
                        className="border border-ink bg-ink px-5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-paper hover:text-ink"
                    >
                        Search
                    </button>
                </form>

                <div className="mt-8 overflow-x-auto border border-line bg-white/40">
                    <table className="min-w-full text-sm">
                        <thead className="border-b border-line">
                            <tr>
                                <th className={th}>ID</th>
                                <th className={th}>Name</th>
                                <th className={th}>Email</th>
                                <th className={th}>Verified</th>
                                <th className={th}>Links</th>
                                <th className={th}>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((u) => (
                                <tr key={u.id} className="border-b border-line last:border-b-0">
                                    <td className="px-4 py-3 font-mono text-xs tabular-nums text-muted">
                                        {u.id}
                                    </td>
                                    <td className="px-4 py-3 text-ink">
                                        {u.name}
                                        {adminIds.includes(u.id) && (
                                            <span className="ml-2 border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-accent-dark">
                                                Admin
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-muted">{u.email}</td>
                                    <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                        {u.email_verified_at ? "Yes" : "No"}
                                    </td>
                                    <td className="px-4 py-3 font-mono tabular-nums">{u.hyperlinks_count}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-muted">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {users.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {users.last_page > 1 && (
                    <div className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em]">
                        {users.prev_page_url ? (
                            <Link href={users.prev_page_url} className="text-ink hover:text-accent-dark">
                                ← Previous
                            </Link>
                        ) : (
                            <span />
                        )}
                        <span className="text-muted">
                            Page {users.current_page} / {users.last_page}
                        </span>
                        {users.next_page_url ? (
                            <Link href={users.next_page_url} className="text-ink hover:text-accent-dark">
                                Next →
                            </Link>
                        ) : (
                            <span />
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

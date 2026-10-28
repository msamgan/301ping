import { useState } from "react"
import { Head } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import SubscriptionManager from "@/Pages/Profile/Partials/SubscriptionManager"

export default function Billing({ auth, invoices = [] }) {
    const [activeTab, setActiveTab] = useState("subscription")
    const tabs = [
        { id: "subscription", label: "Subscription", meta: "01 / Plan" },
        { id: "invoices", label: "Invoices", meta: "02 / History" }
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
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Account
                            </p>
                            <h2 className="font-editorial text-3xl text-ink">Billing</h2>
                        </div>
                    </div>
                    <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                        01 / Payments
                    </span>
                </div>
            }
        >
            <Head title="Billing" />

            <main className="bg-paper font-grotesk text-ink">
                <div className="mx-auto max-w-grid px-6 py-8 md:px-10 md:py-12 lg:px-16">
                    <div className="mb-8 flex items-baseline justify-between border-b border-line pb-5">
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                            02 / Payments & invoices
                        </p>
                        <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                            301p.ing
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                        <aside className="lg:col-span-4">
                            <div className="border border-line bg-paper p-3 md:p-4">
                                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                    Navigation
                                </p>
                                <div className="space-y-2" role="tablist" aria-label="Billing sections">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            id={`${tab.id}-tab`}
                                            type="button"
                                            role="tab"
                                            aria-selected={activeTab === tab.id}
                                            aria-controls={`${tab.id}-panel`}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex w-full items-center justify-between border px-3 py-3 text-left transition-colors duration-200 ${
                                                activeTab === tab.id
                                                    ? "border-ink bg-ink text-paper"
                                                    : "border-line bg-paper text-ink hover:border-ink/70 hover:bg-ink/5"
                                            }`}
                                        >
                                            <span className="font-grotesk text-sm font-semibold uppercase tracking-[0.08em]">
                                                {tab.label}
                                            </span>
                                            <span className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-80">
                                                {tab.meta}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        <div className="lg:col-span-8">
                            {activeTab === "subscription" ? (
                                <section
                                    id="subscription-panel"
                                    role="tabpanel"
                                    aria-labelledby="subscription-tab"
                                    className="border border-line bg-paper p-6"
                                >
                                    <SubscriptionManager user={auth.user} className="max-w-3xl" />
                                </section>
                            ) : (
                                <section
                                    id="invoices-panel"
                                    role="tabpanel"
                                    aria-labelledby="invoices-tab"
                                    className="border border-line bg-paper p-6"
                                >
                                    <div className="mb-6">
                                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                            Payment history
                                        </p>
                                        <h3 className="mt-2 font-editorial text-3xl text-ink">Invoices</h3>
                                    </div>

                                    {invoices.length > 0 ? (
                                        <div className="overflow-x-auto border border-line">
                                            <table className="w-full min-w-[640px] text-left text-sm">
                                                <thead className="border-b border-line bg-ink/5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                                                    <tr>
                                                        <th className="px-4 py-3 font-normal">Invoice</th>
                                                        <th className="px-4 py-3 font-normal">Date</th>
                                                        <th className="px-4 py-3 font-normal">Status</th>
                                                        <th className="px-4 py-3 text-right font-normal">
                                                            Total
                                                        </th>
                                                        <th className="px-4 py-3 text-right font-normal">
                                                            &nbsp;
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-line">
                                                    {invoices.map((invoice) => (
                                                        <tr key={invoice.id}>
                                                            <td className="px-4 py-4 font-semibold text-ink">
                                                                {invoice.number}
                                                            </td>
                                                            <td className="px-4 py-4 text-muted">
                                                                {invoice.date}
                                                            </td>
                                                            <td className="px-4 py-4 capitalize text-muted">
                                                                {invoice.status}
                                                            </td>
                                                            <td className="px-4 py-4 text-right text-ink">
                                                                {invoice.total}
                                                            </td>
                                                            <td className="px-4 py-4 text-right">
                                                                <a
                                                                    href={route(
                                                                        "billing.invoices.download",
                                                                        invoice.id
                                                                    )}
                                                                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent hover:text-accent-dark"
                                                                >
                                                                    Download
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="border border-line p-6 text-sm text-muted">
                                            You don&apos;t have any invoices yet.
                                        </p>
                                    )}
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    )
}

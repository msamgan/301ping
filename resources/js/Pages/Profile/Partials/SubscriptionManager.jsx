import { useState, useEffect } from "react"
import { Link } from "@inertiajs/react"
import axios from "axios"
import Modal from "@/Components/Modal"
import SecondaryButton from "@/Components/SecondaryButton"
import { useToast } from "@/Components/ToastProvider"

export default function SubscriptionManager({ user, className = "" }) {
    const [subscription, setSubscription] = useState(user?.subscription || null)
    const [loading, setLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState(null)
    const [confirmingCancellation, setConfirmingCancellation] = useState(false)
    const showToast = useToast()

    const fetchStatus = () => {
        setLoading(true)
        axios
            .get(route("subscription.status"))
            .then(({ data }) => {
                setSubscription(data.subscription)
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchStatus()
    }, [])

    const handleUpdatePaymentMethod = () => {
        setActionLoading("payment-method")
        axios
            .get(route("subscription.payment-method"))
            .then(({ data }) => {
                if (data.url) {
                    window.location.href = data.url
                } else {
                    showToast("Payment method update URL not available.", "error")
                }
            })
            .catch((err) => {
                showToast(err.response?.data?.message || "Failed to load payment method update.", "error")
            })
            .finally(() => setActionLoading(null))
    }

    const handleCancel = () => {
        setConfirmingCancellation(true)
    }

    const confirmCancel = () => {
        setConfirmingCancellation(false)
        setActionLoading("cancel")
        axios
            .post(route("subscription.cancel"))
            .then(({ data }) => {
                setSubscription(data.subscription)
                showToast(data.message || "Subscription canceled.", "success")
            })
            .catch((err) => {
                showToast(err.response?.data?.message || "Failed to cancel subscription.", "error")
            })
            .finally(() => setActionLoading(null))
    }

    const handleResume = () => {
        setActionLoading("resume")
        axios
            .post(route("subscription.resume"))
            .then(({ data }) => {
                setSubscription(data.subscription)
                showToast(data.message || "Subscription resumed successfully.", "success")
            })
            .catch((err) => {
                showToast(err.response?.data?.message || "Failed to resume subscription.", "error")
            })
            .finally(() => setActionLoading(null))
    }

    const isSubscribed = subscription?.is_subscribed

    return (
        <section className={className}>
            <header className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-line bg-paper">
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
                <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Billing
                            </p>
                            <h2 className="mt-2 font-editorial text-3xl text-ink">Subscription & Billing</h2>
                        </div>
                        {isSubscribed && (
                            <span
                                className={`inline-flex items-center border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] ${
                                    subscription?.on_grace_period
                                        ? "border-amber-400 bg-amber-50 text-amber-800"
                                        : subscription?.status === "active"
                                          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                                          : "border-line bg-ink/5 text-ink"
                                }`}
                            >
                                {subscription?.on_grace_period
                                    ? "Cancels Soon"
                                    : subscription?.status || "Active"}
                            </span>
                        )}
                    </div>
                    <p className="mt-2 max-w-lg text-sm text-muted">
                        Manage your subscription tier, billing interval, and payment details.
                    </p>
                </div>
            </header>

            <div className="space-y-6">
                <div className="border border-line bg-paper p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                                Current Plan
                            </span>
                            <p className="mt-1 font-editorial text-3xl text-ink">
                                {subscription?.plan_name || (isSubscribed ? "Active Plan" : "Free Plan")}
                            </p>
                            <p className="mt-2 max-w-md text-sm text-muted">
                                {isSubscribed
                                    ? subscription?.on_grace_period
                                        ? `Your subscription will end on ${subscription.ends_at}.`
                                        : subscription?.interval
                                          ? `Billed ${subscription.interval}. Renews automatically.`
                                          : "Active Paddle subscription."
                                    : "You are on the free plan with basic URL redirection and analytics."}
                            </p>
                        </div>
                        <div>
                            <Link
                                href={route("pricing")}
                                className="inline-flex items-center justify-center border border-ink bg-ink px-5 py-3 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:border-accent hover:bg-accent hover:text-paper"
                            >
                                {isSubscribed ? "Change Plan" : "Upgrade Plan"}
                            </Link>
                        </div>
                    </div>
                </div>

                {isSubscribed && (
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleUpdatePaymentMethod}
                            disabled={actionLoading === "payment-method"}
                            className="inline-flex items-center justify-center border border-line bg-paper px-5 py-3 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {actionLoading === "payment-method" ? "Loading..." : "Update Payment Method"}
                        </button>

                        {subscription?.on_grace_period ? (
                            <button
                                type="button"
                                onClick={handleResume}
                                disabled={actionLoading === "resume"}
                                className="inline-flex items-center justify-center border border-green-800 bg-green-800 px-5 py-3 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-green-900 hover:border-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {actionLoading === "resume" ? "Resuming..." : "Resume Subscription"}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={actionLoading === "cancel"}
                                className="inline-flex items-center justify-center border border-accent bg-transparent px-5 py-3 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-accent transition-colors hover:bg-accent hover:text-paper disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {actionLoading === "cancel" ? "Canceling..." : "Cancel Subscription"}
                            </button>
                        )}
                    </div>
                )}
            </div>

            <Modal show={confirmingCancellation} onClose={() => setConfirmingCancellation(false)} maxWidth="md">
                <div className="border-t-4 border-accent bg-paper p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                        Confirm cancellation
                    </p>
                    <h3 className="mt-2 font-editorial text-2xl text-ink">Cancel subscription?</h3>
                    <p className="mb-6 mt-3 font-grotesk text-sm text-muted">
                        Are you sure you want to cancel your subscription? You will retain access until the end
                        of your current billing period.
                    </p>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingCancellation(false)}>
                            Keep Subscription
                        </SecondaryButton>
                        <button
                            type="button"
                            onClick={confirmCancel}
                            className="inline-flex items-center justify-center border border-accent bg-accent px-5 py-3 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:border-accent-dark hover:bg-accent-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel Subscription
                        </button>
                    </div>
                </div>
            </Modal>
        </section>
    )
}

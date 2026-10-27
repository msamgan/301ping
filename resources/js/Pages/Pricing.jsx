import { useState, useEffect } from "react"
import { Head, usePage } from "@inertiajs/react"
import axios from "axios"
import Header from "@/Components/Header.jsx"
import Footer from "@/Components/Footer.jsx"
import Reveal from "@/Components/Home/Reveal"
import { useToast } from "@/Components/ToastProvider"

const buildPlans = (plansData = {}) => [
    {
        name: "Free",
        tier: "Free",
        price: { monthly: "$0", annual: "$0" },
        cta: "Get started",
        href: "register"
    },
    {
        name: "Redirect",
        tier: "Redirect",
        price: { monthly: "$5", annual: "$50" },
        priceIds: {
            monthly: plansData?.redirect_monthly?.price_id || plansData?.redirect_monthly || "",
            annual: plansData?.redirect_annual?.price_id || plansData?.redirect_annual || ""
        },
        cta: "Choose Redirect",
        href: "register"
    },
    {
        name: "Redirect Plus",
        tier: "Redirect Plus",
        price: { monthly: "$10", annual: "$100" },
        priceIds: {
            monthly: plansData?.redirect_plus_monthly?.price_id || plansData?.redirect_plus_monthly || "",
            annual: plansData?.redirect_plus_annual?.price_id || plansData?.redirect_plus_annual || ""
        },
        cta: "Choose Plus",
        href: "register",
        highlight: true
    },
    {
        name: "Talk to us",
        tier: "Enterprise",
        price: null,
        cta: "Contact us",
        href: "mailto:support@ms0.io"
    }
]

// One value per plan, in the same order as `plans`. true/false render as a check/dash.
const features = [
    { label: "Custom links", values: ["3", "Unlimited", "Unlimited", "Tailored"] },
    { label: "Edit destination", values: ["1", "Unlimited", "Unlimited", "Tailored"] },
    { label: "Analytics", values: ["Visits only", "Detailed", "Detailed", "Tailored"] },
    { label: "Short links per day (API & extension)", values: ["40", "100", "300", "Tailored"] },
    { label: "Custom logo in QR code", values: [false, "1", "Unlimited", true] },
    { label: "Monitor broken destinations", values: [false, "Twice a day", "Every 2 hours", "Tailored"] },
    { label: "Custom domain", values: [false, false, true, true] },
    { label: "Dedicated support", values: [false, false, true, true] }
]

function Cell({ value }) {
    if (value === true) {
        return (
            <span className="text-accent-dark" aria-label="Included">
                ✓
            </span>
        )
    }
    if (value === false) {
        return (
            <span className="text-muted" aria-label="Not included">
                —
            </span>
        )
    }
    return <span className="font-semibold">{value}</span>
}

export default function Pricing({ plans: serverPlans = null }) {
    const pageProps = usePage().props
    const user = pageProps.auth?.user
    const [annual, setAnnual] = useState(false)
    const [loadingPlan, setLoadingPlan] = useState(null)
    const [plansData, setPlansData] = useState(serverPlans || pageProps.plans || null)
    const showToast = useToast()

    useEffect(() => {
        if (!plansData) {
            axios
                .get(route("service.plans"))
                .then(({ data }) => {
                    if (data?.plans) {
                        setPlansData(data.plans)
                    }
                })
                .catch(() => {})
        }
    }, [plansData])

    const plans = buildPlans(plansData)

    const handlePlanAction = (e, plan) => {
        if (!plan.priceIds) {
            return
        }

        if (!user) {
            return
        }

        e.preventDefault()

        const priceId = annual ? plan.priceIds.annual : plan.priceIds.monthly
        if (!priceId) {
            showToast("Plan configuration is not available.", "error")
            return
        }

        const isCurrentPlan = user?.subscription?.price_id === priceId

        if (isCurrentPlan) {
            showToast("You are already subscribed to this plan.")
            return
        }

        setLoadingPlan(plan.name)

        axios
            .post(route("subscription.checkout"), { price_id: priceId })
            .then(({ data }) => {
                setLoadingPlan(null)
                if (data.checkout) {
                    if (window.Paddle?.Checkout) {
                        // Cashier defaults to inline mode (needs a frame container); force the overlay.
                        window.Paddle.Checkout.open({
                            ...data.checkout,
                            settings: {
                                ...data.checkout.settings,
                                displayMode: "overlay",
                                variant: "one-page"
                            }
                        })
                    } else if (data.checkout.url) {
                        window.location.href = data.checkout.url
                    }
                }
            })
            .catch((err) => {
                setLoadingPlan(null)
                const message =
                    err.response?.data?.message || "Failed to initialize checkout. Please try again."
                showToast(message, "error")
            })
    }

    const getPlanCtaLabel = (plan) => {
        if (loadingPlan === plan.name) {
            return "Loading..."
        }

        if (plan.name === "Free") {
            if (!user) return plan.cta
            return !user?.subscription?.is_subscribed ? "Current Plan" : "Free Tier"
        }

        if (plan.priceIds && user) {
            const currentPriceId = annual ? plan.priceIds.annual : plan.priceIds.monthly
            if (currentPriceId && user?.subscription?.price_id === currentPriceId) {
                return "Current Plan"
            }
            if (user?.subscription?.is_subscribed) {
                return `Switch to ${plan.name}`
            }
        }

        return plan.cta
    }

    const getPlanHref = (plan) => {
        if (plan.href.startsWith("mailto:")) {
            return plan.href
        }
        if (user && plan.name === "Free") {
            return route("dashboard")
        }
        return route(plan.href)
    }

    return (
        <>
            <Head title="Pricing" />
            <Header isAuthenticated={!!user} user={user} />

            <main className="bg-paper font-grotesk text-ink">
                <section className="border-b border-line" aria-labelledby="pricing-heading">
                    <div className="mx-auto max-w-grid px-6 pb-12 pt-16 md:px-10 md:pt-20 lg:px-16">
                        <Reveal className="mb-8 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:mb-12">
                            <span>01 / Pricing</span>
                            <span className="hidden sm:inline">301 ping / Plans</span>
                        </Reveal>
                        <Reveal
                            as="h1"
                            id="pricing-heading"
                            className="font-editorial text-6xl leading-[1.05] sm:text-7xl lg:text-8xl"
                        >
                            Simple pricing.
                        </Reveal>
                        <Reveal delay={80} className="mt-6 max-w-md text-lg text-muted">
                            Start free. Upgrade when your links need more.
                        </Reveal>

                        <div className="mt-8 inline-flex border border-line font-mono text-[11px] uppercase tracking-[0.16em]">
                            {[
                                ["Monthly", false],
                                ["Annual", true]
                            ].map(([label, value]) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => setAnnual(value)}
                                    aria-pressed={annual === value}
                                    className={`px-5 py-2 transition-colors ${
                                        annual === value
                                            ? "bg-ink text-paper"
                                            : "text-ink hover:text-accent-dark"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-b border-line" aria-label="Plan comparison">
                    <div className="mx-auto max-w-grid px-6 py-12 md:px-10 lg:px-16">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
                                <caption className="sr-only">Comparison of 301 ping plans</caption>
                                <colgroup>
                                    <col className="w-[24%]" />
                                    <col className="w-[19%]" />
                                    <col className="w-[19%]" />
                                    <col className="w-[19%]" />
                                    <col className="w-[19%]" />
                                </colgroup>
                                <thead>
                                    <tr className="align-bottom">
                                        <th scope="col" className="border-b border-ink p-4 pb-6">
                                            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                                                Compare plans
                                            </span>
                                        </th>
                                        {plans.map((plan) => {
                                            const currentPriceId = plan.priceIds
                                                ? annual
                                                    ? plan.priceIds.annual
                                                    : plan.priceIds.monthly
                                                : null
                                            const isCurrent = Boolean(
                                                currentPriceId &&
                                                user?.subscription?.price_id === currentPriceId
                                            )

                                            return (
                                                <th
                                                    key={plan.name}
                                                    scope="col"
                                                    className={`border-b border-ink p-4 pb-6 ${
                                                        plan.highlight ? "bg-ink/5" : ""
                                                    }`}
                                                >
                                                    <div className="text-xl font-extrabold">{plan.name}</div>
                                                    <div className="mt-3 min-h-[3rem]">
                                                        {plan.price ? (
                                                            <>
                                                                <span className="font-editorial text-4xl">
                                                                    {annual
                                                                        ? plan.price.annual
                                                                        : plan.price.monthly}
                                                                </span>
                                                                <span className="ml-1 font-mono text-[10px] font-normal uppercase tracking-[0.16em] text-muted">
                                                                    {annual ? "/ yr" : "/ mo"}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="font-editorial text-3xl">
                                                                Custom
                                                            </span>
                                                        )}
                                                    </div>
                                                    <a
                                                        href={getPlanHref(plan)}
                                                        onClick={(e) => handlePlanAction(e, plan)}
                                                        className={`mt-4 block border px-3 py-2 text-center font-mono text-[10px] font-normal uppercase tracking-[0.16em] transition-colors ${
                                                            isCurrent
                                                                ? "border-accent-dark bg-accent-dark/10 text-accent-dark font-semibold"
                                                                : plan.highlight
                                                                  ? "border-ink bg-ink text-paper hover:bg-accent-dark hover:border-accent-dark"
                                                                  : "border-line text-ink hover:text-accent-dark hover:border-accent-dark"
                                                        }`}
                                                    >
                                                        {getPlanCtaLabel(plan)}
                                                    </a>
                                                </th>
                                            )
                                        })}
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {features.map((feature) => (
                                        <tr key={feature.label} className="border-b border-line">
                                            <th scope="row" className="p-4 font-semibold">
                                                {feature.label}
                                            </th>
                                            {feature.values.map((value, index) => (
                                                <td
                                                    key={plans[index].name}
                                                    className={`p-4 ${plans[index].highlight ? "bg-ink/5" : ""}`}
                                                >
                                                    <Cell value={value} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-6 inline-flex items-center gap-3 border border-accent-dark bg-accent-dark/10 px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent-dark">
                            <span aria-hidden="true">★</span>
                            Annual billing: two months free
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    )
}

import { Link, usePage } from "@inertiajs/react"
import Footer from "@/Components/Footer"
import Header from "@/Components/Header"
import SeoHead from "@/Components/SeoHead"

const comparisons = {
    Bitly: {
        title: "301 Ping vs Bitly",
        description:
            "Compare 301 Ping and Bitly on published plan details, link limits, and analytics to find the better fit for your work.",
        summary:
            "Bitly is a broader marketing and brand-management platform. 301 Ping is for people who want short links, tags, QR codes, straightforward visit information, browser extensions, and an API in one focused workflow.",
        pricingUrl: "https://bitly.com/pages/pricing/",
        rows: [
            [
                "Pricing",
                "Free; paid plans from $5/month, with all public tier prices shown.",
                "Plan prices and limits vary; check Bitly's current pricing page."
            ],
            [
                "Link limits",
                "40, 100, or 300 API and extension links per day by plan.",
                "Allowances depend on the current plan."
            ],
            [
                "Analytics",
                "Visit counts and recent activity; detailed analytics on paid plans.",
                "Broader link and campaign analytics, depending on plan."
            ]
        ]
    },
    TinyURL: {
        title: "301 Ping vs TinyURL",
        description:
            "Compare 301 Ping and TinyURL on pricing transparency, link limits, and analytics before choosing a short-link tool.",
        summary:
            "TinyURL is a familiar option for straightforward shortening. 301 Ping adds a link library with tags and search, QR codes, visit information, browser extensions, and API access for people who need more ways to manage links.",
        pricingUrl: "https://tinyurl.com/app/pricing",
        rows: [
            [
                "Pricing",
                "Free; paid plans from $5/month, with all public tier prices shown.",
                "Free and paid plans; check TinyURL's current pricing page for prices and limits."
            ],
            [
                "Link limits",
                "40, 100, or 300 API and extension links per day by plan.",
                "Limits and features depend on the current plan."
            ],
            [
                "Analytics",
                "Visit counts and recent activity; detailed analytics on paid plans.",
                "Analytics availability depends on the current plan."
            ]
        ]
    }
}

export default function ComparisonPage({ competitor }) {
    const { props } = usePage()
    const user = props.auth?.user
    const comparison = comparisons[competitor]
    const faqs = props.seo?.faqs || []

    return (
        <>
            <SeoHead title={`${comparison.title} | 301 Ping`} description={comparison.description} />
            <Header isAuthenticated={!!user} user={user} />
            <main className="bg-paper font-grotesk text-ink">
                <section className="border-b border-line" aria-labelledby="comparison-heading">
                    <div className="mx-auto max-w-grid px-6 pb-12 pt-16 md:px-10 md:pt-20 lg:px-16">
                        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                            301 Ping / Tool comparison
                        </p>
                        <h1
                            id="comparison-heading"
                            className="max-w-4xl font-editorial text-6xl leading-[1.05] sm:text-7xl lg:text-8xl"
                        >
                            {comparison.title}
                        </h1>
                        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
                            {comparison.summary}
                        </p>
                        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
                            Features, prices, and limits can change. Check each provider&apos;s current plan
                            details before making a decision.
                        </p>
                    </div>
                </section>

                <section className="border-b border-line" aria-label="Feature comparison">
                    <div className="mx-auto max-w-grid px-6 py-12 md:px-10 lg:px-16">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                                <caption className="sr-only">
                                    Comparison of 301 Ping and {competitor} plans
                                </caption>
                                <thead>
                                    <tr className="border-b border-ink">
                                        <th scope="col" className="p-4">
                                            Compare
                                        </th>
                                        <th scope="col" className="p-4">
                                            301 Ping
                                        </th>
                                        <th scope="col" className="p-4">
                                            {competitor}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparison.rows.map(([label, own, other]) => (
                                        <tr key={label} className="border-b border-line align-top">
                                            <th scope="row" className="p-4 font-semibold">
                                                {label}
                                            </th>
                                            <td className="p-4 leading-relaxed">{own}</td>
                                            <td className="p-4 leading-relaxed">{other}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-5 text-sm text-muted">
                            Check {competitor}&apos;s current plans at{" "}
                            <a
                                href={comparison.pricingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-accent-dark underline underline-offset-4"
                            >
                                {competitor} pricing
                            </a>
                            . See{" "}
                            <Link
                                href={route("pricing")}
                                className="font-semibold underline underline-offset-4"
                            >
                                301 Ping pricing
                            </Link>
                            .
                        </p>
                    </div>
                </section>

                <section className="border-b border-line" aria-labelledby="comparison-faq-heading">
                    <div className="mx-auto max-w-grid px-6 py-12 md:px-10 lg:px-16">
                        <h2 id="comparison-faq-heading" className="font-editorial text-4xl sm:text-5xl">
                            Questions to help you choose.
                        </h2>
                        <div className="mt-8">
                            {faqs.map((faq) => (
                                <details key={faq.question} className="border-t border-line py-5">
                                    <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                                        {faq.answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                        <Link
                            href={route("home")}
                            className="mt-8 inline-flex border border-ink bg-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-paper hover:border-accent-dark hover:bg-accent-dark"
                        >
                            Shorten a link
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

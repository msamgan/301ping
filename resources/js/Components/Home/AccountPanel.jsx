import { Link } from "@inertiajs/react"
import Reveal from "@/Components/Home/Reveal"
import ArrowIcon from "@/Components/Home/ArrowIcon"

const AUTH_BENEFITS = [
    {
        title: "Track your links",
        body: "Monitor usage statistics and performance of your shortened URLs with our analytics dashboard."
    },
    {
        title: "API access",
        body: "Integrate our URL shortening service directly into your applications with our developer-friendly API."
    },
    {
        title: "Link management",
        body: "Organize, search, and manage all your shortened links from one convenient dashboard."
    }
]

const GUEST_BENEFITS = [
    {
        title: "API access",
        body: "Get exclusive access to our API for integrating URL shortening into your applications and services."
    },
    {
        title: "Link analytics",
        body: "Track click counts, usage patterns, and performance metrics for all your shortened URLs."
    },
    {
        title: "Link management",
        body: "Organize, search, and manage all your shortened links from one convenient dashboard."
    }
]

export default function AccountPanel({ isAuthenticated, user }) {
    const benefits = isAuthenticated ? AUTH_BENEFITS : GUEST_BENEFITS

    return (
        <section className="bg-ink text-paper" aria-labelledby="account-heading">
            <div className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 py-20 md:py-28">
                <Reveal className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50 mb-8">
                    06 / Account
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-14">
                    <div className="lg:col-span-5">
                        <Reveal
                            as="h2"
                            id="account-heading"
                            className="font-editorial text-paper text-5xl sm:text-6xl leading-[1.05] mb-8"
                        >
                            {isAuthenticated ? (
                                <>
                                    Welcome back,
                                    <br />
                                    {user?.name?.split(" ")[0] ?? user?.name}.
                                </>
                            ) : (
                                <>
                                    Make the
                                    <br />
                                    long, short.
                                </>
                            )}
                        </Reveal>

                        <Reveal delay={80}>
                            {isAuthenticated ? (
                                <Link
                                    href={route("dashboard")}
                                    className="group inline-flex items-center gap-3 border border-paper/30 px-6 py-3 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-paper hover:bg-paper hover:text-ink transition-colors"
                                >
                                    Go to dashboard
                                    <ArrowIcon />
                                </Link>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href={route("register")}
                                        className="group inline-flex items-center justify-center gap-3 bg-paper px-6 py-3 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-ink hover:bg-accent hover:text-paper transition-colors"
                                    >
                                        Create free account
                                        <ArrowIcon />
                                    </Link>
                                    <Link
                                        href={route("login")}
                                        className="group inline-flex items-center justify-center gap-3 border border-paper/30 px-6 py-3 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-paper hover:border-paper transition-colors"
                                    >
                                        Sign in
                                        <ArrowIcon />
                                    </Link>
                                </div>
                            )}
                        </Reveal>
                    </div>

                    <div className="lg:col-span-7">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 border-t border-paper/20">
                            {benefits.map((benefit, index) => (
                                <Reveal
                                    as="li"
                                    key={benefit.title}
                                    delay={index * 60}
                                    className="py-6 sm:pr-8 border-b border-paper/20 odd:sm:border-r odd:sm:border-paper/20"
                                >
                                    <span className="block font-mono text-xs text-paper/50 mb-2">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <h3 className="font-grotesk font-bold text-paper text-base mb-2">
                                        {benefit.title}
                                    </h3>
                                    <p className="font-grotesk text-sm text-paper/70 leading-relaxed">
                                        {benefit.body}
                                    </p>
                                </Reveal>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

import { Head, Link, usePage } from "@inertiajs/react"
import Footer from "@/Components/Footer"
import Header from "@/Components/Header"

export default function Guest({
    children,
    title = "Welcome back",
    description = "Sign in to access your account and manage your shortened URLs"
}) {
    const { auth } = usePage().props

    return (
        <div className="min-h-screen flex flex-col bg-paper">
            <Head>
                <meta name="robots" content="noindex,follow" head-key="robots" />
            </Head>
            <Header isAuthenticated={!!auth.user} user={auth.user} />
            <main className="flex-grow border-b border-line">
                <div className="mx-auto grid min-h-[calc(100dvh-136px)] max-w-grid grid-cols-1 gap-x-16 px-6 py-14 md:px-10 md:py-20 lg:grid-cols-12 lg:px-16 lg:py-24">
                    <div className="flex flex-col justify-between border-b border-line pb-12 lg:col-span-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-16">
                        <div>
                            <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                {route().current("register") ? "04 / Account" : "04 / Sign in"}
                            </p>
                            <h1 className="max-w-md font-editorial text-5xl leading-[1.05] text-ink sm:text-6xl">
                                {title}
                            </h1>
                            <p className="mt-6 max-w-sm font-grotesk text-base leading-relaxed text-muted">
                                {description}
                            </p>
                        </div>
                        <Link
                            href={route("home")}
                            className="mt-12 inline-flex w-fit items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent-dark"
                        >
                            <span aria-hidden="true">←</span> Back to 301p.ing
                        </Link>
                    </div>

                    <div className="flex items-start lg:col-span-7 lg:pl-4">
                        <div className="w-full max-w-xl pt-12 lg:pt-0">{children}</div>
                    </div>

                    {route().current("login") && (
                        <div className="lg:col-span-7 lg:col-start-6">
                            <p className="mt-10 border-t border-line pt-5 font-grotesk text-sm text-muted lg:ml-4">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href={route("register")}
                                    className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent-dark"
                                >
                                    Create one
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

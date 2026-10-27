export default function Footer() {
    return (
        <footer className="bg-paper border-t border-line">
            <div className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 py-16 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-12 pb-12 border-b border-line">
                    <div className="lg:col-span-3">
                        <a href={route("home")} aria-label="301 Ping home" className="inline-flex mb-6">
                            <img src="/301ping.svg" alt="301 Ping" className="h-8 w-auto" />
                        </a>
                        <p className="font-editorial text-ink text-4xl sm:text-5xl leading-[1.1] max-w-lg">
                            Short links.
                            <br />
                            No noise.
                        </p>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-4">
                            Product
                        </h3>
                        <ul className="space-y-3 font-grotesk text-sm">
                            <li>
                                <a
                                    href={route("home")}
                                    className="text-ink hover:text-accent-dark transition-colors"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href={route("documentation.api")}
                                    className="text-ink hover:text-accent-dark transition-colors"
                                >
                                    API documentation
                                </a>
                            </li>
                            <li>
                                <a
                                    href={route("pricing")}
                                    className="text-ink hover:text-accent-dark transition-colors"
                                >
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a
                                    href={route("privacy")}
                                    className="text-ink hover:text-accent-dark transition-colors"
                                >
                                    Privacy policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-4">
                            Services
                        </h3>
                        <ul className="space-y-3 font-grotesk text-sm">
                            <li>
                                <a
                                    href={route("services.qr-code-logo")}
                                    className="text-ink hover:text-accent-dark transition-colors"
                                >
                                    QR codes with your logo
                                </a>
                            </li>
                            <li>
                                <a
                                    href={route("services.link-tags")}
                                    className="text-ink hover:text-accent-dark transition-colors"
                                >
                                    Link tags
                                </a>
                            </li>
                            <li>
                                <a
                                    href={route("services.custom-links")}
                                    className="text-ink hover:text-accent-dark transition-colors"
                                >
                                    Custom links
                                </a>
                            </li>
                            <li>
                                <a
                                    href={route("services.broken-destinations")}
                                    className="text-ink hover:text-accent-dark transition-colors"
                                >
                                    Broken destination monitoring
                                </a>
                            </li>
                            <li>
                                <a
                                    href={route("services.edit-destination")}
                                    className="text-ink hover:text-accent-dark transition-colors"
                                >
                                    Edit destination
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-4">
                            Account
                        </h3>
                        <ul className="space-y-3 font-grotesk text-sm">
                            <li>
                                <a
                                    href={route("register")}
                                    className="text-ink hover:text-accent-dark transition-colors"
                                >
                                    Register
                                </a>
                            </li>
                            <li>
                                <a
                                    href={route("login")}
                                    className="text-ink hover:text-accent-dark transition-colors"
                                >
                                    Login
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/msamgan/ms0"
                                    className="text-ink hover:text-accent-dark transition-colors"
                                >
                                    GitHub
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-muted">
                    <p>© {new Date().getFullYear()} 301 ping. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

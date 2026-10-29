const linkGroups = [
    {
        title: "Explore",
        links: [
            { label: "Home", href: () => route("home") },
            { label: "Pricing", href: () => route("pricing") },
            { label: "Sitemap", href: () => route("sitemap") },
            { label: "API documentation", href: () => route("documentation.api") },
            { label: "Privacy policy", href: () => route("privacy") },
            { label: "Terms of service", href: () => route("terms") },
            { label: "Refund policy", href: () => route("refund-policy") }
        ]
    },
    {
        title: "Tools",
        links: [
            { label: "Custom links", href: () => route("services.custom-links") },
            { label: "Link tags", href: () => route("services.link-tags") },
            { label: "QR codes with your logo", href: () => route("services.qr-code-logo") },
            { label: "Broken destination monitoring", href: () => route("services.broken-destinations") },
            { label: "Edit destination", href: () => route("services.edit-destination") }
        ]
    },
    {
        title: "Account",
        links: [
            { label: "Create an account", href: () => route("register") },
            { label: "Sign in", href: () => route("login") },
            { label: "GitHub", href: () => "https://github.com/msamgan/ms0" }
        ]
    }
]

export default function Footer() {
    return (
        <footer className="border-t-4 border-accent bg-ink text-paper">
            <div className="mx-auto max-w-grid px-6 py-14 md:px-10 md:py-16 lg:px-16">
                <div className="grid grid-cols-1 items-end gap-12 border-b border-paper/20 pb-14 md:pb-16 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-7">
                        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
                            301 Ping <span className="px-2 text-accent">/</span> Short links, thoughtfully made
                        </p>
                        <h2 className="max-w-3xl font-editorial text-5xl leading-[1.05] text-paper sm:text-6xl lg:text-7xl">
                            Take the
                            <br />
                            <span className="text-accent">short way.</span>
                        </h2>
                        <a
                            href={route("register")}
                            className="mt-8 inline-flex items-center gap-3 border border-paper/30 px-5 py-3 font-grotesk text-sm font-semibold text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                        >
                            Make your first link
                            <span aria-hidden="true">↗</span>
                        </a>
                    </div>

                    <div
                        aria-hidden="true"
                        className="relative border border-paper/20 p-5 sm:p-7 lg:col-span-5 lg:mb-1"
                    >
                        <span className="absolute -top-3 left-5 bg-ink px-2 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/50 sm:left-7">
                            A shorter route
                        </span>
                        <p className="truncate font-mono text-xs text-paper/60 sm:text-sm">
                            your-long-link.com/something-great
                        </p>
                        <div className="my-4 flex items-center gap-3 text-accent">
                            <span className="h-px flex-1 bg-accent/60" />
                            <span className="font-mono text-xs uppercase tracking-[0.14em]">301 redirect</span>
                            <span className="h-px flex-1 bg-accent/60" />
                        </div>
                        <p className="font-mono text-lg text-paper sm:text-xl">
                            301p.ing/<span className="text-accent">go</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-12 sm:grid-cols-3 lg:grid-cols-12 lg:gap-x-10 lg:py-14">
                    <div className="col-span-2 sm:col-span-3 lg:col-span-3">
                        <a
                            href={route("home")}
                            aria-label="301 Ping home"
                            className="inline-flex items-baseline font-grotesk text-2xl font-bold tracking-tight text-paper transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                        >
                            301<span className="text-accent">Ping</span>
                            <span className="ml-1.5 h-2 w-2 self-center bg-accent" aria-hidden="true" />
                        </a>
                        <p className="mt-4 max-w-xs font-grotesk text-sm leading-relaxed text-paper/60">
                            Clear, useful links that get people where they&apos;re going.
                        </p>
                    </div>

                    <nav className="col-span-1 lg:col-span-3" aria-label="Explore">
                        <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50">
                            {linkGroups[0].title}
                        </h3>
                        <ul className="space-y-3">
                            {linkGroups[0].links.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href()}
                                        className="font-grotesk text-sm text-paper/80 transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav className="col-span-1 lg:col-span-3" aria-label="Tools">
                        <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50">
                            {linkGroups[1].title}
                        </h3>
                        <ul className="space-y-3">
                            {linkGroups[1].links.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href()}
                                        className="font-grotesk text-sm text-paper/80 transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav className="col-span-1 lg:col-span-3" aria-label="Account">
                        <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50">
                            {linkGroups[2].title}
                        </h3>
                        <ul className="space-y-3">
                            {linkGroups[2].links.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href()}
                                        className="font-grotesk text-sm text-paper/80 transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="flex flex-col gap-3 border-t border-paper/20 pt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/50 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} 301 Ping</p>
                    <p>Every click has somewhere to go.</p>
                </div>
            </div>
        </footer>
    )
}

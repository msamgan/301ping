import { Link } from "@inertiajs/react"
import { useState } from "react"
import Dropdown from "@/Components/Dropdown"

export default function Header({ isAuthenticated = false, user = null }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [servicesOpen, setServicesOpen] = useState(false)

    const linkClass = "relative py-2 font-grotesk text-sm text-muted hover:text-ink transition-colors"
    const linkActiveClass =
        "relative py-2 font-grotesk text-sm text-ink after:absolute after:left-0 after:right-0 after:-bottom-px after:h-[2px] after:bg-accent"

    const mobileLinkClass =
        "flex w-full items-center justify-between px-6 py-4 font-grotesk text-base text-ink border-b border-line"

    const navItems = [
        { key: "home", href: route("home"), label: "Home", show: true },
        { key: "dashboard", href: route("dashboard"), label: "Dashboard", show: isAuthenticated },
        { key: "links", href: route("links"), label: "Links", show: isAuthenticated },
        { key: "tags", href: route("tags"), label: "Tags", show: isAuthenticated },
        {
            key: "services",
            label: "Services",
            show: true,
            children: [
                {
                    key: "services.qr-code-logo",
                    href: route("services.qr-code-logo"),
                    label: "QR codes with your logo"
                },
                {
                    key: "services.link-tags",
                    href: route("services.link-tags"),
                    label: "Link tags"
                },
                {
                    key: "services.custom-links",
                    href: route("services.custom-links"),
                    label: "Custom links"
                },
                {
                    key: "services.broken-destinations",
                    href: route("services.broken-destinations"),
                    label: "Broken destination monitoring"
                },
                {
                    key: "services.edit-destination",
                    href: route("services.edit-destination"),
                    label: "Edit destination"
                }
            ]
        },
        { key: "pricing", href: route("pricing"), label: "Pricing", show: true },
        { key: "register", href: route("register"), label: "Register", show: !isAuthenticated },
        { key: "login", href: route("login"), label: "Login", show: !isAuthenticated },
        {
            key: "documentation.api",
            href: route("documentation.api"),
            label: "API",
            show: true,
            external: true
        }
    ].filter((item) => item.show)

    return (
        <header className="sticky top-0 z-50 bg-paper border-b border-line">
            <div className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 flex items-center justify-between h-16 sm:h-[72px]">
                <Link href={route("home")} className="flex items-center gap-3 group">
                    <img src="/301ping.svg" alt="301 Ping" className="h-9 w-auto" />
                </Link>

                <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
                    {navItems.map((item) =>
                        item.children ? (
                            <div
                                key={item.key}
                                className="relative"
                                onBlur={(event) => {
                                    if (!event.currentTarget.contains(event.relatedTarget)) {
                                        setServicesOpen(false)
                                    }
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Escape") setServicesOpen(false)
                                }}
                            >
                                <button
                                    type="button"
                                    className={`${route().current("services.*") ? linkActiveClass : linkClass} inline-flex items-center gap-1.5`}
                                    aria-haspopup="true"
                                    aria-expanded={servicesOpen}
                                    onClick={() => setServicesOpen((open) => !open)}
                                >
                                    {item.label}
                                    <svg
                                        className="h-3.5 w-3.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M5.25 7.5 10 12.25 14.75 7.5" />
                                    </svg>
                                </button>
                                {servicesOpen && (
                                    <div className="absolute left-0 top-full z-50 mt-2 min-w-56 border border-line bg-paper py-2">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.key}
                                                href={child.href}
                                                className="block px-4 py-2.5 font-grotesk text-sm text-ink transition-colors hover:bg-ink/5 hover:text-accent-dark"
                                                onClick={() => setServicesOpen(false)}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : item.external ? (
                            <a key={item.key} href={item.href} className={linkClass}>
                                {item.label}
                            </a>
                        ) : (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={route().current(item.key) ? linkActiveClass : linkClass}
                            >
                                {item.label}
                            </Link>
                        )
                    )}

                    {isAuthenticated && (
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 font-grotesk text-sm text-ink hover:text-accent-dark transition-colors"
                                >
                                    {user?.name}
                                    <svg
                                        className="h-3.5 w-3.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content contentClasses="bg-paper">
                                <Dropdown.Link href={route("profile.edit")}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route("billing")}>Billing</Dropdown.Link>
                                <Dropdown.Link href={route("branding")}>Branding</Dropdown.Link>
                                <Dropdown.Link href={route("logout")} method="post" as="button">
                                    Log out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    )}
                </nav>

                <button
                    onClick={() => setMobileMenuOpen((v) => !v)}
                    className="md:hidden inline-flex items-center justify-center h-10 w-10 text-ink"
                    aria-label="Toggle menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        {mobileMenuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-paper border-t border-line">
                    {navItems.map((item) =>
                        item.children ? (
                            <div key={item.key}>
                                <p className="px-6 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                                    {item.label}
                                </p>
                                {item.children.map((child) => (
                                    <Link
                                        key={child.key}
                                        href={child.href}
                                        className={`${mobileLinkClass} pl-9 ${route().current(child.key) ? "text-accent-dark" : ""}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {child.label}
                                    </Link>
                                ))}
                            </div>
                        ) : item.external ? (
                            <a
                                key={item.key}
                                href={item.href}
                                className={mobileLinkClass}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label}
                            </a>
                        ) : (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={mobileLinkClass}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        )
                    )}
                    {isAuthenticated && (
                        <>
                            <Link
                                href={route("profile.edit")}
                                className={mobileLinkClass}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Profile
                            </Link>
                            <Link
                                href={route("billing")}
                                className={mobileLinkClass}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Billing
                            </Link>
                            <Link
                                href={route("branding")}
                                className={mobileLinkClass}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Branding
                            </Link>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className={mobileLinkClass}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Log out
                            </Link>
                        </>
                    )}
                </div>
            )}
        </header>
    )
}

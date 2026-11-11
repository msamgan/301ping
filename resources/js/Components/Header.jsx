import { Link } from "@inertiajs/react"
import { useState } from "react"
import Dropdown from "@/Components/Dropdown"
import { analytics } from "@heycatch/sdk"

const iconPaths = {
    home: "M3 10.5 12 3l9 7.5M5.25 9v11h13.5V9M9 20v-6h6v6",
    dashboard: "M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z",
    links: "M10 13a5 5 0 0 0 7.07 0l3-3A5 5 0 0 0 13 2.93l-1.72 1.71M14 11a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.71-1.72",
    tag: "m20.59 13.41-7.18 7.18a2 2 0 0 1-2.82 0L3 13V3h10l7.59 7.59a2 2 0 0 1 0 2.82ZM7.5 7.5h.01",
    services: "M4 5h16M4 12h16M4 19h16M8 5h.01M8 12h.01M8 19h.01",
    qr: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM19 14v2M14 19h2M19 19h2v2",
    analytics: "M4 19V5M4 19h17M7 15l4-4 3 2 6-7M17 6h3v3",
    custom: "M12 5v14M5 12h14",
    broken: "M12 9v4M12 17h.01M10.3 3.86 1.82 18.5A2 2 0 0 0 3.55 21h16.9a2 2 0 0 0 1.73-2.5L13.7 3.86a2 2 0 0 0-3.4 0Z",
    edit: "M12 21s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12ZM12 9h.01",
    pricing: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    blog: "M4 3h12l4 4v14H4zM16 3v5h4M8 12h8M8 16h8",
    register: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6M22 11h-6",
    login: "M10 17l5-5-5-5M15 12H3M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7",
    api: "M8 17l-5-5 5-5M16 7l5 5-5 5M14 4l-4 16",
    profile: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z",
    billing: "M3 5h18v14H3zM3 10h18M7 15h3",
    branding:
        "M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.5-3.3 2 2 0 0 1 1.5-3.3H18a3 3 0 0 0 3-3c0-4.64-4.03-8.4-9-8.4ZM7.5 12h.01M10 7.5h.01M15 7.5h.01",
    admin: "M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11ZM9 12l2 2 4-4",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
}

function MenuIcon({ name, className = "h-4 w-4" }) {
    return (
        <svg
            className={`${className} shrink-0`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d={iconPaths[name]} />
        </svg>
    )
}

export default function Header({ isAuthenticated = false, user = null }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [servicesOpen, setServicesOpen] = useState(false)

    const linkClass = "relative py-2 font-grotesk text-sm text-muted hover:text-ink transition-colors"
    const linkActiveClass =
        "relative py-2 font-grotesk text-sm text-ink after:absolute after:left-0 after:right-0 after:-bottom-px after:h-[2px] after:bg-accent"

    const mobileLinkClass =
        "flex w-full items-center justify-start gap-3 px-6 py-4 font-grotesk text-base text-ink border-b border-line"

    const navItems = [
        { key: "home", href: route("home"), label: "Home", icon: "home", show: true },
        {
            key: "dashboard",
            href: route("dashboard"),
            label: "Dashboard",
            icon: "dashboard",
            show: isAuthenticated
        },
        { key: "links", href: route("links"), label: "Links", icon: "links", show: isAuthenticated },
        { key: "tags", href: route("tags"), label: "Tags", icon: "tag", show: isAuthenticated },
        {
            key: "services",
            label: "Services",
            icon: "services",
            show: true,
            children: [
                {
                    key: "services.qr-code-logo",
                    href: route("services.qr-code-logo"),
                    label: "QR codes with your logo",
                    icon: "qr"
                },
                {
                    key: "services.link-tags",
                    href: route("services.link-tags"),
                    label: "Link tags",
                    icon: "tag"
                },
                {
                    key: "services.link-analytics",
                    href: route("services.link-analytics"),
                    label: "Link analytics",
                    icon: "analytics"
                },
                {
                    key: "services.custom-links",
                    href: route("services.custom-links"),
                    label: "Custom links",
                    icon: "custom"
                },
                {
                    key: "services.broken-destinations",
                    href: route("services.broken-destinations"),
                    label: "Broken destination monitoring",
                    icon: "broken"
                },
                {
                    key: "services.edit-destination",
                    href: route("services.edit-destination"),
                    label: "Edit destination",
                    icon: "edit"
                }
            ]
        },
        { key: "pricing", href: route("pricing"), label: "Pricing", icon: "pricing", show: true },
        { key: "blog.index", href: route("blog.index"), label: "Blog", icon: "blog", show: true },
        {
            key: "register",
            href: route("register"),
            label: "Register",
            icon: "register",
            show: !isAuthenticated
        },
        { key: "login", href: route("login"), label: "Login", icon: "login", show: !isAuthenticated },
        {
            key: "documentation.api",
            href: route("documentation.api"),
            label: "API",
            icon: "api",
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
                                    <MenuIcon name={item.icon} />
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
                                    <div className="absolute left-1/2 top-full z-50 mt-2 grid w-[32rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 grid-cols-2 border border-line bg-paper py-2">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.key}
                                                href={child.href}
                                                className="flex items-center gap-2.5 px-4 py-2.5 font-grotesk text-sm text-ink transition-colors hover:bg-ink/5 hover:text-accent-dark"
                                                onClick={() => setServicesOpen(false)}
                                            >
                                                <MenuIcon name={child.icon} className="h-4 w-4 text-muted" />
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : item.external ? (
                            <a
                                key={item.key}
                                href={item.href}
                                className={`${linkClass} inline-flex items-center gap-2`}
                            >
                                <MenuIcon name={item.icon} />
                                {item.label}
                            </a>
                        ) : (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={`${route().current(item.key) ? linkActiveClass : linkClass} inline-flex items-center gap-2`}
                            >
                                <MenuIcon name={item.icon} />
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
                                    <MenuIcon name="profile" />
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
                                <Dropdown.Link
                                    href={route("profile.edit")}
                                    className="inline-flex items-center gap-2"
                                >
                                    <MenuIcon name="profile" />
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route("billing")}
                                    className="inline-flex items-center gap-2"
                                >
                                    <MenuIcon name="billing" />
                                    Billing
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route("branding")}
                                    className="inline-flex items-center gap-2"
                                >
                                    <MenuIcon name="branding" />
                                    Branding
                                </Dropdown.Link>
                                {user?.is_admin && (
                                    <Dropdown.Link
                                        href={route("admin.dashboard")}
                                        className="inline-flex items-center gap-2"
                                    >
                                        <MenuIcon name="admin" />
                                        Admin
                                    </Dropdown.Link>
                                )}
                                <Dropdown.Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    onSuccess={() => analytics.resetIdentity()}
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <MenuIcon name="logout" />
                                        Log out
                                    </span>
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
                                <p className="flex items-center gap-2 px-6 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                                    <MenuIcon name={item.icon} className="h-4 w-4" />
                                    {item.label}
                                </p>
                                {item.children.map((child) => (
                                    <Link
                                        key={child.key}
                                        href={child.href}
                                        className={`${mobileLinkClass} pl-9 ${route().current(child.key) ? "text-accent-dark" : ""}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <MenuIcon name={child.icon} className="h-[18px] w-[18px] text-muted" />
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
                                <MenuIcon name={item.icon} className="h-[18px] w-[18px] text-muted" />
                                {item.label}
                            </a>
                        ) : (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={mobileLinkClass}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <MenuIcon name={item.icon} className="h-[18px] w-[18px] text-muted" />
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
                                <MenuIcon name="profile" className="h-[18px] w-[18px] text-muted" />
                                Profile
                            </Link>
                            <Link
                                href={route("billing")}
                                className={mobileLinkClass}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <MenuIcon name="billing" className="h-[18px] w-[18px] text-muted" />
                                Billing
                            </Link>
                            <Link
                                href={route("branding")}
                                className={mobileLinkClass}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <MenuIcon name="branding" className="h-[18px] w-[18px] text-muted" />
                                Branding
                            </Link>
                            {user?.is_admin && (
                                <Link
                                    href={route("admin.dashboard")}
                                    className={mobileLinkClass}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <MenuIcon name="admin" className="h-[18px] w-[18px] text-muted" />
                                    Admin
                                </Link>
                            )}
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                onSuccess={() => analytics.resetIdentity()}
                                className={mobileLinkClass}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <MenuIcon name="logout" className="h-[18px] w-[18px] text-muted" />
                                Log out
                            </Link>
                        </>
                    )}
                </div>
            )}
        </header>
    )
}

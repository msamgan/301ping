import { Link, usePage } from "@inertiajs/react"
import Footer from "@/Components/Footer"
import Header from "@/Components/Header"
import SeoHead from "@/Components/SeoHead"

const QR_SIZE = 25

function isFinderModule(row, column) {
    return (row < 7 && column < 7) || (row < 7 && column >= QR_SIZE - 7) || (row >= QR_SIZE - 7 && column < 7)
}

function QRPreview() {
    const modules = []

    for (let row = 0; row < QR_SIZE; row++) {
        for (let column = 0; column < QR_SIZE; column++) {
            const inLogoSpace = row >= 9 && row <= 15 && column >= 9 && column <= 15
            const isDark = (row * 7 + column * 11 + row * column) % 5 < 2

            if (!isFinderModule(row, column) && !inLogoSpace && isDark) {
                modules.push(
                    <rect
                        key={`${row}-${column}`}
                        x={column + 2}
                        y={row + 2}
                        width="0.82"
                        height="0.82"
                        rx="0.2"
                    />
                )
            }
        }
    }

    return (
        <svg
            viewBox="0 0 29 29"
            className="h-full w-full"
            role="img"
            aria-label="Illustration of a QR code with a logo"
        >
            <g fill="currentColor">{modules}</g>
            {[
                [0, 0],
                [18, 0],
                [0, 18]
            ].map(([x, y]) => (
                <g key={`${x}-${y}`} transform={`translate(${x + 2} ${y + 2})`}>
                    <rect width="7" height="7" rx="1.4" fill="currentColor" />
                    <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
                    <rect x="2" y="2" width="3" height="3" rx="0.7" fill="currentColor" />
                </g>
            ))}
            <rect x="10.2" y="10.2" width="6.6" height="6.6" rx="1.6" fill="white" />
            <rect x="11" y="11" width="5" height="5" rx="1.3" fill="#e66054" />
            <path
                d="M12.2 14.6v-2.4h.65l.9 1.13.9-1.13h.65v2.4h-.7v-1.35l-.85 1.02-.85-1.02v1.35h-.7Z"
                fill="white"
            />
        </svg>
    )
}

const benefits = [
    {
        number: "01",
        title: "Be recognized at a glance",
        description:
            "Put your logo right in the center of your QR code, so a quick scan still feels like a moment with your brand."
    },
    {
        number: "02",
        title: "Keep every touchpoint on-brand",
        description:
            "Use the same saved logo across your short links and the QR codes you share online or in print."
    },
    {
        number: "03",
        title: "From link to download in minutes",
        description:
            "Create a short link, choose your logo, then download a crisp PNG ready to place wherever people can scan it."
    }
]

const steps = [
    {
        number: "01",
        title: "Create a short link",
        description: "Choose the destination you want people to reach."
    },
    { number: "02", title: "Add your logo", description: "Upload a logo once and select it for your link." },
    {
        number: "03",
        title: "Download and share",
        description: "Save your branded QR code as a high-resolution PNG."
    }
]

export default function QrCodeLogo() {
    const { auth } = usePage().props
    const user = auth?.user
    const isAuthenticated = !!user

    return (
        <div className="min-h-screen bg-paper">
            <SeoHead
                title="Branded QR Codes for Short Links"
                description="Create branded QR codes for short links, add your logo, and download a high-resolution PNG for print or digital sharing."
            />
            <Header isAuthenticated={isAuthenticated} user={user} />

            <main className="font-grotesk text-ink">
                <section className="border-b border-line">
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-12 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-16 lg:py-28">
                        <div className="lg:col-span-6">
                            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Services / Branded QR codes
                            </p>
                            <h1 className="max-w-2xl font-editorial text-5xl font-normal leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
                                Branded QR codes <span className="text-accent">with your logo.</span>
                            </h1>
                            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                                Turn any 301 Ping short link into a scan-ready QR code with your logo at the
                                center. Make every scan feel like part of your brand, from the first glance to
                                the final click.
                            </p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={isAuthenticated ? route("branding") : route("register")}
                                    className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-accent-dark hover:bg-accent-dark"
                                >
                                    {isAuthenticated ? "Manage your logos" : "Get started"}
                                </Link>
                                <Link
                                    href={route("pricing")}
                                    className="inline-flex items-center justify-center border border-line px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
                                >
                                    Explore plans
                                </Link>
                            </div>
                            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                High-resolution PNG / Ready for digital and print
                            </p>
                        </div>

                        <div className="lg:col-span-6">
                            <div className="relative mx-auto flex min-h-[340px] w-full max-w-xl items-center justify-center overflow-hidden border border-line bg-ink p-8 sm:min-h-[420px]">
                                <div
                                    className="absolute inset-0 opacity-30"
                                    aria-hidden="true"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
                                        backgroundSize: "32px 32px"
                                    }}
                                />
                                <div className="absolute left-5 top-5 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/50 sm:left-7 sm:top-7">
                                    301 Ping / QR studio
                                </div>
                                <div className="relative w-56 rotate-[-3deg] border border-ink/10 bg-white p-4 text-ink sm:w-64 sm:p-5">
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="font-mono text-[9px] uppercase tracking-[0.12em]">
                                            Scan to visit
                                        </span>
                                        <span className="h-2 w-2 rounded-full bg-accent" />
                                    </div>
                                    <div className="aspect-square p-2 text-ink">
                                        <QRPreview />
                                    </div>
                                    <div className="mt-3 border-t border-line pt-3 font-mono text-[9px] text-muted">
                                        YOUR LINK / YOUR BRAND
                                    </div>
                                </div>
                                <div className="absolute bottom-7 right-5 flex items-center gap-3 border border-paper/20 bg-ink px-3 py-2.5 sm:bottom-10 sm:right-8">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent font-grotesk text-xs font-extrabold text-white">
                                        M
                                    </span>
                                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper/70">
                                        Your logo
                                        <span className="block text-paper">Center stage</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-line">
                    <div className="mx-auto max-w-grid px-6 py-16 md:px-10 md:py-24 lg:px-16">
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                            <div className="lg:col-span-4">
                                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                    Why add a logo?
                                </p>
                                <h2 className="mt-5 max-w-sm font-editorial text-4xl font-normal leading-tight text-ink sm:text-5xl">
                                    Make the scan feel like your brand.
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-8 lg:gap-7">
                                {benefits.map((benefit) => (
                                    <article key={benefit.number} className="border-t border-line pt-5">
                                        <span className="font-mono text-xs text-accent">{benefit.number}</span>
                                        <h3 className="mt-4 font-grotesk text-base font-bold text-ink">
                                            {benefit.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-relaxed text-muted">
                                            {benefit.description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-line bg-white">
                    <div className="mx-auto max-w-grid px-6 py-16 md:px-10 md:py-24 lg:px-16">
                        <div className="mb-10 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                    Simple by design
                                </p>
                                <h2 className="mt-4 font-editorial text-4xl font-normal text-ink sm:text-5xl">
                                    Three steps to branded.
                                </h2>
                            </div>
                            <p className="max-w-sm text-sm leading-relaxed text-muted">
                                Your logo is saved to your account, so it is ready to use on the links you
                                share.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3">
                            {steps.map((step, index) => (
                                <article
                                    key={step.number}
                                    className={`py-6 sm:pr-8 ${index > 0 ? "border-t border-line sm:border-l sm:border-t-0 sm:pl-8" : ""}`}
                                >
                                    <span className="font-mono text-xs text-accent">{step.number}</span>
                                    <h3 className="mt-5 font-grotesk text-lg font-bold text-ink">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                                        {step.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-b border-line">
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-6 px-6 py-10 md:px-10 lg:grid-cols-12 lg:items-center lg:px-16">
                        <div className="lg:col-span-4">
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Logo upload guide
                            </p>
                            <h2 className="mt-3 font-grotesk text-lg font-bold text-ink">
                                Start with a clear, square image.
                            </h2>
                        </div>
                        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:col-span-8">
                            <div className="border-l border-line pl-4">
                                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                                    Formats
                                </dt>
                                <dd className="mt-1 text-sm text-ink">PNG, JPG, or WebP</dd>
                            </div>
                            <div className="border-l border-line pl-4">
                                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                                    Image size
                                </dt>
                                <dd className="mt-1 text-sm text-ink">200 × 200 to 4000 × 4000 px</dd>
                            </div>
                            <div className="border-l border-line pl-4">
                                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                                    File limit
                                </dt>
                                <dd className="mt-1 text-sm text-ink">2 MB per logo</dd>
                            </div>
                        </dl>
                    </div>
                </section>

                <section className="border-b border-line bg-ink text-paper">
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-10 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-12 lg:items-center lg:px-16">
                        <div className="lg:col-span-5">
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
                                Made to travel
                            </p>
                            <h2 className="mt-5 font-editorial text-4xl font-normal leading-tight text-paper sm:text-5xl">
                                From screen to storefront.
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
                            <div className="border-t border-paper/20 pt-5">
                                <h3 className="font-grotesk text-base font-bold text-paper">Print it</h3>
                                <p className="mt-2 text-sm leading-relaxed text-paper/65">
                                    Add your PNG to menus, packaging, event signs, business cards, or other
                                    printed materials.
                                </p>
                            </div>
                            <div className="border-t border-paper/20 pt-5">
                                <h3 className="font-grotesk text-base font-bold text-paper">Post it</h3>
                                <p className="mt-2 text-sm leading-relaxed text-paper/65">
                                    Share the same branded code in presentations, social posts, email, and
                                    digital campaigns.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-line">
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-10 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-12 lg:px-16">
                        <div className="lg:col-span-5">
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Plans and access
                            </p>
                            <h2 className="mt-4 max-w-sm font-editorial text-4xl font-normal leading-tight text-ink sm:text-5xl">
                                The right logo limit for your workflow.
                            </h2>
                            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
                                Choose the plan that fits the number of brands you manage. See the full plan
                                details before you decide.
                            </p>
                            <Link
                                href={route("pricing")}
                                className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-dark hover:underline"
                            >
                                Compare all plans <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                        <div className="divide-y divide-line border-y border-line lg:col-span-7">
                            <div className="grid grid-cols-[1fr_auto] items-center gap-4 py-5">
                                <div>
                                    <h3 className="font-grotesk text-sm font-bold text-ink">Redirect</h3>
                                    <p className="mt-1 text-sm text-muted">
                                        Save one custom logo for your QR codes.
                                    </p>
                                </div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                    1 logo
                                </span>
                            </div>
                            <div className="grid grid-cols-[1fr_auto] items-center gap-4 py-5">
                                <div>
                                    <h3 className="font-grotesk text-sm font-bold text-ink">Redirect Plus</h3>
                                    <p className="mt-1 text-sm text-muted">
                                        Save multiple logos for different brands or projects.
                                    </p>
                                </div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                    Unlimited
                                </span>
                            </div>
                            <div className="grid grid-cols-[1fr_auto] items-center gap-4 py-5">
                                <div>
                                    <h3 className="font-grotesk text-sm font-bold text-ink">Free</h3>
                                    <p className="mt-1 text-sm text-muted">
                                        Explore 301 Ping and its short-link features.
                                    </p>
                                </div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                    No custom logo
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-ink text-paper">
                    <div className="mx-auto flex max-w-grid flex-col gap-8 px-6 py-16 md:px-10 md:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-16">
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
                                Your next scan starts here
                            </p>
                            <h2 className="mt-4 max-w-2xl font-editorial text-4xl font-normal leading-tight text-paper sm:text-5xl">
                                Put your logo in the places people look.
                            </h2>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                            <Link
                                href={isAuthenticated ? route("branding") : route("register")}
                                className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-accent-dark hover:bg-accent-dark"
                            >
                                {isAuthenticated ? "Manage your logos" : "Create your account"}
                            </Link>
                            {isAuthenticated && (
                                <Link
                                    href={route("links")}
                                    className="inline-flex items-center justify-center border border-paper/30 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-paper hover:bg-paper/10"
                                >
                                    View your links
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

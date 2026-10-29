import { Link, usePage } from "@inertiajs/react"
import Footer from "@/Components/Footer"
import Header from "@/Components/Header"
import SeoHead from "@/Components/SeoHead"

const sampleTags = [
    { name: "campaign-spring", count: 14 },
    { name: "newsletter", count: 9 },
    { name: "social", count: 22 },
    { name: "docs", count: 6 }
]

const sampleLinks = [
    { slug: "301p.ing/spring", tags: ["campaign-spring", "social"], visits: 1284 },
    { slug: "301p.ing/news-04", tags: ["newsletter"], visits: 732 },
    { slug: "301p.ing/guide", tags: ["docs", "newsletter"], visits: 215 }
]

const benefits = [
    {
        number: "01",
        title: "Find any link in seconds",
        description:
            "Stop scrolling through a long list. Filter your whole library down to one tag and see exactly the links you need."
    },
    {
        number: "02",
        title: "Organize by campaign, client, or team",
        description:
            "Group links the way you work. Use tags for launches, clients, channels, or anything else that matters to you."
    },
    {
        number: "03",
        title: "Flexible, never rigid",
        description:
            "A link can carry as many tags as it needs. Add, change, or remove tags whenever your structure evolves."
    },
    {
        number: "04",
        title: "Cleaner reporting",
        description:
            "Compare related links side by side so you can see which campaigns and channels are actually driving visits."
    },
    {
        number: "05",
        title: "Shareable, bookmarkable views",
        description:
            "Tag filters live in the URL, so you can bookmark a filtered view or send it to a teammate."
    },
    {
        number: "06",
        title: "Private to your account",
        description:
            "Your tags belong to you. They never appear on the short link itself and are never visible to visitors."
    }
]

const steps = [
    {
        number: "01",
        title: "Create your tags",
        description: "Add tags from the Tags page. Each tag gets a clean, URL-friendly slug automatically."
    },
    {
        number: "02",
        title: "Attach them to links",
        description: "Pick one or more tags when you create or edit a short link."
    },
    {
        number: "03",
        title: "Filter and manage",
        description: "Click any tag to filter your link library, or combine it with search to narrow further."
    }
]

const useCases = [
    {
        title: "Marketing campaigns",
        description: "Tag every link in a launch so the whole campaign is one click away."
    },
    {
        title: "Agencies and freelancers",
        description: "Keep each client's links separate without maintaining separate accounts."
    },
    {
        title: "Content and social",
        description: "Label links by channel, such as newsletter, social, or podcast, and compare them."
    },
    {
        title: "Product and docs",
        description: "Organize help articles, release notes, and onboarding links by product area."
    }
]

const specs = [
    { label: "Tags per link", value: "Multiple" },
    { label: "Tag name length", value: "Up to 255 characters" },
    { label: "Slugs", value: "Generated automatically" },
    { label: "Unique names", value: "Per account" }
]

function TagPreview() {
    return (
        <div className="relative mx-auto w-full max-w-xl overflow-hidden border border-line bg-ink p-6 sm:p-8">
            <div
                className="absolute inset-0 opacity-30"
                aria-hidden="true"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
                    backgroundSize: "32px 32px"
                }}
            />
            <div className="relative">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/50">
                    301 Ping / Link library
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {sampleTags.map((tag, index) => (
                        <span
                            key={tag.name}
                            className={`inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] ${
                                index === 0
                                    ? "border-accent bg-accent text-white"
                                    : "border-paper/25 text-paper/80"
                            }`}
                        >
                            {tag.name}
                            <span className={index === 0 ? "text-white/80" : "text-paper/50"}>{tag.count}</span>
                        </span>
                    ))}
                </div>
                <div className="mt-6 divide-y divide-paper/15 border border-paper/15 bg-paper text-ink">
                    {sampleLinks.map((link) => (
                        <div key={link.slug} className="flex items-center justify-between gap-3 px-4 py-3.5">
                            <div className="min-w-0">
                                <p className="truncate font-grotesk text-sm font-bold">{link.slug}</p>
                                <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    {link.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-muted"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                                {link.visits} visits
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function LinkTags() {
    const { auth } = usePage().props
    const user = auth?.user
    const isAuthenticated = !!user

    return (
        <div className="min-h-screen bg-paper">
            <SeoHead
                title="Organize Short Links with Tags"
                description="Organize short links with reusable tags. Group URLs by campaign, client, or channel, then filter your link library to find what you need."
            />
            <Header isAuthenticated={isAuthenticated} user={user} />

            <main className="font-grotesk text-ink">
                <section className="border-b border-line">
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-12 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-16 lg:py-28">
                        <div className="lg:col-span-6">
                            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Services / Link tags
                            </p>
                            <h1 className="max-w-2xl font-editorial text-5xl font-normal leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
                                Organize short links <span className="text-accent">with tags.</span>
                            </h1>
                            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                                Tags turn a growing pile of short links into an organized library. Label links
                                by campaign, client, or channel, then filter to exactly what you need in a
                                single click.
                            </p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={isAuthenticated ? route("tags") : route("register")}
                                    className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-accent-dark hover:bg-accent-dark"
                                >
                                    {isAuthenticated ? "Manage your tags" : "Get started"}
                                </Link>
                                <Link
                                    href={route("pricing")}
                                    className="inline-flex items-center justify-center border border-line px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
                                >
                                    Explore plans
                                </Link>
                            </div>
                            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                Unlimited organization / Filter by tag / Combine with search
                            </p>
                        </div>

                        <div className="lg:col-span-6">
                            <TagPreview />
                        </div>
                    </div>
                </section>

                <section className="border-b border-line">
                    <div className="mx-auto max-w-grid px-6 py-16 md:px-10 md:py-24 lg:px-16">
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                            <div className="lg:col-span-4">
                                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                    Why use tags?
                                </p>
                                <h2 className="mt-5 max-w-sm font-editorial text-4xl font-normal leading-tight text-ink sm:text-5xl">
                                    Less hunting. More shipping.
                                </h2>
                                <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                                    The more links you create, the more a little structure pays off. Tags give
                                    you that structure without getting in the way.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-8 lg:gap-x-7 lg:gap-y-10">
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
                                    Three steps to organized.
                                </h2>
                            </div>
                            <p className="max-w-sm text-sm leading-relaxed text-muted">
                                No setup, no folders to maintain. Create a tag, attach it, and start filtering.
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

                <section className="border-b border-line bg-ink text-paper">
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-10 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-12 lg:items-start lg:px-16">
                        <div className="lg:col-span-5">
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
                                Built for how you work
                            </p>
                            <h2 className="mt-5 font-editorial text-4xl font-normal leading-tight text-paper sm:text-5xl">
                                One system, many workflows.
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
                            {useCases.map((useCase) => (
                                <div key={useCase.title} className="border-t border-paper/20 pt-5">
                                    <h3 className="font-grotesk text-base font-bold text-paper">
                                        {useCase.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-paper/65">
                                        {useCase.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-b border-line">
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-6 px-6 py-10 md:px-10 lg:grid-cols-12 lg:items-center lg:px-16">
                        <div className="lg:col-span-4">
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                At a glance
                            </p>
                            <h2 className="mt-3 font-grotesk text-lg font-bold text-ink">
                                Simple rules, predictable results.
                            </h2>
                        </div>
                        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
                            {specs.map((spec) => (
                                <div key={spec.label} className="border-l border-line pl-4">
                                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                                        {spec.label}
                                    </dt>
                                    <dd className="mt-1 text-sm text-ink">{spec.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>

                <section className="bg-ink text-paper">
                    <div className="mx-auto flex max-w-grid flex-col gap-8 px-6 py-16 md:px-10 md:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-16">
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
                                Ready to tidy up?
                            </p>
                            <h2 className="mt-4 max-w-2xl font-editorial text-4xl font-normal leading-tight text-paper sm:text-5xl">
                                Give every link a home.
                            </h2>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                            <Link
                                href={isAuthenticated ? route("tags") : route("register")}
                                className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-accent-dark hover:bg-accent-dark"
                            >
                                {isAuthenticated ? "Manage your tags" : "Create your account"}
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

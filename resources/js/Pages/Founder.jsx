import { usePage } from "@inertiajs/react"
import Footer from "@/Components/Footer"
import Header from "@/Components/Header"
import SeoHead from "@/Components/SeoHead"

const skills = [
    { title: "Languages & frameworks", items: "PHP · Laravel · JavaScript · TypeScript · Node.js · React" },
    { title: "Cloud & DevOps", items: "AWS · Azure · GCP · Docker · CI/CD · GitHub Actions" },
    { title: "Data & systems", items: "MySQL · PostgreSQL · MongoDB · Redis · RabbitMQ · System design" }
]

const openSourceProjects = [
    {
        name: "Laravel Env Keys Checker",
        description: "Keeps environment keys in sync across Laravel project .env files.",
        href: "https://github.com/msamgan/laravel-env-keys-checker"
    },
    {
        name: "Laravel Pint VS Code Extension",
        description: "Runs Laravel Pint formatting from directly inside Visual Studio Code.",
        href: "https://marketplace.visualstudio.com/items?itemName=msamgan.laravel-pint-vscode"
    }
]

const socialLinks = [
    { label: "GitHub", href: "https://github.com/msamgan" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mohd-samgan-khan/" },
    { label: "YouTube", href: "https://www.youtube.com/@FellowDeveloper" }
]

export default function Founder() {
    const user = usePage().props.auth?.user
    const founderStory =
        "I built 301 Ping to solve a problem I had: I needed a simple URL shortener that didn't expire my links. I couldn't find one that met my needs, so I built 301 Ping for myself. I've been using it ever since, and now I want to share it with the world."
    const founderPhoto = "https://msamgan.com/assets/msamgan-CytIHvTV.jpeg"

    return (
        <>
            <SeoHead
                title="Meet the Founder"
                description="Meet Mohammed Samgan Khan, founder of 301 Ping and a software engineer with 11+ years of experience building scalable systems and open-source tools."
            />
            <Header isAuthenticated={!!user} user={user} />

            <main className="bg-paper font-grotesk text-ink">
                <section className="border-b border-line" aria-labelledby="founder-heading">
                    <div className="mx-auto max-w-grid px-6 pb-16 pt-16 md:px-10 md:pb-20 md:pt-20 lg:px-16">
                        <div className="mb-8 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:mb-12">
                            <span>01 / The founder</span>
                            <span className="hidden sm:inline">301 ping / Built with care</span>
                        </div>

                        <div className="grid grid-cols-1 items-end gap-x-10 gap-y-10 lg:grid-cols-12">
                            <div className="lg:col-span-7">
                                <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-dark">
                                    Mohammed Samgan Khan
                                </p>
                                <h1
                                    id="founder-heading"
                                    className="max-w-3xl font-editorial text-6xl leading-[1.05] sm:text-7xl lg:text-8xl"
                                >
                                    Thoughtful software, built to last.
                                </h1>
                            </div>
                            <div className="border-l border-line pl-6 lg:col-span-5">
                                <p className="max-w-xl text-lg text-muted">
                                    I&apos;m a software engineer and the founder behind 301 Ping. For over 11
                                    years, I&apos;ve built and shipped software across logistics, e-commerce,
                                    and cloud infrastructure.
                                </p>
                                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
                                    I care about making useful things work well: from scalable systems and
                                    reliable integrations to the small details that make a product easier to
                                    use.
                                </p>
                                {founderStory && (
                                    <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
                                        {founderStory}
                                    </p>
                                )}
                                {founderPhoto && (
                                    <img
                                        src={founderPhoto}
                                        alt="Mohammed Samgan Khan"
                                        className="mt-6 h-24 w-24 rounded-full object-cover"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-line" aria-label="Founder profile">
                    <div className="mx-auto max-w-grid px-6 py-8 md:px-10 md:py-12 lg:px-16">
                        <article className="grid grid-cols-1 gap-x-10 gap-y-5 border-b border-line py-8 md:grid-cols-12 md:py-10">
                            <div className="md:col-span-4">
                                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                                    02 / Background
                                </p>
                                <h2 className="max-w-sm text-2xl font-extrabold leading-tight sm:text-3xl">
                                    Engineering for real-world work.
                                </h2>
                            </div>
                            <div className="space-y-4 text-sm leading-relaxed text-muted md:col-span-8 md:text-base">
                                <p>
                                    My work spans full-stack development, cloud platforms, CI/CD, and SQL and
                                    NoSQL databases. I&apos;ve led applications from first design through
                                    production, and helped logistics teams improve warehouse and delivery
                                    operations with API integrations and ERP implementations.
                                </p>
                                <p>
                                    I&apos;m also an open-source contributor. Projects like Laravel Env Keys
                                    Checker and Laravel Pint VS Code Extension bring practical developer tools
                                    to the Laravel and VS Code communities.
                                </p>
                                <p>Based in Philadelphia, Pennsylvania, USA.</p>
                            </div>
                        </article>

                        <div className="grid grid-cols-1 gap-x-10 md:grid-cols-3">
                            {[
                                { value: "11+", label: "Years engineering" },
                                { value: "50+", label: "Projects delivered" },
                                { value: "Open source", label: "Tools for the community" }
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="border-b border-line py-7 md:border-b-0 md:py-9"
                                >
                                    <p className="font-editorial text-4xl text-ink sm:text-5xl">{stat.value}</p>
                                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-b border-line" aria-label="Technical skills">
                    <div className="mx-auto max-w-grid px-6 py-8 md:px-10 md:py-12 lg:px-16">
                        <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-12">
                            <div className="md:col-span-4">
                                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                                    03 / Toolkit
                                </p>
                                <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
                                    The tools behind the work.
                                </h2>
                            </div>
                            <div className="md:col-span-8">
                                {skills.map((group) => (
                                    <div
                                        key={group.title}
                                        className="grid grid-cols-1 gap-2 border-b border-line py-5 first:pt-0 last:border-b-0 sm:grid-cols-12 sm:gap-6"
                                    >
                                        <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:col-span-4">
                                            {group.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-ink sm:col-span-8">
                                            {group.items}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-line" aria-label="Open-source projects">
                    <div className="mx-auto max-w-grid px-6 py-8 md:px-10 md:py-12 lg:px-16">
                        <div className="mb-6 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-12">
                            <div className="md:col-span-4">
                                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                                    04 / Open source
                                </p>
                                <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
                                    Useful tools, shared.
                                </h2>
                            </div>
                            <p className="max-w-2xl text-sm leading-relaxed text-muted md:col-span-8 md:text-base">
                                I build and maintain developer tools that make everyday workflows a little
                                smoother.
                            </p>
                        </div>

                        <div className="md:ml-[calc(33.333%+1.25rem)]">
                            {openSourceProjects.map((project) => (
                                <a
                                    key={project.name}
                                    href={project.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group grid grid-cols-1 gap-2 border-t border-line py-5 transition-colors hover:text-accent-dark sm:grid-cols-12 sm:gap-6"
                                >
                                    <span className="font-semibold sm:col-span-5">{project.name}</span>
                                    <span className="text-sm leading-relaxed text-muted transition-colors group-hover:text-accent-dark sm:col-span-6">
                                        {project.description}
                                    </span>
                                    <span
                                        className="font-mono text-sm text-accent-dark sm:col-span-1"
                                        aria-hidden="true"
                                    >
                                        ↗
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mx-auto grid max-w-grid grid-cols-1 gap-8 px-6 py-12 md:grid-cols-12 md:px-10 md:py-16 lg:px-16">
                    <div className="md:col-span-4">
                        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                            05 / Elsewhere
                        </p>
                        <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
                            Let&apos;s connect.
                        </h2>
                    </div>
                    <div className="flex flex-col gap-5 md:col-span-8">
                        <a
                            href="mailto:mail@msamgan.com"
                            className="w-fit text-lg font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent-dark"
                        >
                            mail@msamgan.com
                        </a>
                        <nav aria-label="Founder social links" className="flex flex-wrap gap-x-6 gap-y-3">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent-dark"
                                >
                                    {link.label} ↗
                                </a>
                            ))}
                        </nav>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    )
}

import { Link, usePage } from "@inertiajs/react"
import Header from "@/Components/Header.jsx"
import Footer from "@/Components/Footer.jsx"
import SeoHead from "@/Components/SeoHead"
import Reveal from "@/Components/Home/Reveal"
import ArrowIcon from "@/Components/Home/ArrowIcon"

export default function Show({ post }) {
    const { props } = usePage()
    const user = props.auth?.user
    const siteUrl = (props.siteUrl || "").replace(/\/+$/, "")
    const url = `${siteUrl}/blog/${post.slug}`
    const image = post.image || `${siteUrl}/android-chrome-512x512.png`

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                "@id": `${url}#article`,
                mainEntityOfPage: { "@type": "WebPage", "@id": url },
                headline: post.title,
                description: post.description,
                image: [image],
                datePublished: post.date,
                dateModified: post.updated,
                keywords: post.tags.join(", "),
                author: { "@type": "Person", name: post.author },
                publisher: {
                    "@type": "Organization",
                    name: "301 Ping",
                    logo: { "@type": "ImageObject", url: `${siteUrl}/android-chrome-512x512.png` }
                }
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
                    { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
                    { "@type": "ListItem", position: 3, name: post.title, item: url }
                ]
            }
        ]
    }

    return (
        <>
            <SeoHead
                title={post.title}
                description={post.description}
                image={image}
                imageAlt={post.image_alt}
                type="article"
                article={{
                    publishedTime: post.date,
                    modifiedTime: post.updated,
                    author: post.author,
                    tags: post.tags
                }}
                structuredData={structuredData}
            />
            <Header isAuthenticated={!!user} user={user} />

            <main className="bg-paper font-grotesk text-ink">
                <article>
                    <header className="border-b border-line">
                        <div className="mx-auto max-w-grid px-6 pb-12 pt-16 md:px-10 md:pt-20 lg:px-16">
                            <Reveal className="mb-8 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:mb-12">
                                <Link href={route("blog.index")} className="transition-colors hover:text-accent-dark">
                                    ← 01 / Blog
                                </Link>
                                <span className="hidden sm:inline">301 ping / Article</span>
                            </Reveal>
                            <Reveal
                                as="h1"
                                className="max-w-5xl font-editorial text-5xl leading-[1.05] sm:text-6xl lg:text-7xl"
                            >
                                {post.title}
                            </Reveal>
                            <Reveal delay={80} className="mt-6 max-w-2xl text-lg text-muted">
                                {post.description}
                            </Reveal>
                        </div>
                    </header>

                    <div className="mx-auto max-w-grid px-6 py-12 md:px-10 md:py-16 lg:px-16">
                        <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
                            <aside className="lg:col-span-3">
                                <dl className="border-t border-ink font-mono text-[11px] uppercase tracking-[0.16em] lg:sticky lg:top-8">
                                    {[
                                        ["Author", post.author],
                                        [
                                            "Published",
                                            <time key="d" dateTime={post.date}>
                                                {post.date_formatted}
                                            </time>
                                        ],
                                        ["Reading time", `${post.reading_time} min`]
                                    ].map(([label, value]) => (
                                        <div key={label} className="border-b border-line py-4">
                                            <dt className="text-muted">{label}</dt>
                                            <dd className="mt-1 text-ink">{value}</dd>
                                        </div>
                                    ))}
                                    {post.tags.length > 0 && (
                                        <div className="border-b border-line py-4">
                                            <dt className="text-muted">Tags</dt>
                                            <dd className="mt-2 flex flex-wrap gap-2">
                                                {post.tags.map((tag) => (
                                                    <span key={tag} className="border border-line px-2 py-1 normal-case tracking-normal">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </aside>

                            <div className="lg:col-span-8 lg:col-start-5">
                                {post.image && (
                                    <img
                                        src={post.image}
                                        alt={post.image_alt}
                                        width="1200"
                                        height="630"
                                        className="mb-10 aspect-[1200/630] w-full border border-line object-cover"
                                    />
                                )}
                                <div
                                    className="blog-content max-w-3xl"
                                    dangerouslySetInnerHTML={{ __html: post.html }}
                                />
                                <div className="mt-14 border-t border-ink pt-6">
                                    <Link
                                        href={route("blog.index")}
                                        className="group inline-flex items-center gap-2 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:text-accent-dark"
                                    >
                                        <ArrowIcon className="h-4 w-4 -scale-x-100" />
                                        All articles
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </>
    )
}

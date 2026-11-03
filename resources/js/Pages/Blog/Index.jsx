import { Link, usePage } from "@inertiajs/react"
import Header from "@/Components/Header.jsx"
import Footer from "@/Components/Footer.jsx"
import SeoHead from "@/Components/SeoHead"
import Reveal from "@/Components/Home/Reveal"
import ArrowIcon from "@/Components/Home/ArrowIcon"
import CopyLinkButton from "@/Components/CopyLinkButton"
import TextInput from "@/Components/TextInput"
import { useState } from "react"

export default function Index({ posts }) {
    const [search, setSearch] = useState("")
    const { props } = usePage()
    const user = props.auth?.user
    const siteUrl = (props.siteUrl || "").replace(/\/+$/, "")
    const query = search.trim().toLocaleLowerCase()
    const filteredPosts = query
        ? posts.filter((post) =>
              [post.title, post.description, ...post.tags].some((value) =>
                  value.toLocaleLowerCase().includes(query)
              )
          )
        : posts
    const title = "Blog"
    const description =
        "Guides, tips and product news about short links, QR codes and link management from 301 Ping."

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "301 Ping Blog",
        description,
        url: `${siteUrl}/blog`,
        blogPost: posts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: `${siteUrl}/blog/${post.slug}`,
            datePublished: post.date,
            image: post.image || undefined
        }))
    }

    return (
        <>
            <SeoHead
                title={title}
                description={description}
                image={posts.find((post) => post.image)?.image}
                imageAlt="301 Ping blog"
                structuredData={structuredData}
            />
            <Header isAuthenticated={!!user} user={user} />

            <main className="bg-paper font-grotesk text-ink">
                <section className="border-b border-line">
                    <div className="mx-auto max-w-grid px-6 pb-12 pt-16 md:px-10 md:pt-20 lg:px-16">
                        <Reveal className="mb-8 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:mb-12">
                            <span>01 / Blog</span>
                            <span className="hidden sm:inline">
                                301 ping / {String(posts.length).padStart(2, "0")} articles
                            </span>
                        </Reveal>
                        <h1 className="font-editorial text-6xl leading-[1.05] sm:text-7xl lg:text-8xl">
                            Notes on
                            <br />
                            shorter links.
                        </h1>
                        <p className="mt-6 max-w-xl text-lg text-muted">{description}</p>
                    </div>
                </section>

                <section className="mx-auto max-w-grid px-6 py-12 md:px-10 lg:px-16">
                    {posts.length === 0 ? (
                        <p className="text-muted">No articles published yet. Check back soon.</p>
                    ) : (
                        <>
                            <div className="mb-8 max-w-xl">
                                <label
                                    htmlFor="blog-search"
                                    className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted"
                                >
                                    Search articles
                                </label>
                                <TextInput
                                    id="blog-search"
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search by title, description, or tag"
                                    autoComplete="off"
                                />
                                <p
                                    className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted"
                                    aria-live="polite"
                                >
                                    {query
                                        ? `${filteredPosts.length} of ${posts.length} articles`
                                        : `${posts.length} articles`}
                                </p>
                            </div>
                            {filteredPosts.length === 0 ? (
                                <p className="border-t border-ink py-8 text-muted">
                                    No articles match “{search.trim()}”. Try another search.
                                </p>
                            ) : (
                                <ol className="border-t border-ink">
                                    {filteredPosts.map((post, index) => (
                                        <Reveal
                                            as="li"
                                            key={post.slug}
                                            delay={Math.min(index, 4) * 60}
                                            className="border-b border-line"
                                        >
                                            <div className="grid grid-cols-1 gap-x-4 gap-y-4 py-8 md:grid-cols-12 md:py-10">
                                                <Link
                                                    href={route("blog.show", post.slug)}
                                                    className="group grid grid-cols-1 gap-x-10 gap-y-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:col-span-11 md:grid-cols-11"
                                                >
                                                    <div className="flex items-baseline gap-4 md:col-span-2 md:flex-col md:gap-3">
                                                        <span className="font-editorial text-5xl leading-none text-ink transition-colors group-hover:text-accent-dark md:text-6xl">
                                                            {String(index + 1).padStart(2, "0")}
                                                        </span>
                                                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                                                            <time dateTime={post.date}>
                                                                {post.date_formatted}
                                                            </time>
                                                            <span className="mx-2 md:hidden">·</span>
                                                            <br className="hidden md:block" />
                                                            {post.reading_time} min read
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col justify-between gap-6 md:col-span-9">
                                                        <div>
                                                            <h2 className="font-grotesk text-2xl font-extrabold leading-tight sm:text-3xl">
                                                                {post.title}
                                                            </h2>
                                                            <p className="mt-3 line-clamp-3 max-w-xl text-muted">
                                                                {post.description}
                                                            </p>
                                                        </div>
                                                        <span className="inline-flex items-center gap-2 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-ink transition-colors group-hover:text-accent-dark">
                                                            Read article
                                                            <ArrowIcon />
                                                        </span>
                                                    </div>
                                                </Link>
                                                <div className="flex justify-end md:col-span-1 md:items-start">
                                                    <CopyLinkButton
                                                        url={`${siteUrl}/blog/${post.slug}`}
                                                        primary
                                                    />
                                                </div>
                                            </div>
                                        </Reveal>
                                    ))}
                                </ol>
                            )}
                        </>
                    )}
                </section>
            </main>

            <Footer />
        </>
    )
}

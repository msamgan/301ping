import { Head, usePage } from "@inertiajs/react"

export default function SeoHead({ title, description, noindex = false, structuredData = null, image = null, imageAlt = null, type = "website", article = null }) {
    const { props, url } = usePage()
    const siteUrl = props.siteUrl || "http://localhost"
    const pageUrl = new URL(url, siteUrl)
    const canonicalUrl = `${siteUrl.replace(/\/+$/, "")}${pageUrl.pathname === "/" ? "/" : pageUrl.pathname.replace(/\/+$/, "")}`
    const imageUrl = image || `${siteUrl.replace(/\/+$/, "")}/android-chrome-512x512.png`
    const imageDescription = imageAlt || "301 Ping logo"
    const robots = noindex ? "noindex,follow" : "index,follow,max-image-preview:large"

    return (
        <Head title={title}>
            <meta name="description" content={description} head-key="description" />
            <meta name="robots" content={robots} head-key="robots" />
            <link rel="canonical" href={canonicalUrl} head-key="canonical" />
            <meta property="og:type" content={type} head-key="og:type" />
            <meta property="og:site_name" content="301 Ping" head-key="og:site_name" />
            <meta property="og:locale" content="en_US" head-key="og:locale" />
            <meta property="og:title" content={title} head-key="og:title" />
            <meta property="og:description" content={description} head-key="og:description" />
            <meta property="og:url" content={canonicalUrl} head-key="og:url" />
            <meta property="og:image" content={imageUrl} head-key="og:image" />
            <meta property="og:image:alt" content={imageDescription} head-key="og:image:alt" />
            <meta name="twitter:card" content="summary_large_image" head-key="twitter:card" />
            <meta name="twitter:title" content={title} head-key="twitter:title" />
            <meta name="twitter:description" content={description} head-key="twitter:description" />
            <meta name="twitter:image" content={imageUrl} head-key="twitter:image" />
            <meta name="twitter:image:alt" content={imageDescription} head-key="twitter:image:alt" />
            {article && <meta property="article:published_time" content={article.publishedTime} head-key="article:published_time" />}
            {article && <meta property="article:modified_time" content={article.modifiedTime} head-key="article:modified_time" />}
            {article && <meta property="article:author" content={article.author} head-key="article:author" />}
            {article &&
                (article.tags || []).map((tag) => (
                    <meta property="article:tag" content={tag} key={tag} head-key={`article:tag:${tag}`} />
                ))}
            {structuredData && (
                <script type="application/ld+json" head-key="structured-data">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Head>
    )
}

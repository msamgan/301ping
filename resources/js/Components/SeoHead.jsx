import { Head, usePage } from "@inertiajs/react"

export default function SeoHead({ title, description, noindex = false, structuredData = null }) {
    const { props, url } = usePage()
    const siteUrl = props.siteUrl || "http://localhost"
    const pageUrl = new URL(url, siteUrl)
    const canonicalUrl = `${siteUrl.replace(/\/+$/, "")}${pageUrl.pathname === "/" ? "/" : pageUrl.pathname.replace(/\/+$/, "")}`
    const imageUrl = `${siteUrl.replace(/\/+$/, "")}/android-chrome-512x512.png`
    const robots = noindex ? "noindex,follow" : "index,follow,max-image-preview:large"

    return (
        <Head title={title}>
            <meta name="description" content={description} head-key="description" />
            <meta name="robots" content={robots} head-key="robots" />
            <link rel="canonical" href={canonicalUrl} head-key="canonical" />
            <meta property="og:type" content="website" head-key="og:type" />
            <meta property="og:site_name" content="301 Ping" head-key="og:site_name" />
            <meta property="og:locale" content="en_US" head-key="og:locale" />
            <meta property="og:title" content={title} head-key="og:title" />
            <meta property="og:description" content={description} head-key="og:description" />
            <meta property="og:url" content={canonicalUrl} head-key="og:url" />
            <meta property="og:image" content={imageUrl} head-key="og:image" />
            <meta property="og:image:alt" content="301 Ping logo" head-key="og:image:alt" />
            <meta name="twitter:card" content="summary_large_image" head-key="twitter:card" />
            <meta name="twitter:title" content={title} head-key="twitter:title" />
            <meta name="twitter:description" content={description} head-key="twitter:description" />
            <meta name="twitter:image" content={imageUrl} head-key="twitter:image" />
            <meta name="twitter:image:alt" content="301 Ping logo" head-key="twitter:image:alt" />
            {structuredData && (
                <script type="application/ld+json" head-key="structured-data">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Head>
    )
}

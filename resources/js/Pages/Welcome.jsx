import { usePage } from "@inertiajs/react"
import Header from "@/Components/Header.jsx"
import Footer from "@/Components/Footer.jsx"
import SeoHead from "@/Components/SeoHead"
import Hero from "@/Components/Home/Hero"
import BrowserExtension from "@/Components/Home/BrowserExtension"
import Features from "@/Components/Home/Features"
import QRCodeFeature from "@/Components/Home/QRCodeFeature"
import Process from "@/Components/Home/Process"
import AccountPanel from "@/Components/Home/AccountPanel"

/**
 * Homepage design system (editorial / Swiss / technical utility):
 *  - Type:  font-editorial (DM Serif Display, hero + closing statements only),
 *           font-grotesk (Manrope, all UI copy and headings),
 *           font-mono (JetBrains Mono, URLs / metadata / technical labels)
 *  - Color: paper (#F5F3ED bg) / ink (#111111 text) / muted (secondary text)
 *           / line (hairline borders) / accent (#E66054, used sparingly)
 *  - Grid:  max-w-grid (1400px) container, consistent px-6/10/16 margins
 *  - Shape: sharp corners everywhere, no cards/shadows - hierarchy comes
 *           from type, spacing, rules and a 12-column grid instead.
 */
export default function Welcome() {
    const { auth } = usePage().props
    const isAuthenticated = !!auth.user
    const user = auth.user

    return (
        <>
            <SeoHead
                title="URL Shortener & Short Links"
                description="Shorten long URLs, create memorable custom links, track clicks, and make branded QR codes with 301 Ping."
                structuredData={{
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    name: "301 Ping",
                    applicationCategory: "BusinessApplication",
                    operatingSystem: "Web",
                    description:
                        "A URL shortener for creating and managing short links, custom URLs, click analytics, and branded QR codes.",
                    offers: {
                        "@type": "Offer",
                        price: "0",
                        priceCurrency: "USD"
                    }
                }}
            />
            <Header isAuthenticated={isAuthenticated} user={user} />

            <main className="bg-paper font-grotesk">
                <Hero />
                <BrowserExtension />
                <Features />
                <QRCodeFeature />
                <Process />
                <AccountPanel isAuthenticated={isAuthenticated} user={user} />
            </main>

            <Footer />
        </>
    )
}

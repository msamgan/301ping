import { usePage } from "@inertiajs/react"
import Header from "@/Components/Header.jsx"
import Footer from "@/Components/Footer.jsx"
import SeoHead from "@/Components/SeoHead"
import Hero from "@/Components/Home/Hero"
import BrowserExtension from "@/Components/Home/BrowserExtension"
import Features from "@/Components/Home/Features"
import QRCodeFeature from "@/Components/Home/QRCodeFeature"
import Process from "@/Components/Home/Process"
import Testimonial from "@/Components/Home/Testimonial"
import AccountPanel from "@/Components/Home/AccountPanel"
import LinkPromise from "@/Components/Home/LinkPromise"

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
export default function Welcome({ activeLinkCount }) {
    const { auth } = usePage().props
    const isAuthenticated = !!auth.user
    const user = auth.user

    return (
        <>
            <SeoHead
                title="URL Shortener & Short Links"
                description="Shorten long URLs into memorable links, create custom branded URLs, track clicks with detailed analytics, and turn links into branded QR codes. Manage every campaign from one simple dashboard."
            />
            <Header isAuthenticated={isAuthenticated} user={user} />

            <main className="bg-paper font-grotesk">
                <Hero activeLinkCount={activeLinkCount} />
                <BrowserExtension />
                <Features />
                <QRCodeFeature />
                <Process />
                <LinkPromise />
                <Testimonial />
                <AccountPanel isAuthenticated={isAuthenticated} user={user} />
            </main>

            <Footer />
        </>
    )
}

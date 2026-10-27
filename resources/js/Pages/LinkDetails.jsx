import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useToast } from "@/Components/ToastProvider"
import LinkTags from "@/Components/LinkTags"
import { downloadQrCodeWithLogo } from "@/Utils/qrCode"
import { Head, Link } from "@inertiajs/react"
import axios from "axios"
import { useState } from "react"

export default function LinkDetails({ auth, link, logos = [] }) {
    const [copied, setCopied] = useState(false)
    const [downloadingQr, setDownloadingQr] = useState(false)
    const [logoId, setLogoId] = useState(link.logo_id ? String(link.logo_id) : "")
    const [savedLogoId, setSavedLogoId] = useState(link.logo_id ? String(link.logo_id) : "")
    const [savingLogo, setSavingLogo] = useState(false)
    const showToast = useToast()

    const selectedLogo = logos.find((logo) => String(logo.id) === savedLogoId)

    const saveBranding = async () => {
        try {
            setSavingLogo(true)
            await axios.patch(route("links.logo.update", link.id), {
                logo_id: logoId === "" ? null : Number(logoId)
            })
            setSavedLogoId(logoId)
            showToast("Branding saved.", "success")
        } catch (error) {
            console.error("Failed to save branding", error)
            showToast(error.response?.data?.message || "Failed to save branding.", "error")
        } finally {
            setSavingLogo(false)
        }
    }

    const copyShortLink = async () => {
        try {
            await navigator.clipboard.writeText(link.shortened_url)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error("Clipboard copy failed", error)
        }
    }

    const downloadQrCode = async () => {
        try {
            setDownloadingQr(true)
            await downloadQrCodeWithLogo(
                link.shortened_url,
                `${link.shot_slug}-qrcode.png`,
                selectedLogo?.url || "/favicon.svg"
            )
        } catch (error) {
            console.error("Failed to generate and download QR code", error)
        } finally {
            setDownloadingQr(false)
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                            Link library
                        </p>
                        <h2 className="font-editorial text-3xl text-ink">Link details</h2>
                    </div>
                    <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                        {link.shot_slug}
                    </span>
                </div>
            }
        >
            <Head title={`Link ${link.shot_slug}`} />

            <main className="bg-paper font-grotesk text-ink">
                <section className="border-b border-line">
                    <div className="mx-auto max-w-grid px-6 py-12 md:px-10 md:py-16 lg:px-16">
                        <Link
                            href={route("links")}
                            className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted hover:text-accent"
                        >
                            ← Back to links
                        </Link>

                        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
                            <div>
                                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                    Short link
                                </p>
                                <h1 className="break-all font-editorial text-5xl leading-none sm:text-6xl">
                                    {link.shot_slug}
                                </h1>
                                <div className="mt-7 flex flex-wrap items-center gap-3">
                                    <a
                                        href={link.shortened_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="min-w-0 flex-1 basis-64 break-all border border-line bg-white px-4 py-3 font-mono text-sm text-accent hover:border-ink"
                                    >
                                        {link.shortened_url}
                                    </a>
                                    <button
                                        type="button"
                                        onClick={copyShortLink}
                                        className="w-44 border border-ink bg-ink px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-paper hover:text-ink"
                                    >
                                        {copied ? "Copied" : "Copy short link"}
                                    </button>
                                </div>
                                <div className="mt-8 border-t border-line pt-6">
                                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                                        Destination
                                    </p>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="break-all text-base leading-7 text-ink underline decoration-line underline-offset-4 hover:text-accent"
                                    >
                                        {link.url}
                                    </a>
                                </div>
                                <div className="mt-8 border-t border-line pt-6">
                                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                                        Branding
                                    </p>
                                    <p className="mb-3 text-xs text-muted">
                                        This logo will be used in the QR code.
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <select
                                            value={logoId}
                                            onChange={(e) => {
                                                setLogoId(e.target.value)
                                            }}
                                            aria-label="QR code logo"
                                            className="min-w-0 flex-1 basis-64 border border-line bg-white px-4 py-3 font-mono text-sm text-ink focus:border-ink focus:ring-0"
                                        >
                                            <option value="">Default</option>
                                            {logos.map((logo) => (
                                                <option key={logo.id} value={logo.id}>
                                                    {logo.title}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={saveBranding}
                                            disabled={savingLogo || logoId === savedLogoId}
                                            className="w-44 border border-ink bg-ink px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-paper hover:text-ink disabled:opacity-50"
                                        >
                                            {savingLogo ? "Saving..." : "Save branding"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <aside className="border border-line bg-white p-6">
                                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                                    Performance
                                </p>
                                <div className="mt-6 border-b border-line pb-5">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                                        Total visits
                                    </p>
                                    <p className="mt-2 font-grotesk text-4xl font-extrabold tabular-nums">
                                        {link.visits}
                                    </p>
                                </div>
                                <dl className="divide-y divide-line">
                                    <div className="flex justify-between gap-4 py-4">
                                        <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                            Created
                                        </dt>
                                        <dd className="font-mono text-xs">{link.created_at || "Unknown"}</dd>
                                    </div>
                                    <div className="flex justify-between gap-4 py-4">
                                        <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                            Last visited
                                        </dt>
                                        <dd className="font-mono text-xs">{link.last_visit || "Never"}</dd>
                                    </div>
                                </dl>
                                <button
                                    type="button"
                                    onClick={downloadQrCode}
                                    disabled={downloadingQr}
                                    className="mt-2 w-full border border-ink bg-ink px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-paper hover:text-ink disabled:opacity-50"
                                >
                                    {downloadingQr ? "Preparing QR code..." : "Download QR code"}
                                </button>
                            </aside>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-grid px-6 py-10 md:px-10 md:py-14 lg:px-16">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Link tags</p>
                    <LinkTags linkId={link.id} initialTags={link.tags} />
                </section>
            </main>
        </AuthenticatedLayout>
    )
}

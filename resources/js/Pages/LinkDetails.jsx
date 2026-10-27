import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useToast } from "@/Components/ToastProvider"
import LinkTags from "@/Components/LinkTags"
import { downloadQrCodeWithLogo } from "@/Utils/qrCode"
import { Head, Link } from "@inertiajs/react"
import axios from "axios"
import { useState } from "react"

export default function LinkDetails({
    auth,
    link: initialLink,
    logos = [],
    slugEditsRemaining: initialEdits = null,
    destinationEditsRemaining: initialDestinationEdits = null
}) {
    const [link, setLink] = useState(initialLink)
    const [slugInput, setSlugInput] = useState(initialLink.shot_slug)
    const [editsRemaining, setEditsRemaining] = useState(initialEdits)
    const slugLocked = editsRemaining === 0 && !link.is_slug_edited
    const [destinationEditsRemaining, setDestinationEditsRemaining] = useState(initialDestinationEdits)
    const destinationLocked = destinationEditsRemaining === 0 && !link.is_destination_edited
    const [destinationInput, setDestinationInput] = useState(initialLink.url)
    const [destinationError, setDestinationError] = useState("")
    const [savingDestination, setSavingDestination] = useState(false)
    const [slugError, setSlugError] = useState("")
    const [savingSlug, setSavingSlug] = useState(false)
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

    const saveSlug = async (e) => {
        e.preventDefault()
        setSlugError("")
        try {
            setSavingSlug(true)
            const { data } = await axios.patch(route("links.slug.update", link.id), {
                shot_slug: slugInput
            })
            setLink((prev) => ({
                ...prev,
                is_slug_edited: true,
                shot_slug: data.shot_slug,
                shortened_url: data.shortened_url
            }))
            setSlugInput(data.shot_slug)
            setEditsRemaining(data.slug_edits_remaining)
            window.history.replaceState(null, "", route("links.show", data.shot_slug))
            showToast("Short link updated.", "success")
        } catch (error) {
            if (error.response?.data?.slug_edits_remaining === 0) setEditsRemaining(0)
            setSlugError(error.response?.data?.errors?.shot_slug?.[0] || "Failed to update short link.")
        } finally {
            setSavingSlug(false)
        }
    }

    const saveDestination = async (e) => {
        e.preventDefault()
        setDestinationError("")
        try {
            setSavingDestination(true)
            const { data } = await axios.patch(route("links.destination.update", link.id), {
                url: destinationInput
            })
            setLink((prev) => ({
                ...prev,
                is_destination_edited: true,
                url: data.url
            }))
            setDestinationInput(data.url)
            setDestinationEditsRemaining(data.destination_edits_remaining)
            showToast("Destination updated.", "success")
        } catch (error) {
            if (error.response?.data?.destination_edits_remaining === 0) setDestinationEditsRemaining(0)
            setDestinationError(error.response?.data?.errors?.url?.[0] || "Failed to update destination.")
        } finally {
            setSavingDestination(false)
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
                                <form onSubmit={saveSlug} className="mt-8 border-t border-line pt-6">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                                            Customize short link
                                        </p>
                                        <Link
                                            href={route("pricing")}
                                            className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent underline underline-offset-4 hover:text-ink"
                                        >
                                            View plans
                                        </Link>
                                    </div>
                                    <p className="mb-3 text-xs text-muted">
                                        3-8 characters: letters, numbers, and - _ . ~
                                    </p>
                                    {editsRemaining !== null && (
                                        <p className="mb-3 inline-block border border-accent bg-accent/10 px-3 py-1.5 font-mono text-xs font-semibold text-accent">
                                            {`${editsRemaining} edit${editsRemaining === 1 ? "" : "s"} left for new links on your plan.`}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-3">
                                        <input
                                            type="text"
                                            value={slugInput}
                                            onChange={(e) => setSlugInput(e.target.value)}
                                            minLength={3}
                                            maxLength={8}
                                            disabled={slugLocked}
                                            aria-label="Short link slug"
                                            className="min-w-0 flex-1 basis-64 border border-line bg-white px-4 py-3 font-mono text-sm text-ink focus:border-ink focus:ring-0"
                                        />
                                        <button
                                            type="submit"
                                            disabled={savingSlug || slugLocked || slugInput === link.shot_slug}
                                            className="w-44 border border-ink bg-ink px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-paper hover:text-ink disabled:opacity-50"
                                        >
                                            {savingSlug ? "Saving..." : "Save short link"}
                                        </button>
                                    </div>
                                    {slugError && <p className="mt-2 text-xs text-red-600">{slugError}</p>}
                                </form>
                                <form onSubmit={saveDestination} className="mt-8 border-t border-line pt-6">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                                            Destination
                                        </p>
                                        <Link
                                            href={route("pricing")}
                                            className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent underline underline-offset-4 hover:text-ink"
                                        >
                                            View plans
                                        </Link>
                                    </div>
                                    {destinationEditsRemaining !== null && (
                                        <p className="mb-3 inline-block border border-accent bg-accent/10 px-3 py-1.5 font-mono text-xs font-semibold text-accent">
                                            {`${destinationEditsRemaining} destination edit${destinationEditsRemaining === 1 ? "" : "s"} left on your plan.`}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-3">
                                        <input
                                            type="url"
                                            value={destinationInput}
                                            onChange={(e) => setDestinationInput(e.target.value)}
                                            disabled={destinationLocked}
                                            aria-label="Destination URL"
                                            className="min-w-0 flex-1 basis-64 border border-line bg-white px-4 py-3 font-mono text-sm text-ink focus:border-ink focus:ring-0 disabled:bg-paper"
                                        />
                                        <button
                                            type="submit"
                                            disabled={
                                                savingDestination ||
                                                destinationLocked ||
                                                destinationInput === link.url
                                            }
                                            className="w-44 border border-ink bg-ink px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-paper hover:text-ink disabled:opacity-50"
                                        >
                                            {savingDestination ? "Saving..." : "Save destination"}
                                        </button>
                                    </div>
                                    {destinationError && (
                                        <p className="mt-2 text-xs text-red-600">{destinationError}</p>
                                    )}
                                </form>
                                <div className="mt-8 border-t border-line pt-6">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                                            Branding
                                        </p>
                                        <Link
                                            href={route("branding")}
                                            className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent underline underline-offset-4 hover:text-ink"
                                        >
                                            Manage logos
                                        </Link>
                                    </div>
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
                                    <div className="flex items-center justify-between gap-4 py-4">
                                        <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                            Health
                                        </dt>
                                        <dd>
                                            <span
                                                className={`inline-flex items-center border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${
                                                    link.health === "healthy"
                                                        ? "border-green-200 bg-green-50 text-green-800"
                                                        : link.health === "unhealthy"
                                                          ? "border-red-200 bg-red-50 text-red-800"
                                                          : link.health === "unreachable"
                                                            ? "border-amber-200 bg-amber-50 text-amber-800"
                                                            : "border-line bg-paper text-muted"
                                                }`}
                                            >
                                                {link.health || "Unknown"}
                                            </span>
                                        </dd>
                                    </div>
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

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useToast } from "@/Components/ToastProvider"
import LinkTags from "@/Components/LinkTags"
import { downloadQrCodeWithLogo } from "@/Utils/qrCode"
import { Head, Link } from "@inertiajs/react"
import axios from "axios"
import { useState } from "react"

const actionButtonClass =
    "border border-ink px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] transition-colors disabled:opacity-50"

function FieldActions({ editing, onEdit, onCancel, onSave, saving, dirty, locked, label }) {
    if (!editing) {
        return (
            <button
                key="edit"
                type="button"
                onClick={onEdit}
                disabled={locked}
                aria-label={`Edit ${label}`}
                title={locked ? "No edits remaining" : `Edit ${label}`}
                className="flex h-[46px] w-[46px] items-center justify-center border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
            </button>
        )
    }

    return (
        <>
            <button
                key="save"
                type="submit"
                onClick={onSave}
                disabled={saving || !dirty}
                className={`${actionButtonClass} bg-ink text-paper hover:bg-paper hover:text-ink`}
            >
                {saving ? "Saving..." : "Save"}
            </button>
            <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className={`${actionButtonClass} bg-paper text-ink hover:bg-ink hover:text-paper`}
            >
                Cancel
            </button>
        </>
    )
}

const PLACEHOLDER_ANALYTICS = {
    total: 1284,
    bots: 12,
    daily: Array.from({ length: 30 }, (_, i) => ({
        date: String(i),
        total: [4, 9, 6, 12, 8, 15, 11, 7, 14, 18, 10, 16, 20, 13, 9, 17, 22, 19, 12, 15][i % 20]
    })),
    countries: [
        { label: "United States", total: 540 },
        { label: "India", total: 310 },
        { label: "Germany", total: 180 },
        { label: "Brazil", total: 90 }
    ],
    devices: [
        { label: "Mobile", total: 700 },
        { label: "Desktop", total: 520 },
        { label: "Tablet", total: 64 }
    ],
    browsers: [
        { label: "Chrome", total: 800 },
        { label: "Safari", total: 300 },
        { label: "Firefox", total: 120 }
    ],
    os: [
        { label: "Android", total: 420 },
        { label: "Windows", total: 380 },
        { label: "iOS", total: 290 },
        { label: "macOS", total: 140 }
    ],
    languages: [
        { label: "en", total: 700 },
        { label: "es", total: 220 },
        { label: "de", total: 140 },
        { label: "hi", total: 90 }
    ],
    referrers: [
        { label: "twitter.com", total: 400 },
        { label: "google.com", total: 260 },
        { label: "linkedin.com", total: 140 }
    ]
}

function BreakdownCard({ title, rows }) {
    const max = Math.max(1, ...rows.map((r) => r.total))
    return (
        <div className="border border-line bg-white p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{title}</p>
            {rows.length === 0 ? (
                <p className="mt-4 text-xs text-muted">No data yet.</p>
            ) : (
                <ul className="mt-4 space-y-3">
                    {rows.map((row) => (
                        <li key={row.label}>
                            <div className="flex justify-between gap-3 font-mono text-xs">
                                <span className="truncate">{row.label}</span>
                                <span className="tabular-nums">{row.total}</span>
                            </div>
                            <div className="mt-1 h-1.5 bg-paper">
                                <div
                                    className="h-full bg-ink"
                                    style={{ width: `${(row.total / max) * 100}%` }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

const DEVICE_COLORS = ["#111111", "#6b7280", "#9ca3af", "#d1d5db", "#e5e7eb"]

function DeviceChart({ rows }) {
    const total = rows.reduce((sum, r) => sum + r.total, 0)
    let offset = 0
    const stops = rows.map((row, i) => {
        const start = offset
        offset += (row.total / total) * 100
        return `${DEVICE_COLORS[i % DEVICE_COLORS.length]} ${start}% ${offset}%`
    })

    return (
        <div className="border border-line bg-white p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Devices</p>
            {total === 0 ? (
                <p className="mt-4 text-xs text-muted">No data yet.</p>
            ) : (
                <div className="mt-4 flex flex-wrap items-center gap-8">
                    <div
                        className="relative h-40 w-40 shrink-0 rounded-full"
                        style={{ background: `conic-gradient(${stops.join(", ")})` }}
                    >
                        <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-white">
                            <span className="font-grotesk text-2xl font-extrabold tabular-nums">{total}</span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                visits
                            </span>
                        </div>
                    </div>
                    <ul className="min-w-[200px] flex-1 space-y-3">
                        {rows.map((row, i) => (
                            <li
                                key={row.label}
                                className="flex items-center justify-between gap-3 font-mono text-xs"
                            >
                                <span className="flex items-center gap-2">
                                    <span
                                        className="inline-block h-3 w-3 border border-line"
                                        style={{ background: DEVICE_COLORS[i % DEVICE_COLORS.length] }}
                                    />
                                    <span className="capitalize">{row.label}</span>
                                </span>
                                <span className="tabular-nums">
                                    {row.total} · {Math.round((row.total / total) * 100)}%
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

function AnalyticsPanel({ data }) {
    const max = Math.max(1, ...data.daily.map((d) => d.total))
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
                <div className="border border-line bg-white p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                        Tracked visits
                    </p>
                    <p className="mt-2 font-grotesk text-4xl font-extrabold tabular-nums">{data.total}</p>
                </div>
                <div className="border border-line bg-white p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Bot visits</p>
                    <p className="mt-2 font-grotesk text-4xl font-extrabold tabular-nums">{data.bots}</p>
                </div>
                <div className="border border-line bg-white p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Last 30 days</p>
                    <p className="mt-2 font-grotesk text-4xl font-extrabold tabular-nums">
                        {data.daily.reduce((sum, d) => sum + d.total, 0)}
                    </p>
                </div>
            </div>
            <div className="border border-line bg-white p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    Visits per day (30 days)
                </p>
                <div className="mt-4 flex h-32 items-end gap-1">
                    {data.daily.map((d, i) => (
                        <div
                            key={`${d.date}-${i}`}
                            title={`${d.date}: ${d.total}`}
                            className="flex-1 bg-ink"
                            style={{ height: `${Math.max(2, (d.total / max) * 100)}%` }}
                        />
                    ))}
                </div>
            </div>
            <DeviceChart rows={data.devices} />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <BreakdownCard title="Countries" rows={data.countries} />
                <BreakdownCard title="Browsers" rows={data.browsers} />
                <BreakdownCard title="Operating systems" rows={data.os} />
                <BreakdownCard title="Languages" rows={data.languages} />
                <BreakdownCard title="Referrers" rows={data.referrers} />
            </div>
        </div>
    )
}

export default function LinkDetails({
    auth,
    link: initialLink,
    logos = [],
    slugEditsRemaining: initialEdits = null,
    destinationEditsRemaining: initialDestinationEdits = null,
    canViewAnalytics = false,
    analytics = null
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
    const [editingSlug, setEditingSlug] = useState(false)
    const [editingDestination, setEditingDestination] = useState(false)
    const [editingLogo, setEditingLogo] = useState(false)
    const showToast = useToast()

    const cancelSlug = () => {
        setSlugInput(link.shot_slug)
        setSlugError("")
        setEditingSlug(false)
    }
    const cancelDestination = () => {
        setDestinationInput(link.url)
        setDestinationError("")
        setEditingDestination(false)
    }
    const cancelLogo = () => {
        setLogoId(savedLogoId)
        setEditingLogo(false)
    }

    const selectedLogo = logos.find((logo) => String(logo.id) === savedLogoId)

    const saveBranding = async () => {
        try {
            setSavingLogo(true)
            await axios.patch(route("links.logo.update", link.id), {
                logo_id: logoId === "" ? null : Number(logoId)
            })
            setSavedLogoId(logoId)
            setEditingLogo(false)
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
            setEditingSlug(false)
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
            setEditingDestination(false)
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
                                            readOnly={!editingSlug}
                                            aria-label="Short link slug"
                                            className={`min-w-0 flex-1 basis-64 border border-line px-4 py-3 font-mono text-sm text-ink focus:border-ink focus:ring-0 ${editingSlug ? "bg-white" : "bg-paper"}`}
                                        />
                                        <FieldActions
                                            editing={editingSlug}
                                            onEdit={() => setEditingSlug(true)}
                                            onCancel={cancelSlug}
                                            saving={savingSlug}
                                            dirty={slugInput !== link.shot_slug}
                                            locked={slugLocked}
                                            label="short link"
                                        />
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
                                            readOnly={!editingDestination}
                                            aria-label="Destination URL"
                                            className={`min-w-0 flex-1 basis-64 border border-line px-4 py-3 font-mono text-sm text-ink focus:border-ink focus:ring-0 ${editingDestination ? "bg-white" : "bg-paper"}`}
                                        />
                                        <FieldActions
                                            editing={editingDestination}
                                            onEdit={() => setEditingDestination(true)}
                                            onCancel={cancelDestination}
                                            saving={savingDestination}
                                            dirty={destinationInput !== link.url}
                                            locked={destinationLocked}
                                            label="destination"
                                        />
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
                                            disabled={!editingLogo}
                                            aria-label="QR code logo"
                                            className={`min-w-0 flex-1 basis-64 border border-line px-4 py-3 font-mono text-sm text-ink focus:border-ink focus:ring-0 ${editingLogo ? "bg-white" : "bg-paper"}`}
                                        >
                                            <option value="">Default</option>
                                            {logos.map((logo) => (
                                                <option key={logo.id} value={logo.id}>
                                                    {logo.title}
                                                </option>
                                            ))}
                                        </select>
                                        <FieldActions
                                            editing={editingLogo}
                                            onEdit={() => setEditingLogo(true)}
                                            onCancel={cancelLogo}
                                            onSave={(e) => {
                                                e.preventDefault()
                                                saveBranding()
                                            }}
                                            saving={savingLogo}
                                            dirty={logoId !== savedLogoId}
                                            label="branding"
                                        />
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
                                    {canViewAnalytics &&
                                        analytics &&
                                        [
                                            ["Tracked visits", analytics.total],
                                            ["Bot visits", analytics.bots],
                                            [
                                                "Last 30 days",
                                                analytics.daily.reduce((sum, d) => sum + d.total, 0)
                                            ],
                                            ["Top country", analytics.countries[0]?.label || "—"],
                                            ["Top device", analytics.devices[0]?.label || "—"],
                                            ["Top referrer", analytics.referrers[0]?.label || "—"]
                                        ].map(([label, value]) => (
                                            <div key={label} className="flex justify-between gap-4 py-4">
                                                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                                    {label}
                                                </dt>
                                                <dd className="truncate font-mono text-xs capitalize">
                                                    {value}
                                                </dd>
                                            </div>
                                        ))}
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

                <section className="mx-auto max-w-grid px-6 pt-10 md:px-10 md:pt-14 lg:px-16">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Link tags</p>
                    <LinkTags linkId={link.id} initialTags={link.tags} />
                </section>
                <section className="mx-auto max-w-grid px-6 pb-10 pt-10 md:px-10 md:pb-14 md:pt-16 lg:px-16">
                    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                        Analytics
                    </p>
                    <div className="relative">
                        <div
                            className={canViewAnalytics ? "" : "pointer-events-none select-none blur-sm"}
                            aria-hidden={!canViewAnalytics}
                        >
                            <AnalyticsPanel data={canViewAnalytics ? analytics : PLACEHOLDER_ANALYTICS} />
                        </div>
                        {!canViewAnalytics && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/50 p-6 text-center">
                                <p className="font-grotesk text-xl font-extrabold text-ink">
                                    Unlock link analytics
                                </p>
                                <p className="max-w-md text-sm text-muted">
                                    See visits over time, countries, devices, browsers and referrers by
                                    upgrading your plan.
                                </p>
                                <Link
                                    href={route("pricing")}
                                    className="border border-ink bg-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-paper hover:text-ink"
                                >
                                    Upgrade to view analytics
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </AuthenticatedLayout>
    )
}

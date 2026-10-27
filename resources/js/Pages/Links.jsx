import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx"
import UrlShortener from "@/Components/Home/UrlShortener"
import Dropdown from "@/Components/Dropdown"
import Modal from "@/Components/Modal"
import LinkTags from "@/Components/LinkTags"
import DangerButton from "@/Components/DangerButton"
import SecondaryButton from "@/Components/SecondaryButton"
import { downloadQrCodeWithLogo } from "@/Utils/qrCode"
import { Head, Link } from "@inertiajs/react"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Links({ auth }) {
    const [linksData, setLinksData] = useState(null)
    const [linksError, setLinksError] = useState("")
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [tag, setTag] = useState(() => new URLSearchParams(window.location.search).get("tag") || "")
    const [confirmingLinkDeletion, setConfirmingLinkDeletion] = useState(false)
    const [linkToDelete, setLinkToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [downloadingQrId, setDownloadingQrId] = useState(null)
    const [notification, setNotification] = useState({})
    const [animateTable, setAnimateTable] = useState(false)

    const fetchLinks = (pageNumber = 1, searchQuery = search, tagSlug = tag) => {
        setLoading(true)
        axios
            .get(route("service.links"), {
                params: {
                    page: pageNumber,
                    search: searchQuery.trim() || undefined,
                    tag: tagSlug || undefined
                }
            })
            .then(({ data }) => {
                setLinksData(data)
                setLinksError("")
            })
            .catch(() => {
                setLinksError("Links data could not be loaded. Please refresh the page.")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        setAnimateTable(true)
        fetchLinks()
    }, [])

    const filterByTag = (tagSlug) => {
        setTag(tagSlug)
        const url = new URL(window.location.href)
        if (tagSlug) url.searchParams.set("tag", tagSlug)
        else url.searchParams.delete("tag")
        window.history.pushState({}, "", url)
        fetchLinks(1, search, tagSlug)
    }

    useEffect(() => {
        const onPopState = () => {
            const slug = new URLSearchParams(window.location.search).get("tag") || ""
            setTag(slug)
            fetchLinks(1, search, slug)
        }
        window.addEventListener("popstate", onPopState)
        return () => window.removeEventListener("popstate", onPopState)
    }, [search])

    const confirmLinkDeletion = (link) => {
        setLinkToDelete(link)
        setConfirmingLinkDeletion(true)
    }

    const closeDeleteModal = () => {
        if (!deleting) {
            setConfirmingLinkDeletion(false)
            setLinkToDelete(null)
        }
    }

    const deleteLink = () => {
        if (!linkToDelete) return

        setDeleting(true)
        axios
            .delete(route("links.destroy", linkToDelete.id))
            .then(() => {
                setConfirmingLinkDeletion(false)
                setLinkToDelete(null)
                fetchLinks(paginator.current_page || 1, search, tag)
            })
            .catch(() => {
                setLinksError("Failed to delete link. Please try again.")
            })
            .finally(() => {
                setDeleting(false)
            })
    }

    const downloadQrCode = async (link) => {
        try {
            setDownloadingQrId(link.id)
            const targetUrl = link.shortened_url || link.url
            const filename = `${link.shot_slug || "link"}-qrcode.png`
            await downloadQrCodeWithLogo(targetUrl, filename, "/favicon.svg")
        } catch (error) {
            console.error("Failed to generate and download QR code", error)
        } finally {
            setDownloadingQrId(null)
        }
    }

    const submitSearch = (e) => {
        e.preventDefault()
        fetchLinks(1, search, tag)
    }

    const paginator = linksData?.links ?? {}
    const stats = linksData?.stats ?? {}
    const filters = linksData?.filters ?? {}
    const links = paginator.data ?? []
    const pageLinks = paginator.links ?? []

    const totalLinks = stats.total ?? (linksData ? 0 : "--")
    const activeLinks = totalLinks
    const totalVisits = stats.visits ?? (linksData ? 0 : "--")

    const copyToClipboard = async (url, id) => {
        try {
            await navigator.clipboard.writeText(url)
            setNotification((prev) => ({ ...prev, [id]: true }))

            window.setTimeout(() => {
                setNotification((prev) => ({ ...prev, [id]: false }))
            }, 2000)
        } catch (error) {
            console.error("Clipboard copy failed", error)
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center border border-line bg-paper">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-ink"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11 5.17M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L13 18.83"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Link library
                            </p>
                            <h2 className="font-editorial text-3xl text-ink">Links</h2>
                        </div>
                    </div>

                    <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                        01 / Inventory
                    </span>
                </div>
            }
        >
            <Head title="Links" />

            <main className="bg-paper font-grotesk text-ink">
                <section className="border-b border-line bg-paper">
                    <div className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 py-14 md:py-20">
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-3xl">
                                <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                    01 / Link library
                                </p>
                                <h1 className="font-editorial text-5xl leading-none text-ink sm:text-6xl lg:text-[5rem]">
                                    Short links,
                                    <br />
                                    ready to ship.
                                </h1>
                            </div>

                            <div className="grid grid-cols-3 gap-4 sm:gap-6">
                                <div className="border-l border-line pl-4">
                                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                                        Total
                                    </div>
                                    <div className="mt-2 font-grotesk text-2xl font-extrabold text-ink">
                                        {totalLinks}
                                    </div>
                                </div>
                                <div className="border-l border-line pl-4">
                                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                                        Active
                                    </div>
                                    <div className="mt-2 font-grotesk text-2xl font-extrabold text-ink">
                                        {activeLinks}
                                    </div>
                                </div>
                                <div className="border-l border-line pl-4">
                                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                                        Visits
                                    </div>
                                    <div className="mt-2 font-grotesk text-2xl font-extrabold text-ink">
                                        {totalVisits}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-line bg-paper">
                    <div className="mx-auto max-w-grid px-6 py-12 md:px-10 md:py-16 lg:px-16">
                        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-20">
                            <div>
                                <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                    02 / Create link
                                </p>
                                <h2 className="font-editorial text-4xl leading-none text-ink sm:text-5xl">
                                    Shorten a new URL.
                                </h2>
                                <p className="mt-5 max-w-md text-sm leading-6 text-muted">
                                    Turn a long URL into a link that is ready to share and track.
                                </p>
                            </div>

                            <UrlShortener onSuccess={() => fetchLinks(1, search, tag)} />
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 py-12 md:py-20">
                    {linksError && (
                        <p
                            className="mb-6 border border-line bg-paper p-4 font-mono text-sm text-accent-dark"
                            role="alert"
                        >
                            {linksError}
                        </p>
                    )}

                    <form onSubmit={submitSearch} className="mb-6 flex gap-2 sm:max-w-lg">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by URL or short slug…"
                            aria-label="Search links"
                            className="w-full border border-line bg-paper px-4 py-3 font-mono text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-0"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="border border-ink bg-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-paper hover:bg-paper hover:text-ink disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </form>

                    {tag && (
                        <p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                            Tag: <span className="text-ink">{tag}</span>
                            <button
                                type="button"
                                onClick={() => filterByTag("")}
                                className="underline hover:text-accent"
                            >
                                Clear
                            </button>
                        </p>
                    )}

                    {linksData === null ? (
                        <div className="border border-line bg-paper px-6 py-12 text-center">
                            <p className="font-grotesk text-xl text-ink">Loading links...</p>
                        </div>
                    ) : links.length === 0 ? (
                        <div className="border border-line bg-paper px-6 py-12 text-center">
                            <p className="font-grotesk text-xl text-ink">
                                {filters.search || filters.tag
                                    ? "No links match your search."
                                    : "No links created yet."}
                            </p>
                            <p className="mt-2 text-sm text-muted">
                                {filters.search || filters.tag
                                    ? "Try a different URL or slug."
                                    : "Start by shortening a URL from the home page and it will appear here."}
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                03 / Link Data
                            </p>
                            <div className="border border-line bg-paper">
                                <div className="overflow-x-auto md:overflow-visible">
                                    <table className="min-w-full border-collapse">
                                        <thead className="bg-ink text-paper">
                                            <tr>
                                                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-paper/80">
                                                    Original
                                                </th>
                                                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-paper/80">
                                                    Short link
                                                </th>
                                                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-paper/80">
                                                    Visits
                                                </th>
                                                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-paper/80">
                                                    Last visited
                                                </th>
                                                <th className="px-5 py-4 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-paper/80">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-line bg-paper">
                                            {links.map((link, index) => {
                                                const rowId =
                                                    link.id ?? `${link.shortened_url ?? "short"}-${index}`
                                                const status =
                                                    (link.status || "Active").toLowerCase() === "active"
                                                        ? "Active"
                                                        : "Inactive"
                                                const isActive = status === "Active"

                                                return (
                                                    <tr
                                                        key={rowId}
                                                        className={`relative transition-all duration-300 focus-within:z-20 hover:z-10 ${
                                                            animateTable
                                                                ? "translate-y-0 opacity-100"
                                                                : "translate-y-4 opacity-0"
                                                        }`}
                                                        style={{ transitionDelay: `${index * 50}ms` }}
                                                    >
                                                        <td className="max-w-[26rem] px-5 py-5 align-top">
                                                            <a
                                                                href={link.url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="block break-all font-grotesk text-sm text-ink underline decoration-line decoration-1 underline-offset-4 hover:text-accent"
                                                            >
                                                                {link.url}
                                                            </a>
                                                            <LinkTags
                                                                linkId={link.id}
                                                                initialTags={link.tags ?? []}
                                                                onTagClick={(t) => filterByTag(t.slug)}
                                                            />
                                                        </td>

                                                        <td className="px-5 py-5 align-top">
                                                            <div className="inline-flex items-center border border-line bg-paper transition-colors hover:border-ink hover:bg-white">
                                                                <Link
                                                                    href={route("links.show", link.shot_slug)}
                                                                    className="px-3 py-2 font-mono text-sm text-ink hover:text-accent"
                                                                >
                                                                    {link.shot_slug}
                                                                </Link>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        copyToClipboard(
                                                                            link.shortened_url,
                                                                            rowId
                                                                        )
                                                                    }
                                                                    aria-label={`Copy short link ${link.shot_slug}`}
                                                                    className="group border-l border-line px-2 py-2 transition-colors hover:bg-white"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        aria-hidden="true"
                                                                        className={`h-4 w-4 transition-colors ${
                                                                            notification[rowId]
                                                                                ? "text-accent"
                                                                                : "text-muted group-hover:text-ink"
                                                                        }`}
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                        strokeWidth={1.8}
                                                                    >
                                                                        {notification[rowId] ? (
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M5 13l4 4L19 7"
                                                                            />
                                                                        ) : (
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M9 9.75A2.25 2.25 0 0 1 11.25 7.5h6A2.25 2.25 0 0 1 19.5 9.75v6A2.25 2.25 0 0 1 17.25 18h-6A2.25 2.25 0 0 1 9 15.75v-6Zm-4.5 1.5A2.25 2.25 0 0 1 6.75 9h6A2.25 2.25 0 0 1 15 11.25v6A2.25 2.25 0 0 1 12.75 19.5h-6A2.25 2.25 0 0 1 4.5 17.25v-6Z"
                                                                            />
                                                                        )}
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>

                                                        <td className="px-5 py-5 align-top text-sm text-ink">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                                                                    Views
                                                                </span>
                                                                <span className="font-grotesk text-base font-semibold">
                                                                    {link.visits || 0}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td className="px-5 py-5 align-top text-sm text-muted">
                                                            {link.last_visit || "Never"}
                                                        </td>

                                                        <td className="px-5 py-5 align-top text-right">
                                                            <div className="flex justify-end">
                                                                <Dropdown>
                                                                    <Dropdown.Trigger>
                                                                        <button
                                                                            type="button"
                                                                            aria-label="Link actions"
                                                                            className="inline-flex h-8 w-8 items-center justify-center border border-line bg-paper text-ink transition-colors hover:border-ink hover:bg-white focus:outline-none"
                                                                        >
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                className="h-4 w-4"
                                                                                viewBox="0 0 24 24"
                                                                                fill="currentColor"
                                                                                aria-hidden="true"
                                                                            >
                                                                                <circle cx="12" cy="5" r="2" />
                                                                                <circle cx="12" cy="12" r="2" />
                                                                                <circle cx="12" cy="19" r="2" />
                                                                            </svg>
                                                                        </button>
                                                                    </Dropdown.Trigger>
                                                                    <Dropdown.Content
                                                                        align="right"
                                                                        width="64"
                                                                        contentClasses="bg-paper shadow-lg divide-y divide-line"
                                                                    >
                                                                        <Dropdown.Link
                                                                            href={route(
                                                                                "links.show",
                                                                                link.shot_slug
                                                                            )}
                                                                            className="font-grotesk text-xs uppercase tracking-[0.08em] font-semibold"
                                                                        >
                                                                            View details
                                                                        </Dropdown.Link>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => downloadQrCode(link)}
                                                                            disabled={
                                                                                downloadingQrId === link.id
                                                                            }
                                                                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-grotesk text-xs uppercase tracking-[0.08em] font-semibold text-ink transition-colors hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none disabled:opacity-50"
                                                                        >
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                className="h-4 w-4 flex-shrink-0 text-ink"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                stroke="currentColor"
                                                                                strokeWidth={1.8}
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
                                                                                />
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    d="M6.75 6.75h.008v.008H6.75V6.75ZM6.75 16.5h.008v.008H6.75V16.5ZM16.5 6.75h.008v.008H16.5V6.75ZM13.5 13.5h3v3h-3v-3ZM16.5 16.5h3v3h-3v-3ZM13.5 19.5h3v.75h-3v-.75ZM19.5 13.5h.75v3h-.75v-3Z"
                                                                                />
                                                                            </svg>
                                                                            <span>
                                                                                {downloadingQrId === link.id
                                                                                    ? "Downloading..."
                                                                                    : "Download QR code"}
                                                                            </span>
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                confirmLinkDeletion(link)
                                                                            }
                                                                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-grotesk text-xs uppercase tracking-[0.08em] font-semibold text-accent transition-colors hover:bg-red-50 focus:bg-red-50 focus:outline-none"
                                                                        >
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                className="h-4 w-4 flex-shrink-0"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                stroke="currentColor"
                                                                                strokeWidth={1.8}
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                                />
                                                                            </svg>
                                                                            <span>Delete</span>
                                                                        </button>
                                                                    </Dropdown.Content>
                                                                </Dropdown>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {paginator.last_page > 1 && (
                                <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                        Showing {paginator.from}–{paginator.to} of {paginator.total}
                                    </p>
                                    <nav className="flex flex-wrap gap-1">
                                        {pageLinks.map((item, i) => {
                                            const label = item.label
                                                .replace("&laquo;", "«")
                                                .replace("&raquo;", "»")
                                                .replace("Previous", "Prev")
                                            const base =
                                                "border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em]"
                                            if (!item.url) {
                                                return (
                                                    <span
                                                        key={i}
                                                        className={`${base} border-line text-muted/50`}
                                                    >
                                                        {label}
                                                    </span>
                                                )
                                            }

                                            let pageNum = 1
                                            try {
                                                const parsedUrl = new URL(item.url, window.location.origin)
                                                pageNum = parsedUrl.searchParams.get("page") || 1
                                            } catch {
                                                pageNum = 1
                                            }

                                            return (
                                                <button
                                                    type="button"
                                                    key={i}
                                                    onClick={() => fetchLinks(pageNum, search, tag)}
                                                    className={`${base} ${
                                                        item.active
                                                            ? "border-ink bg-ink text-paper"
                                                            : "border-line text-ink hover:border-ink hover:bg-white"
                                                    }`}
                                                >
                                                    {label}
                                                </button>
                                            )
                                        })}
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>

            <Modal show={confirmingLinkDeletion} onClose={closeDeleteModal} maxWidth="md">
                <div className="border-t-4 border-accent bg-paper p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-accent bg-paper text-accent">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                                Confirm deletion
                            </p>
                            <h3 className="font-editorial text-2xl text-ink">Delete link</h3>
                        </div>
                    </div>

                    <p className="font-grotesk text-sm text-muted">
                        Are you sure you want to delete this short link? Any traffic to this URL will no longer
                        be redirected. This action cannot be undone.
                    </p>

                    {linkToDelete && (
                        <div className="my-4 border border-line bg-white p-3 font-mono text-xs">
                            <div className="text-muted">Target:</div>
                            <div className="truncate text-ink">{linkToDelete.url}</div>
                            <div className="mt-1 text-muted">Short:</div>
                            <div className="text-accent">{linkToDelete.shot_slug}</div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeDeleteModal} disabled={deleting}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={deleteLink} disabled={deleting}>
                            {deleting ? "Deleting…" : "Delete link"}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    )
}

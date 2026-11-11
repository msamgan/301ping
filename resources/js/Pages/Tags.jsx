import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx"
import ArrowIcon from "@/Components/Home/ArrowIcon"
import Dropdown from "@/Components/Dropdown"
import Modal from "@/Components/Modal"
import DangerButton from "@/Components/DangerButton"
import SecondaryButton from "@/Components/SecondaryButton"
import { Link } from "@inertiajs/react"
import SeoHead from "@/Components/SeoHead"
import { useEffect, useState } from "react"
import axios from "axios"

const errorMessage = (error, fallback) =>
    error?.response?.data?.errors?.name?.[0] || error?.response?.data?.message || fallback

export default function Tags({ auth }) {
    const [tagsData, setTagsData] = useState(null)
    const [tagsError, setTagsError] = useState("")
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [animateTable, setAnimateTable] = useState(false)

    const [name, setName] = useState("")
    const [formError, setFormError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const [tagToEdit, setTagToEdit] = useState(null)

    const [tagToDelete, setTagToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const fetchTags = (pageNumber = 1, searchQuery = search) => {
        setLoading(true)
        axios
            .get(route("service.tags"), {
                params: {
                    page: pageNumber,
                    search: searchQuery.trim() || undefined
                }
            })
            .then(({ data }) => {
                setTagsData(data)
                setTagsError("")
            })
            .catch(() => {
                setTagsError("Tags data could not be loaded. Please refresh the page.")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        setAnimateTable(true)
        fetchTags()
    }, [])

    const paginator = tagsData?.tags ?? {}
    const stats = tagsData?.stats ?? {}
    const filters = tagsData?.filters ?? {}
    const tags = paginator.data ?? []
    const pageLinks = paginator.links ?? []
    const totalTags = stats.total ?? (tagsData ? 0 : "--")

    const submitSearch = (e) => {
        e.preventDefault()
        fetchTags(1, search)
    }

    const resetForm = () => {
        setTagToEdit(null)
        setName("")
        setFormError(null)
    }

    const saveTag = (e) => {
        e.preventDefault()
        setFormError(null)

        if (!name.trim()) {
            setFormError("A tag name is required.")
            return
        }

        const editing = tagToEdit
        const request = editing
            ? axios.patch(route("service.tags.update", editing.id), { name: name.trim() })
            : axios.post(route("service.tags.store"), { name: name.trim() })

        setSubmitting(true)
        request
            .then(() => {
                resetForm()
                fetchTags(editing ? paginator.current_page || 1 : 1, search)
            })
            .catch((error) =>
                setFormError(
                    errorMessage(
                        error,
                        editing
                            ? "Failed to update tag. Please try again."
                            : "Something went wrong. Please try again."
                    )
                )
            )
            .finally(() => setSubmitting(false))
    }

    const openEdit = (tag) => {
        setTagToEdit(tag)
        setName(tag.name)
        setFormError(null)
        document.getElementById("tag-name")?.scrollIntoView({ behavior: "smooth", block: "center" })
        document.getElementById("tag-name")?.focus()
    }

    const closeDelete = () => {
        if (!deleting) setTagToDelete(null)
    }

    const deleteTag = () => {
        if (!tagToDelete) return

        setDeleting(true)
        axios
            .delete(route("service.tags.destroy", tagToDelete.id))
            .then(() => {
                setTagToDelete(null)
                if (tagToEdit?.id === tagToDelete.id) resetForm()
                const page = paginator.current_page || 1
                fetchTags(tags.length === 1 && page > 1 ? page - 1 : page, search)
            })
            .catch(() => {
                setTagToDelete(null)
                setTagsError("Failed to delete tag. Please try again.")
            })
            .finally(() => setDeleting(false))
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
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Tag library
                            </p>
                            <h2 className="font-editorial text-3xl text-ink">Tags</h2>
                        </div>
                    </div>

                    <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                        01 / Inventory
                    </span>
                </div>
            }
        >
            <SeoHead
                title="Tags"
                description="Manage your reusable tags and use them to organize short links by campaign, client, or channel. Keep your link library structured so related URLs are easy to find and maintain."
                noindex
            />

            <main className="bg-paper font-grotesk text-ink">
                <section className="border-b border-line bg-paper">
                    <div className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 py-14 md:py-20">
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-3xl">
                                <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                    01 / Tag library
                                </p>
                                <h1 className="font-editorial text-5xl leading-none text-ink sm:text-6xl lg:text-[5rem]">
                                    Tags to keep
                                    <br />
                                    links organized.
                                </h1>
                            </div>

                            <div className="border-l border-line pl-4">
                                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                                    Total
                                </div>
                                <div className="mt-2 font-grotesk text-2xl font-extrabold text-ink">
                                    {totalTags}
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
                                    02 / {tagToEdit ? "Edit tag" : "Create tag"}
                                </p>
                                <h2 className="font-editorial text-4xl leading-none text-ink sm:text-5xl">
                                    {tagToEdit ? "Update this tag." : "Add a new tag."}
                                </h2>
                                <p className="mt-5 max-w-md text-sm leading-6 text-muted">
                                    Give your tag a short, memorable name so it is easy to find later.
                                </p>
                            </div>

                            <div className="w-full">
                                <form onSubmit={saveTag} noValidate>
                                    <label
                                        htmlFor="tag-name"
                                        className="block font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-3"
                                    >
                                        {tagToEdit ? `Editing "${tagToEdit.name}"` : "Tag name"}
                                    </label>

                                    <div className="border-t-2 border-ink" />
                                    <div className="flex items-end gap-4 py-4 border-b border-line focus-within:border-b-2 focus-within:border-accent focus-within:pb-[15px] transition-[padding,border] duration-200">
                                        <input
                                            type="text"
                                            id="tag-name"
                                            name="name"
                                            autoComplete="off"
                                            placeholder="e.g. marketing"
                                            maxLength={255}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            aria-invalid={!!formError}
                                            className="w-full min-w-0 border-0 bg-transparent p-0 font-mono text-base sm:text-lg text-ink placeholder:text-muted/70 focus:ring-0 focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="group shrink-0 inline-flex items-center gap-2 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-ink hover:text-accent-dark disabled:opacity-50 disabled:cursor-wait transition-colors py-1"
                                        >
                                            {tagToEdit
                                                ? submitting
                                                    ? "Updating"
                                                    : "Update"
                                                : submitting
                                                  ? "Creating"
                                                  : "Create"}
                                            <ArrowIcon />
                                        </button>
                                        {tagToEdit && (
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                disabled={submitting}
                                                className="shrink-0 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-muted hover:text-ink transition-colors py-1"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>

                                {formError && (
                                    <p role="alert" className="mt-4 font-mono text-sm text-accent-dark">
                                        {"// error: " + formError}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 py-12 md:py-20">
                    {tagsError && (
                        <p
                            className="mb-6 border border-line bg-paper p-4 font-mono text-sm text-accent-dark"
                            role="alert"
                        >
                            {tagsError}
                        </p>
                    )}

                    <form onSubmit={submitSearch} className="mb-6 flex gap-2 sm:max-w-lg">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or slug…"
                            aria-label="Search tags"
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

                    {tagsData === null ? (
                        <div className="border border-line bg-paper px-6 py-12 text-center">
                            <p className="font-grotesk text-xl text-ink">Loading tags...</p>
                        </div>
                    ) : tags.length === 0 ? (
                        <div className="border border-line bg-paper px-6 py-12 text-center">
                            <p className="font-grotesk text-xl text-ink">
                                {filters.search ? "No tags match your search." : "No tags created yet."}
                            </p>
                            <p className="mt-2 text-sm text-muted">
                                {filters.search
                                    ? "Try a different name or slug."
                                    : "Create your first tag above and it will appear here."}
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                03 / Tag Data
                            </p>
                            <div className="border border-line bg-paper">
                                <div className="overflow-x-auto md:overflow-visible">
                                    <table className="min-w-full border-collapse">
                                        <thead className="bg-ink text-paper">
                                            <tr>
                                                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-paper/80">
                                                    Name
                                                </th>
                                                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-paper/80">
                                                    Links
                                                </th>
                                                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-paper/80">
                                                    Created
                                                </th>
                                                <th className="px-5 py-4 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-paper/80">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-line bg-paper">
                                            {tags.map((tag, index) => (
                                                <tr
                                                    key={tag.id}
                                                    className={`relative transition-all duration-300 focus-within:z-20 hover:z-10 ${
                                                        animateTable
                                                            ? "translate-y-0 opacity-100"
                                                            : "translate-y-4 opacity-0"
                                                    }`}
                                                    style={{ transitionDelay: `${index * 50}ms` }}
                                                >
                                                    <td className="px-5 py-5 align-top font-grotesk text-sm text-ink">
                                                        {tag.name}
                                                    </td>
                                                    <td className="px-5 py-5 align-top text-sm text-ink">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                                                                Links
                                                            </span>
                                                            <span className="font-grotesk text-base font-semibold">
                                                                {tag.links_count ?? 0}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-5 align-top text-sm text-muted">
                                                        {tag.created_at}
                                                    </td>
                                                    <td className="px-5 py-5 align-top text-right">
                                                        <div className="flex justify-end">
                                                            <Dropdown>
                                                                <Dropdown.Trigger>
                                                                    <button
                                                                        type="button"
                                                                        aria-label="Tag actions"
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
                                                                    width="36"
                                                                    contentClasses="bg-paper shadow-lg"
                                                                >
                                                                    <Link
                                                                        href={`${route("links")}?tag=${encodeURIComponent(tag.slug)}`}
                                                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-grotesk text-xs uppercase tracking-[0.08em] font-semibold text-ink transition-colors hover:bg-white focus:bg-white focus:outline-none"
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
                                                                                d="M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.07 0l-3 3A5 5 0 0011 21.07l1.71-1.71"
                                                                            />
                                                                        </svg>
                                                                        <span>Links</span>
                                                                    </Link>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openEdit(tag)}
                                                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-grotesk text-xs uppercase tracking-[0.08em] font-semibold text-ink transition-colors hover:bg-white focus:bg-white focus:outline-none"
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
                                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                            />
                                                                        </svg>
                                                                        <span>Edit</span>
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setTagToDelete(tag)}
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
                                            ))}
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
                                                    onClick={() => fetchTags(pageNum, search)}
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

            <Modal show={!!tagToDelete} onClose={closeDelete} maxWidth="md">
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
                            <h3 className="font-editorial text-2xl text-ink">Delete tag</h3>
                        </div>
                    </div>

                    <p className="font-grotesk text-sm text-muted">
                        Are you sure you want to delete this tag? This action cannot be undone.
                    </p>

                    {tagToDelete && (
                        <div className="my-4 border border-line bg-white p-3 font-mono text-xs">
                            <div className="text-muted">Name:</div>
                            <div className="truncate text-ink">{tagToDelete.name}</div>
                            <div className="mt-1 text-muted">Slug:</div>
                            <div className="text-accent">{tagToDelete.slug}</div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeDelete} disabled={deleting}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={deleteTag} disabled={deleting}>
                            {deleting ? "Deleting…" : "Delete tag"}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    )
}

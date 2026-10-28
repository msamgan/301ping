import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import DangerButton from "@/Components/DangerButton"
import Modal from "@/Components/Modal"
import SecondaryButton from "@/Components/SecondaryButton"
import PrimaryButton from "@/Components/PrimaryButton"
import TextInput from "@/Components/TextInput"
import { Link, router, useForm } from "@inertiajs/react"
import { useEffect, useRef, useState } from "react"
import { renderQrCodeToCanvas } from "@/Utils/qrCode"

const MIN = 200
const MAX = 4000
const MAX_BYTES = 2 * 1024 * 1024
const TYPES = ["image/png", "image/jpeg", "image/webp"]

const readDimensions = (file) =>
    new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight })
            URL.revokeObjectURL(url)
        }
        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject()
        }
        img.src = url
    })

function QrPreview({ logoSrc, label }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (canvasRef.current) {
            renderQrCodeToCanvas(canvasRef.current, "https://301p.ing", logoSrc, 768).catch(() => {})
        }
    }, [logoSrc])

    return (
        <div className="flex items-center justify-center p-3">
            <canvas
                ref={canvasRef}
                role="img"
                aria-label={`QR code preview with ${label}`}
                className="aspect-square w-full max-w-[264px] bg-white"
            />
        </div>
    )
}

export default function BrandingForm({ logos = [], logoLimit = 0, className = "" }) {
    const fileInput = useRef(null)
    const [fileError, setFileError] = useState(null)
    const { data, setData, post, errors, processing, reset } = useForm({ title: "", logo: null })

    const canUpload = logoLimit === null || logos.length < logoLimit

    const [previewUrl, setPreviewUrl] = useState(null)
    useEffect(() => {
        if (!data.logo) {
            setPreviewUrl(null)
            return
        }
        const url = URL.createObjectURL(data.logo)
        setPreviewUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [data.logo])

    const onFile = async (e) => {
        const file = e.target.files[0]
        setFileError(null)
        setData("logo", null)
        if (!file) return

        let error = null
        if (!TYPES.includes(file.type)) {
            error = "Logo must be a PNG, JPG or WebP image."
        } else if (file.size > MAX_BYTES) {
            error = "Logo may not be larger than 2 MB."
        } else {
            try {
                const { width, height } = await readDimensions(file)
                if (width < MIN || height < MIN || width > MAX || height > MAX) {
                    error = `Logo must be between ${MIN}x${MIN} and ${MAX}x${MAX} pixels (got ${width}x${height}).`
                }
            } catch {
                error = "Unable to read this image."
            }
        }

        if (error) {
            setFileError(error)
            e.target.value = ""
            return
        }
        setData("logo", file)
    }

    const submit = (e) => {
        e.preventDefault()
        post(route("logos.store"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset()
                if (fileInput.current) fileInput.current.value = ""
            }
        })
    }

    const [logoToDelete, setLogoToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const closeDelete = () => {
        if (!deleting) setLogoToDelete(null)
    }

    const deleteLogo = () => {
        router.delete(route("logos.destroy", logoToDelete.id), {
            preserveScroll: true,
            onStart: () => setDeleting(true),
            onFinish: () => {
                setDeleting(false)
                setLogoToDelete(null)
            }
        })
    }

    return (
        <section className={className}>
            <header className="mb-6 max-w-2xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Branding</p>
                <h2 className="mt-2 font-editorial text-3xl text-ink">Your Logos</h2>
                <p className="mt-2 max-w-lg text-sm text-muted">
                    <span className="bg-ink px-1.5 py-0.5 font-semibold text-paper">
                        {logoLimit === null
                            ? "Your plan allows multiple logos."
                            : logoLimit === 1
                              ? "Your plan allows one logo."
                              : "Logos require a Redirect plan."}
                    </span>
                </p>
            </header>

            {logoLimit === 0 ? (
                <Link
                    href={route("pricing")}
                    className="inline-block border border-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-ink hover:bg-ink hover:text-paper"
                >
                    View plans
                </Link>
            ) : (
                <>
                    {canUpload ? (
                        <form onSubmit={submit} className="flex flex-col gap-8 lg:flex-row">
                            <div className="w-full max-w-2xl flex-shrink-0 space-y-6">
                                <div>
                                    <InputLabel htmlFor="logo_title" value="Title" />
                                    <TextInput
                                        id="logo_title"
                                        className="mt-2"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.title} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="logo_file" value="Logo file" />
                                    <input
                                        id="logo_file"
                                        ref={fileInput}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={onFile}
                                        aria-describedby="logo-file-help"
                                        aria-invalid={Boolean(fileError || errors.logo)}
                                        className="peer sr-only"
                                    />
                                    <label
                                        htmlFor="logo_file"
                                        className="group mt-2 flex cursor-pointer items-center gap-4 border border-dashed border-line bg-white p-4 transition-colors hover:border-ink hover:bg-ink/[0.02] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink sm:p-5"
                                    >
                                        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-line bg-paper text-ink">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.75}
                                            >
                                                {data.logo ? (
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                ) : (
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 16V4m0 0L7 9m5-5l5 5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"
                                                    />
                                                )}
                                            </svg>
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-semibold text-ink">
                                                {data.logo ? data.logo.name : "Choose a logo to upload"}
                                            </span>
                                            <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                                {data.logo
                                                    ? `${(data.logo.size / 1024 / 1024).toFixed(2)} MB · Ready to upload`
                                                    : "PNG, JPG or WebP · Max 2 MB"}
                                            </span>
                                        </span>
                                        <span className="flex-shrink-0 border border-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink transition-colors group-hover:bg-ink group-hover:text-paper">
                                            Browse
                                        </span>
                                    </label>
                                    <p id="logo-file-help" className="mt-2 text-xs text-muted">
                                        Select an image between {MIN} × {MIN} and {MAX} × {MAX} pixels.
                                    </p>
                                    <InputError className="mt-2" message={fileError || errors.logo} />
                                </div>
                                <PrimaryButton disabled={processing || !data.logo}>Upload logo</PrimaryButton>
                            </div>
                            {previewUrl && (
                                <div className="flex-shrink-0 self-center sm:self-start">
                                    <QrPreview logoSrc={previewUrl} label="selected logo" />
                                </div>
                            )}
                        </form>
                    ) : (
                        <p className="border border-line p-4 text-sm text-muted">
                            You have reached your plan&apos;s logo limit. Delete a logo to upload another or
                            review available plans.{" "}
                            <Link href={route("pricing")} className="font-semibold text-ink underline">
                                View plans
                            </Link>
                        </p>
                    )}

                    {logos.length > 0 && (
                        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {logos.map((logo) => (
                                <li key={logo.id} className="border border-line p-3">
                                    <QrPreview logoSrc={logo.url} label={logo.title} />
                                    <div className="mt-3 flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-ink">
                                                {logo.title}
                                            </p>
                                            <p className="font-mono text-[10px] text-muted">
                                                {logo.width}x{logo.height}
                                            </p>
                                        </div>
                                        {logo.can_delete ? (
                                            <button
                                                type="button"
                                                onClick={() => setLogoToDelete(logo)}
                                                className="font-mono text-[11px] uppercase tracking-[0.18em] text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        ) : (
                                            <span
                                                title="This logo has been used on a link and can not be deleted."
                                                className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
                                            >
                                                In use
                                            </span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}

            <Modal show={!!logoToDelete} onClose={closeDelete} maxWidth="md">
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
                            <h3 className="font-editorial text-2xl text-ink">Delete logo</h3>
                        </div>
                    </div>

                    <p className="font-grotesk text-sm text-muted">
                        Are you sure you want to delete this logo? This action cannot be undone.
                    </p>

                    {logoToDelete && (
                        <div className="my-4 border border-line bg-white p-3 font-mono text-xs">
                            <div className="text-muted">Title:</div>
                            <div className="truncate text-ink">{logoToDelete.title}</div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeDelete} disabled={deleting}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={deleteLogo} disabled={deleting}>
                            {deleting ? "Deleting…" : "Delete logo"}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </section>
    )
}

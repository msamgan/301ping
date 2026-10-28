import { useState } from "react"
import ArrowIcon from "@/Components/Home/ArrowIcon"

/**
 * The core product interaction. Same request/response contract as before
 * (POST service.shorten -> { short_url }), redesigned as a single
 * typographic instrument instead of a rounded "SaaS card".
 */
export default function UrlShortener({ onSuccess } = {}) {
    const [url, setUrl] = useState("")
    const [error, setError] = useState(null)
    const [shortUrl, setShortUrl] = useState(null)
    const [copied, setCopied] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setError(null)
        setShortUrl(null)

        if (!url) {
            setError("A URL is required.")
            setTimeout(() => setError(null), 3000)
            return
        }

        try {
            const parsed = new URL(url)
            setSubmitting(true)
            axios
                .post(route("service.shorten"), { url: parsed.href })
                .then((response) => {
                    setShortUrl(response.data.short_url)
                    if (onSuccess) {
                        onSuccess(response.data)
                    }
                })
                .catch(() => {
                    setError("Something went wrong. Please try again.")
                    setTimeout(() => setError(null), 3000)
                })
                .finally(() => setSubmitting(false))
        } catch (e) {
            setError("That doesn't look like a valid URL.")
            setTimeout(() => setError(null), 3000)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} noValidate>
                <label
                    htmlFor="url"
                    className="block font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-3"
                >
                    Paste URL
                </label>

                <div className="border-t-2 border-ink" />
                <div className="flex items-end gap-4 py-4 border-b border-line focus-within:border-b-2 focus-within:border-accent focus-within:pb-[15px] transition-[padding,border] duration-200">
                    <input
                        type="text"
                        name="url"
                        id="url"
                        inputMode="url"
                        autoComplete="off"
                        placeholder="https://your-long-url.com/..."
                        aria-describedby={error ? "url-error" : undefined}
                        aria-invalid={!!error}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="peer w-full min-w-0 border-0 bg-transparent p-0 font-mono text-base sm:text-lg text-ink placeholder:text-muted/70 focus:ring-0 focus:outline-none"
                        autoFocus={true}
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className="group shrink-0 inline-flex items-center gap-2 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-ink hover:text-accent-dark disabled:opacity-50 disabled:cursor-wait transition-colors py-1"
                    >
                        {submitting ? "Shortening" : "Shorten"}
                        <ArrowIcon />
                    </button>
                </div>
            </form>

            <div
                role="alert"
                className={`grid transition-all duration-300 ease-out ${
                    error ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">
                    <p id="url-error" className="font-mono text-sm text-accent-dark">
                        {"// error: " + error}
                    </p>
                </div>
            </div>

            <div
                className={`grid transition-all duration-500 ease-out ${
                    shortUrl ? "grid-rows-[1fr] opacity-100 mt-8" : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="border-t-2 border-ink pt-4">
                        <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-2">
                            Short URL
                        </span>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
                            <a
                                href={shortUrl ?? "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="font-mono text-lg sm:text-xl text-ink hover:text-accent-dark break-all underline decoration-line decoration-1 underline-offset-4 hover:decoration-accent transition-colors"
                            >
                                {shortUrl}
                            </a>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="group shrink-0 inline-flex items-center gap-2 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-ink hover:text-accent-dark transition-colors"
                            >
                                {copied ? "Copied" : "Copy"}
                                <ArrowIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

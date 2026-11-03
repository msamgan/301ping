import { useState } from "react"

export default function CopyLinkButton({ url, primary = false }) {
    const [copyState, setCopyState] = useState("idle")

    const shorten = async () => {
        const { data } = await axios.post(route("service.shorten"), { url })
        return data.short_url
    }

    const copyLink = async () => {
        if (copyState === "loading") return

        setCopyState("loading")

        try {
            if (window.ClipboardItem && navigator.clipboard?.write) {
                // Passing a promise keeps the copy tied to the click gesture (needed by Safari).
                const text = shorten().then((shortUrl) => new Blob([shortUrl], { type: "text/plain" }))
                await navigator.clipboard.write([new ClipboardItem({ "text/plain": text })])
            } else {
                await navigator.clipboard.writeText(await shorten())
            }
            setCopyState("copied")
        } catch {
            setCopyState("error")
        }

        window.setTimeout(() => setCopyState("idle"), 2000)
    }

    const label =
        {
            loading: "Creating short link…",
            copied: "Short link copied",
            error: "Could not copy link"
        }[copyState] ?? "Copy link"

    return (
        <button
            type="button"
            disabled={copyState === "loading"}
            onClick={copyLink}
            aria-label={label}
            title={label}
            className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 border px-3 text-sm font-semibold uppercase tracking-[0.08em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                primary
                    ? "border-ink bg-ink text-paper hover:border-accent-dark hover:bg-accent-dark"
                    : "w-10 border-line p-0 text-ink hover:border-ink hover:bg-ink hover:text-paper"
            }`}
        >
            {copyState === "copied" ? (
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path
                        d="m3.5 8.5 3 3 6-7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ) : (
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
                    <rect x="5.5" y="5.5" width="7" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" />
                    <path
                        d="M10.5 5.5V3.8a1 1 0 0 0-1-1h-5a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1"
                        stroke="currentColor"
                        strokeWidth="1.3"
                    />
                </svg>
            )}
            <span className="sr-only" aria-live="polite">
                {label}
            </span>
            {primary && (
                <span>
                    {copyState === "copied" ? "Copied" : copyState === "loading" ? "Copying…" : "Copy link"}
                </span>
            )}
        </button>
    )
}

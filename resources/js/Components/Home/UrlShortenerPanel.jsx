import UrlShortener from "@/Components/Home/UrlShortener"

export default function UrlShortenerPanel({ onSuccess }) {
    return (
        <div>
            <div className="relative isolate border border-ink bg-white p-5 sm:p-6">
                <div
                    className="absolute -bottom-2 left-2 right-[-8px] top-2 -z-10 bg-accent"
                    aria-hidden="true"
                />
                <p className="mb-5 flex items-center justify-between gap-4 border-b border-line pb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-black">
                    <span>Start here</span>
                    <span>Long link → short link</span>
                </p>
                <UrlShortener onSuccess={onSuccess} />
            </div>
            <p className="mt-5 font-mono text-xs leading-relaxed text-muted">
                No account needed to shorten. No expiration date set.
            </p>
        </div>
    )
}

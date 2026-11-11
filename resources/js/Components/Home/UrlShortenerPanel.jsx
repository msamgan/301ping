import UrlShortener from "@/Components/Home/UrlShortener"
import { Link, usePage } from "@inertiajs/react"

export default function UrlShortenerPanel({ onSuccess }) {
    const user = usePage().props.auth?.user

    return (
        <div id="shortener-panel">
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
            <p className="mt-5 font-mono text-xs leading-relaxed text-muted lg:whitespace-nowrap lg:text-[10px]">
                No account needed to shorten. We don&apos;t set an expiry date. Tag links by campaign or client.
            </p>
            <p className="mt-2 font-mono text-xs leading-relaxed text-muted lg:whitespace-nowrap lg:text-[10px]">
                Every destination is checked against our URL safety rules before shortening.{" "}
                <Link href={route("safety")} className="underline underline-offset-2 hover:text-accent-dark">
                    See link safety.
                </Link>
            </p>
            <p className="mt-2 font-mono text-xs leading-relaxed text-muted lg:whitespace-nowrap lg:text-[10px]">
                We store the destination URL to make your short link work.{" "}
                <Link href={route("privacy")} className="underline underline-offset-2 hover:text-accent-dark">
                    Read our Privacy Policy.
                </Link>
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                {!user && (
                    <>
                        <Link
                            href={route("register")}
                            className="font-mono text-xs font-semibold text-ink underline underline-offset-4 hover:text-accent-dark"
                        >
                            Create a free account
                        </Link>
                        <span className="font-mono text-xs text-muted">
                            to save links, tags, and visit counts.
                        </span>
                    </>
                )}
                <Link
                    href={route("pricing")}
                    className="font-mono text-xs text-ink underline underline-offset-4 hover:text-accent-dark lg:whitespace-nowrap"
                >
                    Compare plan prices and limits.
                </Link>
            </div>
        </div>
    )
}

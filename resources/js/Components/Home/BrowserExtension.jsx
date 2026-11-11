import { useEffect, useState } from "react"
import Reveal from "@/Components/Home/Reveal"

const EXTENSIONS = {
    chrome: {
        label: "Chrome",
        url: "https://chromewebstore.google.com/detail/ms0org-url-shortener/goaddbeloaeledjpkaankdiglhnmpdld"
    },
    firefox: {
        label: "Firefox",
        url: "https://addons.mozilla.org/en-US/firefox/addon/301ping-url-shortener/"
    }
}

const BENEFITS = [
    {
        title: "Shorten the page you're on",
        body: "Create a compact 301p.ing link from your current browser tab—no copying the original URL first."
    },
    {
        title: "Ready to paste instantly",
        body: "The shortened link is copied to your clipboard as soon as it’s created."
    },
    {
        title: "Skip the tab switching",
        body: "Shorten and copy in one toolbar click, without opening the website or moving between tabs."
    },
    {
        title: "Share cleaner links anywhere",
        body: "Use concise links in chats, emails, documents, and social posts to keep sharing neat and readable."
    },
    {
        title: "Keep your workflow moving",
        body: "Share an article, product, event, or any page you find without interrupting what you’re doing."
    },
    {
        title: "Simple by design",
        body: "One clear action from the browser toolbar—no complicated interface to learn."
    }
]

function getBrowserExtension() {
    const userAgent = window.navigator.userAgent

    if (userAgent.includes("Firefox")) {
        return "firefox"
    }

    if (userAgent.includes("Chrome") && !/Edg|OPR|SamsungBrowser/.test(userAgent)) {
        return "chrome"
    }

    return null
}

export default function BrowserExtension() {
    const [browser, setBrowser] = useState(null)

    useEffect(() => {
        setBrowser(getBrowserExtension())
    }, [])

    const extensions = browser ? [EXTENSIONS[browser]] : Object.values(EXTENSIONS)

    return (
        <section className="border-b border-line bg-ink text-paper" aria-labelledby="extension-heading">
            <div className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 py-20 md:py-28">
                <Reveal className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60 mb-8">
                    02 / 301 ping for {browser ? EXTENSIONS[browser].label : "your browser"}
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-14">
                    <Reveal className="lg:col-span-5">
                        <h2
                            id="extension-heading"
                            className="font-editorial font-normal text-paper text-5xl sm:text-6xl leading-[1.05] mb-6"
                        >
                            Shorten the page you’re on.
                        </h2>
                        <p className="font-grotesk text-base sm:text-lg text-paper/70 max-w-md mb-8">
                            One click from your browser toolbar turns the current page into a short link—and
                            copies it, ready to share.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {extensions.map((extension) => (
                                <a
                                    key={extension.label}
                                    href={extension.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-3 bg-accent px-6 py-4 font-grotesk text-sm font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-accent-dark hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
                                >
                                    Add to {extension.label}
                                    <span aria-hidden="true">↗</span>
                                </a>
                            ))}
                        </div>
                        <p className="font-mono text-xs text-paper/60 mt-4">
                            Open a page. Click the icon. Paste your link anywhere.
                        </p>
                    </Reveal>

                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 border-t border-paper/20">
                        {BENEFITS.map((benefit, index) => (
                            <Reveal
                                key={benefit.title}
                                delay={index * 50}
                                className="border-b border-paper/20 py-6 sm:pr-6 sm:even:pl-6 sm:even:border-l sm:even:border-paper/20"
                            >
                                <span className="block font-mono text-xs text-paper/50 mb-3">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <h3 className="font-grotesk font-bold text-paper text-base mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="font-grotesk text-sm text-paper/70 leading-relaxed">
                                    {benefit.body}
                                </p>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

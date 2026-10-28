import { Head, Link, usePage } from "@inertiajs/react"
import { useEffect, useState } from "react"
import axios from "axios"
import Header from "@/Components/Header.jsx"
import Footer from "@/Components/Footer.jsx"
import Reveal from "@/Components/Home/Reveal"
import ArrowIcon from "@/Components/Home/ArrowIcon"
import Modal from "@/Components/Modal"
import SecondaryButton from "@/Components/SecondaryButton"
import { useToast } from "@/Components/ToastProvider"

const requestExample = `{
  "url": "https://example.com/very/long/url"
}`

const curlExample = `curl --request POST \\
  --url "$MS0_URL/api/shorten" \\
  --header "Authorization: Bearer $301PING_TOKEN" \\
  --header "Content-Type: application/json" \\
  --data '{
    "url": "https://example.com/very/long/url"
  }'`

const responseExamples = [
    {
        code: "200",
        label: "Success",
        description: "The short URL was created, or an existing short URL was returned.",
        example: `{
  "status": true,
  "message": "Shortened Url created successfully",
  "short_url": "https://301p.ing/HDq"
}`
    },
    {
        code: "401",
        label: "Unauthorized",
        description: "The access token is missing or invalid.",
        example: `{
  "message": "Unauthorized"
}`
    },
    {
        code: "422",
        label: "Validation error",
        description: "The URL is missing, invalid, or unsafe.",
        example: `{
  "message": "The url field is required.",
  "errors": {
    "url": [
      "The url field is required."
    ]
  }
}`
    }
]

function CodeBlock({ children, label }) {
    return (
        <div className="overflow-hidden bg-ink text-paper">
            {label && (
                <div className="border-b border-paper/15 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/55">
                    {label}
                </div>
            )}
            <pre className="overflow-x-auto p-5 sm:p-6 ">
                <code className="!p-0 font-mono text-xs leading-6  sm:text-sm text-white">
                    <pre>{children}</pre>
                </code>
            </pre>
        </div>
    )
}

function SectionLabel({ children }) {
    return <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{children}</p>
}

export default function ApiDocumentation() {
    const { auth } = usePage().props
    const user = auth.user
    const [token, setToken] = useState("")
    const [tokenError, setTokenError] = useState("")
    const [isTokenVisible, setIsTokenVisible] = useState(false)
    const [confirmingTokenRegeneration, setConfirmingTokenRegeneration] = useState(false)
    const [regeneratingToken, setRegeneratingToken] = useState(false)
    const showToast = useToast()

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://301p.ing"

    useEffect(() => {
        if (!user) return

        let isMounted = true

        axios
            .get(route("service.api-token"))
            .then(({ data }) => {
                if (isMounted) setToken(data.token)
            })
            .catch(() => {
                if (isMounted) setTokenError("Your API token could not be loaded. Please refresh the page.")
            })

        return () => {
            isMounted = false
        }
    }, [user])

    const maskToken = (value) => {
        if (!value) return ""
        return `${value.substring(0, 8)}...${value.substring(value.length - 8)}`
    }

    const copyToken = async () => {
        try {
            await navigator.clipboard.writeText(token)
            showToast("Copied to clipboard.", "success")
        } catch {
            showToast("Failed to copy token to clipboard.", "error")
        }
    }

    const confirmTokenRegeneration = async () => {
        setConfirmingTokenRegeneration(false)
        setRegeneratingToken(true)
        try {
            const { data } = await axios.post(route("service.regenerate-token"), {})
            showToast(data.message || "Token regenerated successfully.", "success")
            setToken("")

            try {
                const { data: refreshedData } = await axios.get(route("service.api-token"))
                setToken(refreshedData.token)
                setTokenError("")
            } catch {
                setTokenError(
                    "Token regenerated, but the new token could not be loaded. Please refresh the page."
                )
                showToast("The new token could not be loaded. Refresh the page to access it.", "error")
            }
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to regenerate token.", "error")
        } finally {
            setRegeneratingToken(false)
        }
    }

    return (
        <>
            <Head title="API Documentation" />
            <Header isAuthenticated={!!user} user={user} />

            <main className="bg-paper font-grotesk text-ink">
                <section className="border-b border-line" aria-labelledby="api-docs-heading">
                    <div className="mx-auto max-w-grid px-6 pb-16 pt-16 md:px-10 md:pb-24 md:pt-20 lg:px-16">
                        <Reveal className="mb-8 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:mb-12">
                            <span>01 / Developer reference</span>
                            <span className="hidden sm:inline">301 ping API / v1.0.0</span>
                        </Reveal>

                        <div className="grid grid-cols-1 items-end gap-x-10 gap-y-10 lg:grid-cols-12">
                            <Reveal
                                as="h1"
                                id="api-docs-heading"
                                className="font-editorial text-6xl leading-[1.05] sm:text-7xl lg:col-span-7 lg:text-8xl"
                            >
                                Short links,
                                <br />
                                by request.
                            </Reveal>
                            <Reveal delay={80} className="lg:col-span-5 lg:border-l lg:border-line lg:pl-6">
                                <p className="max-w-md text-lg text-muted">
                                    Use the 301 ping API to turn a destination URL into a shareable short link.
                                    Send one authenticated JSON request and get a link back.
                                </p>
                                <a
                                    href="#shorten-url"
                                    className="mt-6 inline-flex items-center gap-3 font-semibold text-accent-dark transition-colors hover:text-ink"
                                >
                                    Explore the endpoint <span aria-hidden="true">↓</span>
                                </a>
                            </Reveal>
                        </div>

                        <nav
                            aria-label="API documentation sections"
                            className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
                        >
                            <a className="hover:text-ink" href="#authentication">
                                Authentication
                            </a>
                            <a className="hover:text-ink" href="#shorten-url">
                                Endpoint
                            </a>
                            <a className="hover:text-ink" href="#request-example">
                                Request example
                            </a>
                            <a className="hover:text-ink" href="#responses">
                                Responses
                            </a>
                        </nav>
                    </div>
                </section>

                <section
                    id="authentication"
                    className="scroll-mt-24 border-b border-line"
                    aria-labelledby="auth-heading"
                >
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-x-10 gap-y-10 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-12 lg:px-16">
                        <div className="lg:col-span-4">
                            <SectionLabel>02 / Authentication</SectionLabel>
                            <h2
                                id="auth-heading"
                                className="max-w-sm font-grotesk text-3xl font-extrabold leading-tight sm:text-4xl"
                            >
                                Your token opens the API.
                            </h2>
                        </div>
                        <div className="lg:col-span-8">
                            <p className="max-w-2xl text-muted">
                                Every API request requires an access token. Pass it as a bearer token in the
                                <span className="font-mono text-ink"> Authorization </span>
                                header.
                            </p>
                            <div className="mt-7">
                                <CodeBlock label="HTTP header">
                                    Authorization: Bearer YOUR_ACCESS_TOKEN
                                </CodeBlock>
                            </div>
                            {user ? (
                                <div className="mt-7 border-t border-line">
                                    <div className="flex flex-col justify-between gap-4 border-b border-line py-5 sm:flex-row sm:items-center">
                                        <span className="font-mono text-xs text-muted">MS0_API_TOKEN</span>
                                        <button
                                            type="button"
                                            onClick={() => setIsTokenVisible((visible) => !visible)}
                                            disabled={!token}
                                            className="self-start font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:text-accent-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
                                        >
                                            {isTokenVisible ? "Hide token" : "Show token"}
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={copyToken}
                                        disabled={!token}
                                        className="group flex w-full items-center justify-between gap-4 py-6 text-left font-mono text-sm break-all transition-colors hover:text-accent-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                                        aria-label="Copy API token"
                                    >
                                        <span>
                                            {tokenError
                                                ? "Unable to load token"
                                                : token
                                                  ? isTokenVisible
                                                      ? token
                                                      : maskToken(token)
                                                  : "Loading token..."}
                                        </span>
                                        <span
                                            className="shrink-0 text-muted group-hover:text-accent-dark"
                                            aria-hidden="true"
                                        >
                                            ↗
                                        </span>
                                    </button>
                                    {tokenError && (
                                        <p className="text-sm text-accent-dark" role="alert">
                                            {tokenError}
                                        </p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setConfirmingTokenRegeneration(true)}
                                        disabled={regeneratingToken}
                                        className="group mt-4 inline-flex items-center gap-3 bg-ink px-5 py-3 font-grotesk text-sm font-semibold text-paper transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {regeneratingToken ? "Regenerating..." : "Regenerate token"}{" "}
                                        <ArrowIcon />
                                    </button>
                                    <p className="mt-5 text-sm leading-relaxed text-muted">
                                        Keep this token private. Regenerating it invalidates your current token.
                                    </p>
                                </div>
                            ) : (
                                <p className="mt-5 text-sm leading-relaxed text-muted">
                                    Need a token?{" "}
                                    <Link
                                        href={route("register")}
                                        className="font-semibold text-accent-dark underline decoration-line underline-offset-4 transition-colors hover:text-ink"
                                    >
                                        Create a 301 ping account
                                    </Link>
                                    .
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section
                    id="shorten-url"
                    className="scroll-mt-24 border-b border-line"
                    aria-labelledby="shorten-heading"
                >
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-x-10 gap-y-10 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-12 lg:px-16">
                        <div className="lg:col-span-4">
                            <SectionLabel>03 / Hyperlinks</SectionLabel>
                            <h2
                                id="shorten-heading"
                                className="max-w-sm font-grotesk text-3xl font-extrabold leading-tight sm:text-4xl"
                            >
                                Shorten a URL.
                            </h2>
                            <p className="mt-5 max-w-sm leading-relaxed text-muted">
                                Create a new short link, or retrieve the existing short link for the same
                                destination.
                            </p>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line py-5">
                                <span className="bg-accent px-3 py-1 font-mono text-xs font-bold tracking-[0.12em] text-white">
                                    POST
                                </span>
                                <code className="overflow-x-auto whitespace-nowrap bg-transparent p-0 font-mono text-sm text-ink">
                                    {baseUrl}/api/shorten
                                </code>
                            </div>

                            <div className="grid grid-cols-1 gap-8 border-b border-line py-7 sm:grid-cols-2">
                                <div>
                                    <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                                        Headers
                                    </h3>
                                    <dl className="space-y-3 text-sm">
                                        <div className="flex flex-wrap gap-x-3">
                                            <dt className="font-mono text-ink">Authorization</dt>
                                            <dd className="text-muted">Bearer token (required)</dd>
                                        </div>
                                        <div className="flex flex-wrap gap-x-3">
                                            <dt className="font-mono text-ink">Content-Type</dt>
                                            <dd className="text-muted">application/json</dd>
                                        </div>
                                    </dl>
                                </div>
                                <div>
                                    <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                                        Request body
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted">
                                        Send a JSON object with one required field:
                                        <span className="font-mono text-ink"> url</span>, a valid and safe
                                        destination URI.
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-line font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                                            <th scope="col" className="py-4 pr-4 font-normal">
                                                Field
                                            </th>
                                            <th scope="col" className="py-4 pr-4 font-normal">
                                                Type
                                            </th>
                                            <th scope="col" className="py-4 pr-4 font-normal">
                                                Required
                                            </th>
                                            <th scope="col" className="py-4 font-normal">
                                                Example
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-line align-top text-sm">
                                            <th scope="row" className="py-5 pr-4 font-mono font-medium">
                                                url
                                            </th>
                                            <td className="py-5 pr-4 text-muted">string · uri</td>
                                            <td className="py-5 pr-4 text-muted">Yes</td>
                                            <td className="break-all py-5 font-mono text-xs text-muted">
                                                https://example.com/very/long/url
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="request-example"
                    className="scroll-mt-24 border-b border-line"
                    aria-labelledby="example-heading"
                >
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-x-10 gap-y-10 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-12 lg:px-16">
                        <div className="lg:col-span-4">
                            <SectionLabel>04 / Request example</SectionLabel>
                            <h2
                                id="example-heading"
                                className="max-w-sm font-grotesk text-3xl font-extrabold leading-tight sm:text-4xl"
                            >
                                Ready for your terminal.
                            </h2>
                            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                                Set your base URL and access token, then make the request.
                            </p>
                        </div>
                        <div className="space-y-5 lg:col-span-8">
                            <CodeBlock label="cURL">{curlExample}</CodeBlock>
                            <CodeBlock label="JSON request body">{requestExample}</CodeBlock>
                        </div>
                    </div>
                </section>

                <section
                    id="responses"
                    className="scroll-mt-24 border-b border-line"
                    aria-labelledby="responses-heading"
                >
                    <div className="mx-auto grid max-w-grid grid-cols-1 gap-x-10 gap-y-10 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-12 lg:px-16">
                        <div className="lg:col-span-4">
                            <SectionLabel>05 / Responses</SectionLabel>
                            <h2
                                id="responses-heading"
                                className="max-w-sm font-grotesk text-3xl font-extrabold leading-tight sm:text-4xl"
                            >
                                Clear results. Useful errors.
                            </h2>
                            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                                Responses are JSON. Check the HTTP status, then read the response body.
                            </p>
                        </div>
                        <div className="space-y-10 lg:col-span-8">
                            {responseExamples.map((response) => (
                                <article key={response.code} className="border-t border-line pt-5">
                                    <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                                        <span className="font-mono text-sm font-bold text-accent-dark">
                                            {response.code}
                                        </span>
                                        <h3 className="font-grotesk text-lg font-semibold text-ink">
                                            {response.label}
                                        </h3>
                                        <p className="text-sm text-muted">{response.description}</p>
                                    </div>
                                    <CodeBlock label="application/json">{response.example}</CodeBlock>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <Modal
                show={confirmingTokenRegeneration}
                onClose={() => setConfirmingTokenRegeneration(false)}
                maxWidth="md"
            >
                <div className="border-t-4 border-accent bg-paper p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                        Confirm token regeneration
                    </p>
                    <h3 className="mt-2 font-editorial text-2xl text-ink">Regenerate API token?</h3>
                    <p className="mb-6 mt-3 font-grotesk text-sm text-muted">
                        This will invalidate the current token. Applications using it will need to be updated.
                    </p>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingTokenRegeneration(false)}>
                            Keep Current Token
                        </SecondaryButton>
                        <button
                            type="button"
                            onClick={confirmTokenRegeneration}
                            className="inline-flex items-center justify-center border border-accent bg-accent px-5 py-3 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:border-accent-dark hover:bg-accent-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                        >
                            Regenerate Token
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import BrandingForm from "@/Pages/Profile/Partials/BrandingForm"
import { Head } from "@inertiajs/react"

export default function Branding({ auth, logos = [], logoLimit = 0 }) {
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
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Account
                            </p>
                            <h2 className="font-editorial text-3xl text-ink">Branding</h2>
                        </div>
                    </div>
                    <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                        01 / Logos
                    </span>
                </div>
            }
        >
            <Head title="Branding" />

            <main className="bg-paper font-grotesk text-ink">
                <div className="mx-auto max-w-grid px-6 py-8 md:px-10 md:py-12 lg:px-16">
                    <div className="mb-8 flex items-baseline justify-between border-b border-line pb-5">
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                            02 / Your branding
                        </p>
                        <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                            301p.ing
                        </span>
                    </div>

                    <section className="border border-line bg-paper p-6">
                        <BrandingForm logos={logos} logoLimit={logoLimit} className="max-w-2xl" />
                    </section>
                </div>
            </main>
        </AuthenticatedLayout>
    )
}

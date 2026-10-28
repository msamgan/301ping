import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import DeleteUserForm from "./Partials/DeleteUserForm"
import UpdatePasswordForm from "./Partials/UpdatePasswordForm"
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm"
import { Head } from "@inertiajs/react"
import { useState, useEffect } from "react"

export default function Edit({ auth, mustVerifyEmail, status }) {
    const [animateSections, setAnimateSections] = useState(false)
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== "undefined") {
            const savedTab = localStorage.getItem("profile_active_tab")
            if (["profile", "password", "danger"].includes(savedTab)) {
                return savedTab
            }
        }
        return "profile"
    })

    useEffect(() => {
        setAnimateSections(true)
    }, [])

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("profile_active_tab", activeTab)
        }
    }, [activeTab])

    const tabs = [
        {
            id: "profile",
            name: "Profile",
            meta: "01 / Identity",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            )
        },
        {
            id: "password",
            name: "Password",
            meta: "02 / Security",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                </svg>
            )
        },
        {
            id: "danger",
            name: "Danger",
            meta: "03 / Delete",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            )
        }
    ]

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
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                Account
                            </p>
                            <h2 className="font-editorial text-3xl text-ink">Profile</h2>
                        </div>
                    </div>

                    <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                        01 / Settings
                    </span>
                </div>
            }
        >
            <Head title="Profile" />

            <main className="bg-paper font-grotesk text-ink">
                <div className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 py-8 md:py-12">
                    <div className="mb-8 flex items-baseline justify-between border-b border-line pb-5">
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                            02 / Your account
                        </p>
                        <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                            301p.ing
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                        <aside className="lg:col-span-4">
                            <div className="border border-line bg-paper p-3 md:p-4">
                                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                    Navigation
                                </p>
                                <div className="space-y-2">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex w-full items-center justify-between border px-3 py-3 text-left transition-colors duration-200 ${
                                                activeTab === tab.id
                                                    ? "border-ink bg-ink text-paper"
                                                    : "border-line bg-paper text-ink hover:border-ink/70 hover:bg-ink/5"
                                            }`}
                                        >
                                            <span className="flex items-center gap-3">
                                                {tab.icon}
                                                <span className="font-grotesk text-sm font-semibold uppercase tracking-[0.08em]">
                                                    {tab.name}
                                                </span>
                                            </span>
                                            <span className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-80">
                                                {tab.meta}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        <div className="lg:col-span-8">
                            <div className="space-y-6">
                                {activeTab === "profile" && (
                                    <div
                                        className={`border border-line bg-paper transition-all duration-500 ${
                                            animateSections
                                                ? "translate-y-0 opacity-100"
                                                : "translate-y-4 opacity-0"
                                        }`}
                                        style={{ transitionDelay: "100ms" }}
                                    >
                                        <div className="border-b border-line px-6 py-4">
                                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                                01 / Identity
                                            </p>
                                        </div>
                                        <div className="p-6">
                                            <UpdateProfileInformationForm
                                                mustVerifyEmail={mustVerifyEmail}
                                                status={status}
                                                className="max-w-2xl"
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === "password" && (
                                    <div
                                        className={`border border-line bg-paper transition-all duration-500 ${
                                            animateSections
                                                ? "translate-y-0 opacity-100"
                                                : "translate-y-4 opacity-0"
                                        }`}
                                        style={{ transitionDelay: "100ms" }}
                                    >
                                        <div className="border-b border-line px-6 py-4">
                                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                                02 / Security
                                            </p>
                                        </div>
                                        <div className="p-6">
                                            <UpdatePasswordForm className="max-w-2xl" />
                                        </div>
                                    </div>
                                )}

                                {activeTab === "danger" && (
                                    <div
                                        className={`border border-line bg-paper transition-all duration-500 ${
                                            animateSections
                                                ? "translate-y-0 opacity-100"
                                                : "translate-y-4 opacity-0"
                                        }`}
                                        style={{ transitionDelay: "100ms" }}
                                    >
                                        <div className="border-b border-line px-6 py-4">
                                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                                03 / Delete
                                            </p>
                                        </div>
                                        <div className="p-6">
                                            <DeleteUserForm className="max-w-2xl" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    )
}

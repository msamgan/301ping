import { createContext, useCallback, useContext, useRef, useState } from "react"

const ToastContext = createContext(null)

const toastVariants = {
    success: {
        title: "All set",
        iconClass: "bg-emerald-100 text-emerald-800",
        icon: (
            <path
                d="m5 12 4 4L19 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        )
    },
    error: {
        title: "A little snag",
        iconClass: "bg-accent/10 text-accent-dark",
        icon: (
            <>
                <path
                    d="M12 8v4m0 4h.01M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3l-7.6-13.1a2 2 0 0 0-3.4 0Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </>
        )
    },
    info: {
        title: "Just so you know",
        iconClass: "bg-ink/5 text-ink",
        icon: (
            <>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                <path d="M12 11v5m0-8h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </>
        )
    }
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])
    const nextId = useRef(0)

    const dismissToast = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
    }, [])

    const showToast = useCallback(
        (message, type = "info") => {
            const id = nextId.current++
            setToasts((current) => [...current, { id, message, type }])
            window.setTimeout(() => dismissToast(id), 5000)
        },
        [dismissToast]
    )

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div
                className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(25rem,calc(100vw-2rem))] flex-col gap-3"
                aria-live="polite"
                aria-relevant="additions"
            >
                {toasts.map((toast) => {
                    const variant = toastVariants[toast.type] || toastVariants.info

                    return (
                        <div
                            key={toast.id}
                            role={toast.type === "error" ? "alert" : "status"}
                            className="pointer-events-auto flex items-start gap-3 border border-line bg-paper p-4 font-grotesk text-sm text-ink shadow-xl shadow-ink/10"
                        >
                            <span
                                className={`flex h-9 w-9 shrink-0 items-center justify-center ${variant.iconClass}`}
                                aria-hidden="true"
                            >
                                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none">
                                    {variant.icon}
                                </svg>
                            </span>
                            <div className="min-w-0 flex-1 pt-0.5">
                                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                                    {variant.title}
                                </p>
                                <p className="mt-1 leading-relaxed">{toast.message}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => dismissToast(toast.id)}
                                aria-label="Dismiss notification"
                                className="ml-1 shrink-0 text-muted transition-colors hover:text-ink"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                    <path
                                        d="m5 5 10 10M15 5 5 15"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    )
                })}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const showToast = useContext(ToastContext)

    if (!showToast) {
        throw new Error("useToast must be used within a ToastProvider.")
    }

    return showToast
}

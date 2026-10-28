export default function SecondaryButton({ type = "button", className = "", disabled, children, ...props }) {
    return (
        <button
            {...props}
            type={type}
            className={`inline-flex items-center justify-center border border-line bg-paper px-5 py-3 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

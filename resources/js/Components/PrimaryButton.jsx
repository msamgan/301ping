export default function PrimaryButton({ className = "", disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center border border-ink bg-ink px-5 py-3 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:border-accent hover:bg-accent hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

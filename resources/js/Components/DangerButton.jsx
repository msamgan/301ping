export default function DangerButton({ className = "", disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center border border-accent bg-accent px-5 py-3 font-grotesk text-sm font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:border-accent-dark hover:bg-accent-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

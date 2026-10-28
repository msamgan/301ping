export default function InputLabel({ value, className = "", children, ...props }) {
    return (
        <label
            {...props}
            className={`block font-mono text-[11px] uppercase tracking-[0.18em] text-muted ` + className}
        >
            {value ? value : children}
        </label>
    )
}

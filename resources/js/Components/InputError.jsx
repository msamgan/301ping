export default function InputError({ message, className = "", ...props }) {
    return message ? (
        <p {...props} className={"font-mono text-xs text-accent-dark " + className}>
            {"// " + message}
        </p>
    ) : null
}

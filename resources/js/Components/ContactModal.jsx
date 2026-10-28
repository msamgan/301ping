import { useState } from "react"
import axios from "axios"
import Modal from "@/Components/Modal.jsx"
import { useToast } from "@/Components/ToastProvider"

const COUNTRY_CODES = [
    ["+1", "US/CA"],
    ["+7", "RU"],
    ["+20", "EG"],
    ["+27", "ZA"],
    ["+31", "NL"],
    ["+33", "FR"],
    ["+34", "ES"],
    ["+39", "IT"],
    ["+41", "CH"],
    ["+44", "UK"],
    ["+45", "DK"],
    ["+46", "SE"],
    ["+47", "NO"],
    ["+48", "PL"],
    ["+49", "DE"],
    ["+52", "MX"],
    ["+55", "BR"],
    ["+60", "MY"],
    ["+61", "AU"],
    ["+62", "ID"],
    ["+63", "PH"],
    ["+64", "NZ"],
    ["+65", "SG"],
    ["+66", "TH"],
    ["+81", "JP"],
    ["+82", "KR"],
    ["+86", "CN"],
    ["+90", "TR"],
    ["+91", "IN"],
    ["+92", "PK"],
    ["+94", "LK"],
    ["+234", "NG"],
    ["+254", "KE"],
    ["+880", "BD"],
    ["+971", "AE"],
    ["+966", "SA"]
]

const DEFAULT_MESSAGE =
    "Hi, I'm interested in a tailored plan for 301 ping. Please get in touch with more details about pricing and features."

const baseField =
    "border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-accent-dark focus:outline-none focus:ring-0"
const fieldClass = `w-full ${baseField}`
const labelClass = "mb-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted"

export default function ContactModal({ show, onClose }) {
    const showToast = useToast()
    const [form, setForm] = useState({
        name: "",
        country_code: "+1",
        phone: "",
        email: "",
        message: DEFAULT_MESSAGE
    })
    const [errors, setErrors] = useState({})
    const [processing, setProcessing] = useState(false)

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

    const submit = (e) => {
        e.preventDefault()
        setProcessing(true)
        setErrors({})

        axios
            .post(route("contact.store"), form)
            .then(({ data }) => {
                showToast(data.message)
                setForm((f) => ({ ...f, name: "", phone: "", email: "", message: DEFAULT_MESSAGE }))
                onClose()
            })
            .catch((err) => {
                if (err.response?.status === 422) {
                    setErrors(err.response.data.errors || {})
                } else {
                    showToast("Could not send your message. Please try again.", "error")
                }
            })
            .finally(() => setProcessing(false))
    }

    const error = (key) => (errors[key] ? <p className="mt-1 text-xs text-red-600">{errors[key][0]}</p> : null)

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <form onSubmit={submit} className="p-6">
                <h2 className="font-editorial text-3xl">Contact us</h2>
                <p className="mt-1 text-sm text-muted">Tell us what you need and we'll reply by email.</p>

                <div className="mt-5 space-y-4">
                    <div>
                        <label htmlFor="contact-name" className={labelClass}>
                            Name
                        </label>
                        <input
                            id="contact-name"
                            required
                            maxLength={100}
                            value={form.name}
                            onChange={set("name")}
                            className={fieldClass}
                        />
                        {error("name")}
                    </div>

                    <div>
                        <label htmlFor="contact-phone" className={labelClass}>
                            Phone
                        </label>
                        <div className="flex items-stretch gap-2">
                            <select
                                aria-label="Country code"
                                value={form.country_code}
                                onChange={set("country_code")}
                                className={`${baseField} w-32 shrink-0`}
                            >
                                {COUNTRY_CODES.map(([code, label]) => (
                                    <option key={code + label} value={code}>
                                        {label} {code}
                                    </option>
                                ))}
                            </select>
                            <input
                                id="contact-phone"
                                type="tel"
                                required
                                value={form.phone}
                                onChange={set("phone")}
                                className={`${baseField} min-w-0 flex-1`}
                            />
                        </div>
                        {error("phone") || error("country_code")}
                    </div>

                    <div>
                        <label htmlFor="contact-email" className={labelClass}>
                            Email
                        </label>
                        <input
                            id="contact-email"
                            type="email"
                            required
                            value={form.email}
                            onChange={set("email")}
                            className={fieldClass}
                        />
                        {error("email")}
                    </div>

                    <div>
                        <label htmlFor="contact-message" className={labelClass}>
                            Message
                        </label>
                        <textarea
                            id="contact-message"
                            required
                            rows={4}
                            maxLength={2000}
                            value={form.message}
                            onChange={set("message")}
                            className={fieldClass}
                        />
                        {error("message")}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="border border-line px-5 py-2 hover:border-accent-dark hover:text-accent-dark"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="border border-ink bg-ink px-5 py-2 text-paper hover:border-accent-dark hover:bg-accent-dark disabled:opacity-50"
                    >
                        {processing ? "Sending..." : "Send"}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

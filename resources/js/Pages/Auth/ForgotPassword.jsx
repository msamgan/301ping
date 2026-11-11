import GuestLayout from "@/Layouts/GuestLayout"
import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import { useForm } from "@inertiajs/react"
import SeoHead from "@/Components/SeoHead"

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: ""
    })

    const submit = (e) => {
        e.preventDefault()

        post(route("password.email"))
    }

    return (
        <GuestLayout>
            <SeoHead
                title="Forgot Password"
                description="Request a password reset for your 301 Ping account. Enter the email address associated with your account and we will send instructions to help you regain access."
                noindex
            />

            <div className="mb-8 font-grotesk text-sm leading-relaxed text-muted">
                Forgot your password? No problem. Just let us know your email address and we will email you a
                password reset link that will allow you to choose a new one.
            </div>

            {status && (
                <div className="mb-8 border border-line border-l-4 border-l-accent bg-paper p-4 font-grotesk text-sm text-ink">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mb-10">
                    <InputLabel
                        htmlFor="email"
                        value="Email address"
                        className="font-grotesk text-xs font-semibold uppercase tracking-[0.12em] text-ink"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="your@email.com"
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full border border-ink bg-ink px-4 py-4 font-grotesk text-sm font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:border-accent hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? "Sending..." : "Email Password Reset Link"}
                    </button>
                </div>
            </form>
        </GuestLayout>
    )
}

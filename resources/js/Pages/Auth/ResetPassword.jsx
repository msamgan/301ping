import GuestLayout from "@/Layouts/GuestLayout"
import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import { useForm } from "@inertiajs/react"
import SeoHead from "@/Components/SeoHead"

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: ""
    })

    const submit = (e) => {
        e.preventDefault()

        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation")
        })
    }

    return (
        <GuestLayout>
            <SeoHead
                title="Reset Password"
                description="Choose a new password for your 301 Ping account using the secure reset link sent to your email. Update your credentials to restore access to your short links and account."
                noindex
            />

            <form onSubmit={submit}>
                <div className="mb-7">
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
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mb-7">
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="font-grotesk text-xs font-semibold uppercase tracking-[0.12em] text-ink"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="••••••••"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mb-10">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm password"
                        className="font-grotesk text-xs font-semibold uppercase tracking-[0.12em] text-ink"
                    />

                    <TextInput
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-2"
                        autoComplete="new-password"
                        onChange={(e) => setData("password_confirmation", e.target.value)}
                        placeholder="••••••••"
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full border border-ink bg-ink px-4 py-4 font-grotesk text-sm font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:border-accent hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? "Resetting..." : "Reset Password"}
                    </button>
                </div>
            </form>
        </GuestLayout>
    )
}

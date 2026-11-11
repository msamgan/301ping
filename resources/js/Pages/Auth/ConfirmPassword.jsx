import GuestLayout from "@/Layouts/GuestLayout"
import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import { useForm } from "@inertiajs/react"
import SeoHead from "@/Components/SeoHead"

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: ""
    })

    const submit = (e) => {
        e.preventDefault()

        post(route("password.confirm"), {
            onFinish: () => reset("password")
        })
    }

    return (
        <GuestLayout>
            <SeoHead
                title="Confirm Password"
                description="Confirm your 301 Ping account password to continue to a protected action. Verifying your identity helps keep your profile, links, and account settings secure."
                noindex
            />

            <div className="mb-8 font-grotesk text-sm leading-relaxed text-muted">
                This is a secure area of the application. Please confirm your password before continuing.
            </div>

            <form onSubmit={submit}>
                <div className="mb-10">
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
                        isFocused={true}
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="••••••••"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full border border-ink bg-ink px-4 py-4 font-grotesk text-sm font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:border-accent hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? "Confirming..." : "Confirm"}
                    </button>
                </div>
            </form>
        </GuestLayout>
    )
}

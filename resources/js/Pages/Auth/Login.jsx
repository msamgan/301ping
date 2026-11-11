import Checkbox from "@/Components/Checkbox"
import GuestLayout from "@/Layouts/GuestLayout"
import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import { Link, useForm } from "@inertiajs/react"
import SeoHead from "@/Components/SeoHead"

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false
    })

    const submit = (e) => {
        e.preventDefault()

        post(route("login"), {
            onFinish: () => reset("password")
        })
    }

    return (
        <>
            <SeoHead
                title="Log in"
                description="Sign in to your 301 Ping account to manage short links, review click analytics, organize tags, and update destinations. Enter your account details to continue."
                noindex
            />

            <GuestLayout>
                {status && (
                    <div className="mb-8 border border-line border-l-4 border-l-accent bg-paper p-4 font-grotesk text-sm text-ink">
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="mb-8">
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
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="your@email.com"
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="font-grotesk text-xs font-semibold uppercase tracking-[0.12em] text-ink"
                            />

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="font-grotesk text-xs font-semibold uppercase tracking-[0.08em] text-muted transition-colors hover:text-accent-dark"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-2"
                            autoComplete="current-password"
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder="••••••••"
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mb-10">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData("remember", e.target.checked)}
                                className="rounded border-line text-accent focus:ring-accent"
                            />
                            <span className="ml-2 font-grotesk text-sm text-muted">Remember me</span>
                        </label>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full border border-ink bg-ink px-4 py-4 font-grotesk text-sm font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:border-accent hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                </form>
            </GuestLayout>
        </>
    )
}

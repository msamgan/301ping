import GuestLayout from "@/Layouts/GuestLayout"
import PrimaryButton from "@/Components/PrimaryButton"
import { Link, useForm } from "@inertiajs/react"
import SeoHead from "@/Components/SeoHead"
import { analytics } from "@heycatch/sdk"

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({})

    const submit = (e) => {
        e.preventDefault()

        post(route("verification.send"))
    }

    return (
        <GuestLayout>
            <SeoHead
                title="Verify Your Email"
                description="Verify the email address connected to your 301 Ping account to complete registration and enable account features. Follow the verification link in your inbox to continue."
                noindex
            />

            <div className="mb-4 text-sm text-gray-600">
                Thanks for signing up! Before getting started, could you verify your email address by clicking
                on the link we just emailed to you? If you didn't receive the email, we will gladly send you
                another.
            </div>

            {status === "verification-link-sent" && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>Resend Verification Email</PrimaryButton>

                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        onSuccess={() => analytics.resetIdentity()}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    )
}

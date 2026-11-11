import { analytics } from "@heycatch/sdk"

export function identifyUser(user) {
    if (!user) return

    analytics.setIdentity(
        String(user.id),
        { email: user.email, name: user.name, plan: user.subscription?.tier },
        { signup_date: user.created_at }
    )
}

import "./bootstrap"
import "../css/app.css"

import { createRoot } from "react-dom/client"
import { createInertiaApp } from "@inertiajs/react"
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers"
import { ToastProvider } from "@/Components/ToastProvider"
import { analytics } from "@heycatch/sdk"
import { identifyUser } from "@/analytics"

analytics.init({
    projectKey: "hck_pk_ZobCWlEPAY4LxuUwiZnGRW0LIFgD7lF2",
    install: {
        framework: "vite-react",
        frameworkVersion: "18",
        agent: "other"
    }
})

const appName = import.meta.env.VITE_APP_NAME || "301 ping"

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob("./Pages/**/*.jsx")),
    setup({ el, App, props }) {
        identifyUser(props.initialPage.props.auth.user)
        const root = createRoot(el)

        root.render(
            <ToastProvider>
                <App {...props} />
            </ToastProvider>
        )
    },
    progress: {
        color: "#4B5563"
    }
})

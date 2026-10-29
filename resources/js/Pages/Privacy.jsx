import LegalPage from "@/Components/LegalPage"

const sections = [
    {
        title: "Information we collect",
        paragraphs: [
            "When you create an account, we collect your name and email address, a securely hashed password, and an API access token for authenticated API requests.",
            "When you create a short link, we store the destination URL and its short code. For each redirect, we update the link's visit count and most recent visit time."
        ]
    },
    {
        title: "How we use information",
        paragraphs: [
            "We use this information to provide and maintain 301 ping, authenticate your account and API requests, manage your links, show link activity, and protect the service from misuse. We may also use your email address for account-related messages such as verification and password resets."
        ]
    },
    {
        title: "Cookies and technical information",
        paragraphs: [
            "301 ping uses session cookies and related session data to support sign-in and secure interactions with the service. When you connect to the site, our hosting environment may also process technical request information, such as your IP address and browser user-agent, as part of operating and securing the service."
        ]
    },
    {
        title: "Sharing and external links",
        paragraphs: [
            "We do not sell your personal information. We may provide information to service providers that help us host, maintain, and secure 301 ping, or disclose it when required by law or necessary to protect the service and its users.",
            "A short link redirects to the destination URL supplied by its creator. The destination site is operated by someone else and has its own privacy practices."
        ]
    },
    {
        title: "Retention and your choices",
        paragraphs: [
            "We keep information for as long as needed to operate 301 ping, maintain links and accounts, meet legal obligations, and resolve disputes. You can update account information in your profile. To request access to, correction of, or deletion of personal information, contact us using the address below."
        ]
    },
    {
        title: "Security and changes",
        paragraphs: [
            "We use reasonable measures to protect information, but no online service can guarantee complete security. We may update this policy from time to time; the latest version will be published on this page."
        ]
    },
    {
        title: "Contact",
        paragraphs: [
            <>
                Questions or privacy requests? Email{" "}
                <a
                    href="mailto:hello@301p.ing"
                    className="font-semibold text-accent-dark underline decoration-line underline-offset-4 transition-colors hover:text-ink"
                >
                    hello@301p.ing
                </a>
                .
            </>
        ]
    }
]

export default function Privacy() {
    return (
        <LegalPage
            title="Privacy Policy"
            eyebrow="Privacy"
            heading={
                <>
                    Your links.
                    <br />
                    Your privacy.
                </>
            }
            introduction="This policy explains what information 301 ping handles when you use our URL shortener, how we use it, and the choices available to you."
            sections={sections}
        />
    )
}

import LegalPage from "@/Components/LegalPage"

const sections = [
    {
        title: "Using 301 ping",
        paragraphs: [
            "301 ping lets you create and manage short links and related tools. By using the service, you agree to these terms. If you use 301 ping on behalf of an organization, you confirm that you have authority to accept these terms for it.",
            "You must be able to form a binding agreement where you live. You are responsible for keeping your account credentials secure and for activity carried out through your account."
        ]
    },
    {
        title: "Your links and responsibilities",
        paragraphs: [
            "You keep ownership of the URLs and other material you submit. You are responsible for having the rights and permissions needed to use them and for making sure your links comply with applicable laws.",
            "Do not use 301 ping to distribute malware, conduct phishing or fraud, violate another person's rights, evade security controls, or facilitate illegal or harmful activity. We may disable links or accounts that we reasonably believe violate these terms or put users or the service at risk."
        ]
    },
    {
        title: "Short links and destinations",
        paragraphs: [
            "A short link redirects visitors to the destination you choose. We do not control or endorse third-party destination sites, and we are not responsible for their content, availability, or practices. Visitors should use their own judgment before opening or relying on a destination."
        ]
    },
    {
        title: "Plans, billing, and cancellation",
        paragraphs: [
            "Some features require a paid plan. Plan prices, billing intervals, and included features are shown on the pricing page or during checkout. Paid subscriptions renew according to the selected billing interval until canceled.",
            "You can cancel a subscription from your account. Cancellation stops future renewals; paid access remains available until the end of the current billing period. Refunds are handled under our Refund Policy and any rights that apply under local law."
        ]
    },
    {
        title: "Our service and intellectual property",
        paragraphs: [
            "We grant you a limited, non-exclusive, non-transferable right to use 301 ping for its intended purpose while you comply with these terms. The service, including its software, design, and branding, belongs to 301 ping or its licensors and is protected by applicable intellectual-property laws.",
            "We may update, suspend, or discontinue parts of the service. We will make reasonable efforts to give notice of material changes when practicable."
        ]
    },
    {
        title: "Suspension and termination",
        paragraphs: [
            "You may stop using the service at any time. We may suspend or terminate access if you materially breach these terms, create a security or legal risk, or misuse the service. Where appropriate, we will try to notify you and give you an opportunity to address the issue."
        ]
    },
    {
        title: "Disclaimers and liability",
        paragraphs: [
            'To the extent permitted by law, 301 ping is provided on an "as is" and "as available" basis. We do not guarantee uninterrupted or error-free service, or that every short link will remain available indefinitely.',
            "To the extent permitted by law, 301 ping will not be liable for indirect, incidental, special, consequential, or punitive damages, or for loss of data, profits, or business arising from your use of the service. Nothing in these terms limits liability that cannot legally be excluded."
        ]
    },
    {
        title: "Changes and contact",
        paragraphs: [
            "We may revise these terms as the service changes. Updated terms will be published here; continued use after they take effect means you accept the revised terms, to the extent allowed by law.",
            <>
                Questions about these terms? Email{" "}
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

export default function Terms() {
    return (
        <LegalPage
            title="Terms of Service"
            description="Review the 301 Ping Terms of Service, including account responsibilities, short link usage, subscriptions, cancellations, and service limitations."
            eyebrow="Terms"
            heading={
                <>
                    A few rules
                    <br />
                    for the road.
                </>
            }
            introduction="These terms explain the ground rules for using 301 ping and the short links you create with it."
            sections={sections}
        />
    )
}

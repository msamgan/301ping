import LegalPage from "@/Components/LegalPage"

const sections = [
    {
        title: "Subscriptions and charges",
        paragraphs: [
            "Paid 301 ping plans are billed in advance for the monthly or annual period selected at checkout. The price and billing interval are shown before you complete a purchase. Unless canceled, a subscription renews automatically at the then-current price for the same billing interval."
        ]
    },
    {
        title: "Canceling a plan",
        paragraphs: [
            "You can cancel a paid subscription from your account at any time. Cancellation prevents the next renewal; it does not automatically refund a charge already made. Your paid features remain available through the end of the current billing period."
        ]
    },
    {
        title: "When refunds may be available",
        paragraphs: [
            "Except where a refund is required by law, subscription payments are generally non-refundable, including for unused time, partial billing periods, or a failure to cancel before renewal.",
            "If you were charged in error, believe there was an unauthorized payment, or experienced a billing problem, contact us. We will review the circumstances and correct confirmed billing errors. Any refund or other remedy required by applicable consumer-protection law will be honored."
        ]
    },
    {
        title: "How to contact us",
        paragraphs: [
            <>
                For a billing or refund request, email{" "}
                <a
                    href="mailto:hello@301p.ing"
                    className="font-semibold text-accent-dark underline decoration-line underline-offset-4 transition-colors hover:text-ink"
                >
                    hello@301p.ing
                </a>{" "}
                from the email address on your account. Include the charge date and a brief description of the
                issue. Please do not send full payment-card details.
            </>
        ]
    },
    {
        title: "Policy updates",
        paragraphs: [
            "We may update this policy when our plans or practices change. The latest version will be published on this page. Changes do not remove consumer rights that cannot be waived under applicable law."
        ]
    }
]

export default function RefundPolicy() {
    return (
        <LegalPage
            title="Refund Policy"
            eyebrow="Refunds"
            heading={
                <>
                    A clear answer
                    <br />
                    on billing.
                </>
            }
            introduction="Here is how subscription renewals, cancellations, and refund requests work for 301 ping."
            sections={sections}
        />
    )
}

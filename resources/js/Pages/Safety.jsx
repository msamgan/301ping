import LegalPage from "@/Components/LegalPage"

const sections = [
    {
        title: "Checks before shortening",
        paragraphs: [
            "Each destination is checked against 301 Ping's URL safety rules before a short link is created. HTTP and HTTPS destinations are allowed; other protocols are rejected.",
            "The checks also reject private or internal addresses, configured blocked domains, host names containing blocked keywords, and file types that are not on the allowed list."
        ]
    },
    {
        title: "What these checks do not mean",
        paragraphs: [
            "These checks reduce risk, but they cannot identify every harmful or misleading destination. A short link still sends people to the destination its creator provided, so check the destination and share clear context with your audience."
        ]
    },
    {
        title: "Report a suspicious link",
        paragraphs: [
            <>
                If you find a short link that appears unsafe, contact{" "}
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

export default function Safety() {
    return (
        <LegalPage
            title="Link Safety"
            description="Learn how 301 Ping checks link destinations before shortening and what those checks can and cannot catch."
            eyebrow="Link safety"
            heading={
                <>
                    Checks before
                    <br />
                    links go live.
                </>
            }
            introduction="Every destination goes through URL safety rules before we create its short link. Those checks reduce risk; they cannot catch everything."
            sections={sections}
        />
    )
}

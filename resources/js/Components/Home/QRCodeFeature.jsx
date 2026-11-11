import Reveal from "@/Components/Home/Reveal"

const QR_SIZE = 25

function isFinderModule(row, column) {
    return (row < 7 && column < 7) || (row < 7 && column >= QR_SIZE - 7) || (row >= QR_SIZE - 7 && column < 7)
}

function QRArtwork() {
    const modules = []

    for (let row = 0; row < QR_SIZE; row++) {
        for (let column = 0; column < QR_SIZE; column++) {
            if (isFinderModule(row, column)) continue

            const inLogoSpace = row >= 9 && row <= 15 && column >= 9 && column <= 15
            const isDark = (row * 7 + column * 11 + row * column) % 5 < 2

            if (!inLogoSpace && isDark) {
                modules.push(
                    <rect
                        key={`${row}-${column}`}
                        x={column + 2}
                        y={row + 2}
                        width="0.82"
                        height="0.82"
                        rx="0.2"
                    />
                )
            }
        }
    }

    return (
        <svg
            viewBox="0 0 29 29"
            className="h-full w-full"
            role="img"
            aria-label="Illustration of a branded QR code"
        >
            <g fill="currentColor">{modules}</g>
            {[
                [0, 0],
                [18, 0],
                [0, 18]
            ].map(([x, y]) => (
                <g key={`${x}-${y}`} transform={`translate(${x + 2} ${y + 2})`}>
                    <rect width="7" height="7" rx="1.4" fill="currentColor" />
                    <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
                    <rect x="2" y="2" width="3" height="3" rx="0.7" fill="currentColor" />
                </g>
            ))}
            <rect x="10.2" y="10.2" width="6.6" height="6.6" rx="1.6" fill="white" />
            <rect x="11" y="11" width="5" height="5" rx="1.3" fill="#e66054" />
            <path
                d="M12.2 14.6v-2.4h.65l.9 1.13.9-1.13h.65v2.4h-.7v-1.35l-.85 1.02-.85-1.02v1.35h-.7Z"
                fill="#111111"
            />
        </svg>
    )
}

export default function QRCodeFeature() {
    return (
        <section className="border-b border-line bg-ink text-paper" aria-labelledby="qr-code-heading">
            <div className="mx-auto max-w-grid px-6 md:px-10 lg:px-16 py-20 md:py-28">
                <Reveal className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60 mb-8">
                    04 / Branded QR codes
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12 items-center">
                    <Reveal className="lg:col-span-6">
                        <h2
                            id="qr-code-heading"
                            className="font-editorial text-paper text-5xl sm:text-6xl leading-[1.05] mb-6"
                        >
                            Scan it. Share it. Make it yours.
                        </h2>
                        <p className="font-grotesk text-base sm:text-lg text-paper/70 max-w-2xl leading-relaxed">
                            Give every short link a scan-ready QR code you can download and share. Add your own
                            custom logo in the center to make the code feel unmistakably yours.
                        </p>
                    </Reveal>

                    <Reveal delay={80} className="lg:col-span-6">
                        <div className="relative mx-auto flex min-h-[320px] w-full max-w-lg items-center justify-center overflow-hidden border border-paper/15 bg-paper/[0.04] p-8 sm:min-h-[380px]">
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 opacity-30"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
                                    backgroundSize: "32px 32px"
                                }}
                            />
                            <div className="absolute left-5 top-5 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/50 sm:left-7 sm:top-7">
                                Link / 001
                            </div>

                            <div className="relative w-52 rotate-[-4deg] border border-ink/10 bg-white p-4 text-ink shadow-2xl sm:w-64 sm:p-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="font-grotesk text-[10px] font-bold uppercase tracking-[0.12em]">
                                        Scan to visit
                                    </span>
                                    <span className="h-2 w-2 rounded-full bg-accent" />
                                </div>
                                <div className="aspect-square p-2 text-ink">
                                    <QRArtwork />
                                </div>
                                <div className="mt-3 border-t border-line pt-3 font-mono text-[9px] text-muted">
                                    301P.ING / YOUR LINK
                                </div>
                            </div>

                            <div className="absolute bottom-7 right-5 flex items-center gap-3 border border-paper/20 bg-ink px-3 py-2.5 sm:bottom-10 sm:right-8">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent font-grotesk text-xs font-extrabold text-ink">
                                    M
                                </span>
                                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper/70">
                                    Your logo
                                    <span className="block text-paper">Center stage</span>
                                </span>
                            </div>
                        </div>
                    </Reveal>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-8 border-t border-paper/20 pt-8 sm:grid-cols-2 sm:gap-12">
                    <Reveal>
                        <span className="font-mono text-xs text-paper/50">01</span>
                        <h3 className="font-grotesk font-bold text-paper text-base mt-3 mb-2">
                            Ready to download
                        </h3>
                        <p className="font-grotesk text-sm text-paper/70 leading-relaxed max-w-md">
                            Create a crisp QR code for a short link and take it anywhere you share.
                        </p>
                    </Reveal>
                    <Reveal delay={80}>
                        <span className="font-mono text-xs text-paper/50">02</span>
                        <h3 className="font-grotesk font-bold text-paper text-base mt-3 mb-2">
                            Branded by you
                        </h3>
                        <p className="font-grotesk text-sm text-paper/70 leading-relaxed max-w-md">
                            Place your custom logo at its center for a more personal, recognizable code.
                        </p>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}

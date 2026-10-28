import QRCode from "qrcode"

/**
 * Generates and downloads a high-resolution QR code PNG with the logo
 * seamlessly embedded directly into the matrix grid.
 *
 * @param {string} text - The URL or text to encode in the QR code.
 * @param {string} filename - The filename for the downloaded image.
 * @param {string} [logoSrc="/favicon.svg"] - Path to the primary logo image.
 * @returns {Promise<void>}
 */
export async function downloadQrCodeWithLogo(text, filename = "qrcode.png", logoSrc = "/favicon.svg") {
    if (!text) {
        throw new Error("No URL provided for QR code generation.")
    }

    const canvas = document.createElement("canvas")
    await renderQrCodeToCanvas(canvas, text, logoSrc, 1024)

    // Trigger download
    const dataUrl = canvas.toDataURL("image/png")
    const downloadLink = document.createElement("a")
    downloadLink.href = dataUrl
    downloadLink.download = filename.endsWith(".png") ? filename : `${filename}.png`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
}

/**
 * Draws the branded QR code (with embedded logo) onto the given canvas.
 * Shared by the download and the on-page preview so both look identical.
 */
export async function renderQrCodeToCanvas(canvas, text, logoSrc = "/favicon.svg", canvasSize = 1024) {
    canvas.width = canvasSize
    canvas.height = canvasSize

    const ctx = canvas.getContext("2d")
    if (!ctx) {
        throw new Error("Unable to obtain 2D canvas context.")
    }

    // Error Correction Level 'H' provides up to ~30% recovery capability
    const qr = QRCode.create(text, {
        errorCorrectionLevel: "H"
    })

    const matrixSize = qr.modules.size
    const marginModules = 3
    const totalModules = matrixSize + marginModules * 2
    const moduleSize = canvasSize / totalModules
    const offset = marginModules * moduleSize

    // Fill clean white background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    // Calculate reserved center zone for the embedded logo in matrix units
    let logoModuleSpan = Math.round(matrixSize * 0.22)
    if ((matrixSize - logoModuleSpan) % 2 !== 0) {
        logoModuleSpan += 1
    }
    const logoStartModule = (matrixSize - logoModuleSpan) / 2
    const logoEndModule = logoStartModule + logoModuleSpan - 1

    const isLogoModule = (row, col) => {
        return row >= logoStartModule && row <= logoEndModule && col >= logoStartModule && col <= logoEndModule
    }

    const isFinderModule = (row, col) => {
        // Top-left finder
        if (row < 7 && col < 7) return true
        // Top-right finder
        if (row < 7 && col >= matrixSize - 7) return true
        // Bottom-left finder
        if (row >= matrixSize - 7 && col < 7) return true
        return false
    }

    const dotRadius = moduleSize * 0.28
    const darkColor = "#101010"

    // 1. Draw Data Modules (excluding reserved logo area and finder patterns)
    ctx.fillStyle = darkColor
    for (let row = 0; row < matrixSize; row++) {
        for (let col = 0; col < matrixSize; col++) {
            if (isFinderModule(row, col) || isLogoModule(row, col)) {
                continue
            }

            if (qr.modules.get(row, col)) {
                const x = offset + col * moduleSize
                const y = offset + row * moduleSize
                drawRoundedRect(ctx, x, y, moduleSize, moduleSize, dotRadius)
                ctx.fill()
            }
        }
    }

    // 2. Draw Finder Patterns (Eyes) with polished modern geometry
    const drawFinderPattern = (originRow, originCol) => {
        const x = offset + originCol * moduleSize
        const y = offset + originRow * moduleSize
        const size7 = 7 * moduleSize
        const size5 = 5 * moduleSize
        const size3 = 3 * moduleSize

        // Outer 7x7 dark box
        ctx.fillStyle = darkColor
        drawRoundedRect(ctx, x, y, size7, size7, moduleSize * 1.5)
        ctx.fill()

        // Inner 5x5 white box
        ctx.fillStyle = "#ffffff"
        drawRoundedRect(ctx, x + moduleSize, y + moduleSize, size5, size5, moduleSize * 1.0)
        ctx.fill()

        // Center 3x3 dark dot
        ctx.fillStyle = darkColor
        drawRoundedRect(ctx, x + 2 * moduleSize, y + 2 * moduleSize, size3, size3, moduleSize * 0.7)
        ctx.fill()
    }

    drawFinderPattern(0, 0)
    drawFinderPattern(0, matrixSize - 7)
    drawFinderPattern(matrixSize - 7, 0)

    // 3. Draw Embedded Logo seamlessly in the center matrix clearing
    if (logoSrc) {
        try {
            const logoImage = await loadLogoImageWithFallback(logoSrc, "/android-chrome-512x512.png")

            const logoAreaX = offset + logoStartModule * moduleSize
            const logoAreaY = offset + logoStartModule * moduleSize
            const logoAreaSize = logoModuleSpan * moduleSize

            // Clean background clearing
            ctx.fillStyle = "#ffffff"
            ctx.fillRect(logoAreaX, logoAreaY, logoAreaSize, logoAreaSize)

            // Inner padding so logo seamlessly fits within the grid
            const innerPadding = logoAreaSize * 0.08
            const logoDrawSize = logoAreaSize - innerPadding * 2
            const logoDrawX = logoAreaX + innerPadding
            const logoDrawY = logoAreaY + innerPadding

            ctx.drawImage(logoImage, logoDrawX, logoDrawY, logoDrawSize, logoDrawSize)
        } catch (e) {
            console.warn("Could not load logo for embedded QR code:", e)
        }
    }
}

async function loadLogoImageWithFallback(primarySrc, fallbackSrc) {
    try {
        return await loadLogoImage(primarySrc)
    } catch {
        if (fallbackSrc && fallbackSrc !== primarySrc) {
            return await loadLogoImage(fallbackSrc)
        }
        throw new Error("Logo image could not be loaded")
    }
}

function loadLogoImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => resolve(img)
        img.onerror = (err) => reject(err)
        img.src = src
    })
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath()
    if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x, y, width, height, radius)
    } else {
        const r = Math.min(radius, width / 2, height / 2)
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + width - r, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + r)
        ctx.lineTo(x + width, y + height - r)
        ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
        ctx.lineTo(x + r, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - r)
        ctx.lineTo(x, y + r)
        ctx.quadraticCurveTo(x, y, x + r, y)
        ctx.closePath()
    }
}

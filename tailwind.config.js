import defaultTheme from "tailwindcss/defaultTheme"
import forms from "@tailwindcss/forms"

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx"
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
                display: ["Figtree", ...defaultTheme.fontFamily.sans],
                // Editorial / Swiss / Technical type system used on the homepage.
                editorial: ["DM Serif Display", "Georgia", "serif"],
                grotesk: ["Manrope", ...defaultTheme.fontFamily.sans],
                mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono]
            },
            colors: {
                // Homepage design-token palette (editorial / Swiss / technical).
                paper: "#F5F3ED",
                ink: "#111111",
                // Slightly deepened from the brief's #77736B to clear WCAG AA
                // 4.5:1 against the paper background at small text sizes.
                muted: "#6B675F",
                line: "#D7D4CC",
                accent: {
                    DEFAULT: "#E66054",
                    dark: "#B53E35"
                }
            },
            maxWidth: {
                grid: "1400px"
            },
            fontSize: {
                xs: ["0.75rem", { lineHeight: "1rem" }],
                sm: ["0.875rem", { lineHeight: "1.25rem" }],
                base: ["1rem", { lineHeight: "1.5rem" }],
                lg: ["1.125rem", { lineHeight: "1.75rem" }],
                xl: ["1.25rem", { lineHeight: "1.75rem" }],
                "2xl": ["1.5rem", { lineHeight: "2rem" }],
                "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
                "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
                "5xl": ["3rem", { lineHeight: "1" }],
                "6xl": ["3.75rem", { lineHeight: "1" }]
            },
            fontWeight: {
                normal: "400",
                medium: "500",
                semibold: "600",
                bold: "700",
                black: "900"
            },
            animation: {
                fadeIn: "fadeIn 0.5s ease-in-out",
                slideUp: "slideUp 0.5s ease-in-out",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "bounce-slow": "bounce 2s infinite",
                float: "float 3s ease-in-out infinite"
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" }
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" }
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" }
                }
            }
        },
        colors: {
            white: "#ffffff",
            black: "#000000",
            primary: "#E66054",
            secondary: "#C64C42",
            gray: {
                50: "#f9fafb",
                100: "#f3f4f6",
                200: "#e5e7eb",
                300: "#d1d5db",
                400: "#9ca3af",
                500: "#6b7280",
                600: "#4b5563",
                700: "#374151",
                800: "#1f2937",
                900: "#111827"
            },
            red: {
                50: "#ffebee",
                100: "#ffcdd2",
                200: "#ef9a9a",
                300: "#e57373",
                400: "#ef5350",
                500: "#f44336",
                600: "#e53935",
                700: "#d32f2f",
                800: "#c62828",
                900: "#b71c1c"
            },
            indigo: {
                50: "#e8eaf6",
                100: "#c5cae9",
                200: "#9fa8da",
                300: "#7986cb",
                400: "#5c6bc0",
                500: "#3f51b5",
                600: "#3949ab",
                700: "#303f9f",
                800: "#283593",
                900: "#1a237e"
            },
            sky: {
                50: "#fff1f0",
                100: "#ffe0dd",
                200: "#ffc4be",
                300: "#ffa198",
                400: "#f77c71",
                500: "#E66054",
                600: "#C64C42",
                700: "#a43c34",
                800: "#87332d",
                900: "#702e29"
            },
            green: {
                50: "#d0f8ce",
                100: "#a3ec9b",
                200: "#76e39f",
                300: "#4dd884",
                400: "#32d296",
                500: "#28c76f",
                600: "#22c55e",
                700: "#16a34a",
                800: "#15803d",
                900: "#14532d"
            }
        }
    },

    plugins: [forms]
}

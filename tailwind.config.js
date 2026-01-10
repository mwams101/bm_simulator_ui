import tailwindcss from "@tailwindcss/vite";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#135bec",
                "background-light": "#f6f6f8",
                "background-dark": "#101622",
                "brand-primary": "#0A2540",
                "brand-text-light": "#333333",
                "brand-text-dark": "#E0E6EB",
                "brand-border-light": "#E0E6EB",
                "brand-border-dark": "#333f54",
                "brand-subtle-bg-light": "#F6F9FC",
                "brand-subtle-bg-dark": "#182338",
            },
            fontFamily: {
                display: ["Manrope", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                full: "9999px",
            },
        },
    }
}
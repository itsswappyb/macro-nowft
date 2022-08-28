/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                corbeau: "#0B1725",
                corsair: "#1A5769",
                spritzig: "#75CEE8",
                doctor: "#F9F9F9",
            },
            fontFamily: {
                satoshi: ["Satoshi", "sans-serif"],
                isatoshi: ["SatoshiItalic", "sans-serif"],
            },
            backgroundImage: {
                gradientbg: "url('../public/NowFT_bg.png')",
            },
        },
    },
    plugins: [],
};

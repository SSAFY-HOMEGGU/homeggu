/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      scrollbar: ["rounded"],

      fontFamily: {
        sans: ["Noto Sans kr", "sans-serif"],
        tmoney: ["Tmoney RoundWind", "sans-serif"],
      },
      colors: {
        point1: "#35C5F0",
        point2: "#1696F4",
        greyButton: "#F6F8FA",
        greyButtonText: "#c2c8cB",
        normalText: "#2F3438",
        subText: "#828C94",
        inputText: "#BDBDC3",
        focusRed: "#FF7777",
        focusGreen: "#4BBA89",
        background: "#FAFAFA",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};

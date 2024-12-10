import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    "text-red-600",
    "text-yellow-500",
    "text-purple-500",
    "text-amber-500",
    "text-blue-600",
    "bg-orange-950",
    "bg-sky-400",
    "bg-pink-600",
    "bg-amber-600",
    "bg-red-600" ,
    "bg-yellow-400",
    "bg-green-600",
    "bg-blue-600",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;

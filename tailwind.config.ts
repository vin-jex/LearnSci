/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      colors: {
        forest: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        earth: {
          50: "#fdf8f0",
          100: "#faecd8",
          200: "#f4d5a8",
          300: "#ecb86f",
          400: "#e2933a",
          500: "#d97319",
          600: "#c45c12",
          700: "#a34511",
          800: "#843815",
          900: "#6c2f14",
        },
        ink: {
          50: "#f8f7f4",
          100: "#eeece5",
          200: "#dcd8ca",
          300: "#c4bea8",
          400: "#a89e85",
          500: "#958970",
          600: "#877963",
          700: "#706354",
          800: "#5c5147",
          900: "#4c443c",
          950: "#1a1714",
        },
      },
      backgroundImage: {
        "leaf-pattern":
          "radial-gradient(ellipse at 20% 50%, rgba(34,197,94,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(217,115,25,0.06) 0%, transparent 50%)",
      },
    },
  },
  plugins: [],
};

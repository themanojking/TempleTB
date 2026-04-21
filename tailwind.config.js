/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        lato: ["Lato", "sans-serif"],
      },
      colors: {
        gold: {
          50: "#fdf8ec",
          100: "#faefd0",
          200: "#f5dc9c",
          300: "#efc163",
          400: "#e8a32e",
          500: "#c9880a",
          600: "#a96e08",
          700: "#87530b",
          800: "#6e4110",
          900: "#5b3610",
        },
        crimson: {
          50: "#fdf2f2",
          100: "#fce4e4",
          200: "#fbcece",
          300: "#f7a7a7",
          400: "#f07676",
          500: "#e44c4c",
          600: "#c93030",
          700: "#a82525",
          800: "#8b1a1a",
          900: "#731515",
        },
        temple: {
          stone: "#6b6460",
          ivory: "#faf5e8",
          dark: "#0c0a09",
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #c9880a, #f5d87a, #c9880a)",
        "dark-gradient": "linear-gradient(180deg, #1c1917 0%, #0c0a09 100%)",
        "hero-gradient": "linear-gradient(180deg, rgba(12,10,9,0.8) 0%, rgba(12,10,9,0.4) 50%, rgba(12,10,9,1) 100%)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "bounce-gentle": "bounce 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.4s ease-out forwards",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      boxShadow: {
        "gold-sm": "0 2px 8px rgba(201, 136, 10, 0.2)",
        "gold-md": "0 4px 20px rgba(201, 136, 10, 0.25)",
        "gold-lg": "0 8px 40px rgba(201, 136, 10, 0.3)",
        "crimson-sm": "0 2px 8px rgba(139, 26, 26, 0.2)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.3)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};

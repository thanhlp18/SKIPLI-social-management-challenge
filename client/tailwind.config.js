/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "social-image-gradient":
          "linear-gradient(to right bottom, rgba(77, 201, 230, 0.8), rgba(33, 12, 174, 0.8)), url('/src/assets/sign-in-background.jpg')",
      },
      animation: {
        "animate-spin	": "spin 1s linear infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

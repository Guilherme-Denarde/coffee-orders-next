module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          coffee: {
            light: "#b8aa8e",
            DEFAULT: "#8c7960",
            dark: "#6e5c42",
          },
        },
        fontFamily: {
          sans: ["Inter", "system-ui", "sans-serif"],
          serif: ["Playfair Display", "serif"],
        },
      },
    },
    plugins: [],
  };
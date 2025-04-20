/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        goose: {
          "red-419": "#4A0808",
          "red-420": "#B01212",
        },
      },
      fontFamily: {
        irish: ['"Irish Grover"', "cursive"], // Notice double quotes around Irish Grover
      },
    },
  },
  plugins: [],
};

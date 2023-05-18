/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        lokiPurple: "#570CF8",
        lokiGrey: "#3E4451",
        lokiGreen: "#36D39B",
        lokiDarkGray: "#434654",
        lokiBlack: "#19182F",
        twitterBlue: "#1D9AEF",
        twitterGray: "#EEF3F5",
        twitterPink: "#F8197E",
        twitterRed: "#F4212D",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:
      {
        primary: '#F2CF5B',
        secondary: '#4655C4',
        hover: '#f0d57d',
        background: '#637AD6',
        blanco: '#F9FAF9',
        amarillo: '#f4d87b',
        azulmedio: '#637ad6',
        azulclaro: '#aac3eb',
        azuloscuro: '#4655c4',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;

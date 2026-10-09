import localFont from "next/font/local";
import { Inter } from "next/font/google";

// Fontes da marca. Use apenas fontes cuja licença permita distribuição (ex.: OFL).
// Fontes locais: next/font exige caminhos literais, relativos a este arquivo (brand/fonts/).

/** Texto corrido e interface — vira a variável CSS --font-sans */
export const sansFont = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

/** Títulos e logotipo — vira a variável CSS --font-heading */
export const headingFont = localFont({
  src: "./fonts/montserrat/Montserrat-VariableFont_wght.ttf",
  weight: "100 900",
  style: "normal",
  variable: "--font-heading",
  display: "swap",
});

import localFont from "next/font/local";

// Fontes da marca. next/font exige caminhos literais, relativos a este arquivo:
// coloque os arquivos em brand/fonts/ e ajuste os `path` abaixo.
// Use apenas fontes cuja licença permita distribuição (ex.: OFL).

/** Texto corrido — vira a variável CSS --font-sans */
export const sansFont = localFont({
  src: [
    {
      path: "./fonts/montserrat/Montserrat-VariableFont_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/montserrat/Montserrat-Italic-VariableFont_wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
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

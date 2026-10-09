import localFont from "next/font/local";

// Fontes da marca, em arquivos locais (nada é baixado no build).
// next/font exige caminhos literais, relativos a este arquivo: coloque os arquivos em brand/fonts/
// e ajuste os `path` abaixo. Use apenas fontes cuja licença permita distribuição (ex.: OFL) e
// guarde o arquivo de licença ao lado da fonte.
//   Montserrat: Copyright The Montserrat Project Authors, SIL OFL 1.1 (brand/fonts/montserrat/OFL.txt)
//   Inter:      Copyright The Inter Project Authors, SIL OFL 1.1 (brand/fonts/inter/OFL.txt)

/** Texto corrido e interface — vira a variável CSS --font-sans */
export const sansFont = localFont({
  src: "./fonts/inter/Inter-Variable.ttf",
  weight: "100 900",
  style: "normal",
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

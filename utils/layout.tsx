import { PropsWithChildren } from "hono/jsx";
import { type ThemeName } from "./render-board.js";
import { css, Style } from "hono/css";

const getThemeStyle = (themeName: ThemeName | (string & {})) => {
  return css`
    @font-face {
      font-family: "${themeName}";
      font-display: swap;
      src: url("/public/${themeName}.ttf") format("truetype");
      font-weight: normal;
      font-style: normal;
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC,
        U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
    }

    .font-chess-${themeName} {
      font-family: "${themeName}", serif !important;
    }
  `;
};

const style = (themeName: ThemeName) => css`
  ${getThemeStyle(themeName)}

  ${themeName !== "miscel" ? getThemeStyle("miscel") : ""}
`;

export default function Layout({
  children,
  id,
  themeName,
}: PropsWithChildren<{
  id: number;
  themeName: ThemeName;
}>) {
  return (
    <html>
      <head>
        <title>Chess960 Visualizer | Position {id}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Gelasio:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />

        <link
          rel="preload"
          href={`/public/${themeName}.ttf`}
          as="font"
          type="font/truetype"
          crossorigin="anonymous"
        />

        {themeName !== "miscel" && (
          <link
            rel="preload"
            href="/public/miscel.ttf"
            as="font"
            type="font/truetype"
            crossorigin="anonymous"
          />
        )}

        <Style>{style(themeName)}</Style>

        <link rel="stylesheet" href="/public/preflight.css" />
        <link rel="stylesheet" href="/public/tw.css" />
        <link rel="stylesheet" href="/public/prose.css" />
        <link rel="stylesheet" href="/public/page.css" />
        <link rel="icon" href="/public/favicon.ico" />
      </head>
      <body>
        {children}

        <script
          dangerouslySetInnerHTML={{
            __html: `
            const now = new Date();
            
            document.fonts.ready.then(() => {
              document.body.classList.add("font-loaded");
          })`,
          }}
        />
      </body>
    </html>
  );
}

import { PropsWithChildren } from "hono/jsx";
import { themes, type ThemeName } from "./render-board.js";
import { css, Style } from "hono/css";
import { boardStyles } from "./board.js";
import { Icon } from "./icon.js";

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
  randomId,
  flipped,
  currentPath,
}: PropsWithChildren<{
  id: number;
  themeName: ThemeName;
  randomId: number;
  flipped: boolean;
  currentPath: string;
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
        <Style>{boardStyles}</Style>

        <link rel="stylesheet" href="/public/preflight.css" />
        <link rel="stylesheet" href="/public/tw.css" />
        <link rel="stylesheet" href="/public/prose.css" />
        <link rel="stylesheet" href="/public/page.css" />
        <link rel="icon" href="/public/favicon.ico" />
      </head>
      <body>
        <ControlBar
          themeName={themeName}
          id={id}
          randomId={randomId}
          flipped={flipped}
          currentPath={currentPath}
        />

        {children}

        <Footer />

        <script src="/public/body.js" />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <p class="text-md px-4 py-6 text-center">
      <small>
        <a
          href="https://en.wikipedia.org/wiki/Fischer_random_chess_numbering_scheme"
          rel="noopener noreferrer"
          target="_blank"
        >
          Wikipedia
        </a>
        &nbsp;&bull;&nbsp;
        <a
          href="https://www.chessvariants.com/d.font/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Special thanks to ChessVariants
        </a>
        &nbsp;&bull;&nbsp;
        <a
          href="https://github.com/cwdx/chess960-visualizer"
          rel="noopener noreferrer"
          target="_blank"
        >
          Github
        </a>
        &nbsp;&bull;&nbsp; &copy; {new Date().getFullYear()} Chris Wijnia
      </small>
    </p>
  );
}

function ControlBar({
  themeName,
  id,
  randomId,
  flipped,
  currentPath,
}: {
  themeName: ThemeName;
  id: number;
  randomId: number;
  flipped: boolean;
  currentPath: string;
}) {
  return (
    <div className="control-bar">
      <div className="nav-buttons">
        <a
          href="/518"
          id="standard"
          className={id === 518 ? "button inverted" : "button"}
        >
          Standard&nbsp;&nbsp;
          <Icon icon="filledChessBoard" />
        </a>
        &nbsp;&nbsp;
        <a
          href="/all"
          className={currentPath === "/all" ? "button inverted" : "button"}
        >
          All
        </a>
        &nbsp;&nbsp;
        <a href={`/${randomId}`} id="random" className="button inverted">
          Random&nbsp;&nbsp;
          <span class="text-2xl rotate-45 inline-block -my-1">⚄</span>
        </a>
      </div>

      <form
        action="/change-position"
        method="post"
        name="positionForm"
        className="nav-buttons centered"
      >
        <a href={`/${Math.max(0, id - 1)}`} className="button">
          <Icon icon="filledSplitArrowLeft" />
        </a>
        &nbsp;&nbsp;
        <input
          type="number"
          name="id"
          min="0"
          max="959"
          placeholder="0-959"
          required
          id="position-input"
          value={id}
        />
        <button type="submit" className="button inverted">
          Set<span className="hidden lg:inline">&nbsp;Position</span>
        </button>
        &nbsp;&nbsp;
        <a href={`/${Math.min(959, id + 1)}`} className="button">
          <Icon icon="filledSplitArrowRight" />
        </a>
      </form>

      <form
        action="/change-theme"
        method="post"
        name="themeForm"
        className="hidden"
      >
        <div class="hidden lg:flex">
          <div class="select" style={{ width: "138px" }}>
            <select name="themeName">
              {Object.entries(themes).map(([name]) => (
                <option
                  value={name}
                  selected={name === themeName ? true : undefined}
                  key={name}
                >
                  {name}
                </option>
              ))}
            </select>
          </div>
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="button inverted hidden lg:inline">
            Set Theme
          </button>
          &nbsp;&nbsp;
          <a href={`/next-theme?redirect=${currentPath}`} className="button">
            <Icon icon="filledSplitArrowRight" />
          </a>
        </div>
      </form>

      <div class="nav-buttons">
        <a
          href={`/next-theme?redirect=${currentPath}`}
          className="button inverted lg:hidden"
          title={themeName}
        >
          Next Chess Set
        </a>
        &nbsp;&nbsp;
        <a
          href={`/flip?redirect=${currentPath}`}
          className={flipped ? "button inverted" : "button"}
        >
          Flip
        </a>
      </div>
    </div>
  );
}

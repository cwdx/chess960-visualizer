import { CSSProperties } from "hono/jsx";
import { getPosition, generateFen } from "./get-position";
import { MiscelKey, miscelMap } from "./miscel";
import { renderBoard, ThemeName, themes } from "./render-board";
import { markdownToHtml } from "./markdown";
import { Video } from "./get-video";

const getThemeStyle = (themeName: ThemeName | (string & {})) => {
  return `
    @font-face {
      font-family: '${themeName}';
      font-display: swap;
      src: url('/public/${themeName}.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }

    .font-chess-${themeName} {
      font-family: '${themeName}', serif !important;
    }
  `;
};

const style = (themeName: ThemeName) => `
* {
  box-sizing: border-box;
}

${getThemeStyle(themeName)}

${themeName !== "miscel" ? getThemeStyle("miscel") : ""}

:root {
  --background-color: #F5F0DD;
  --text-color: #3C3433;
  --panel-color: #D7D3C2;
  --link-color: #8B5A2B;
}
  

body {
  background-color: var(--background-color);
  font-family: Georgia, 'Times New Roman', serif;
  color: var(--text-color);
  margin: 0;
  padding: 0;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-smooth: always;
}

a {
  color: var(--text-color);
  font-weight: 500;
}

main {
  padding: 30px 20px;
  margin: 0 auto;
  max-width: 1000px;
  text-align: center;
}

.fcm {
    display: inline-block;
    font: normal normal normal 18px/1 ChessMerida;
    font-size: 64px;
    text-rendering: auto;
    white-space: pre;
    width: fit-content;
    height: fit-content;
    text-align: left;
}

mark {
  background-color: var(--text-color);
  color: var(--background-color);
  padding: 2px 4px;
}

mark.inverted {
  background-color: var(--panel-color);
  color: var(--text-color);
}

h1 {
  line-height: 1;
}


.button {
  font: inherit;
  font-size: 18px;
  padding: 10px;
  border: 1px solid var(--text-color);
  border-radius: 0;
  outline: none;
  appearance: none;
  color: var(--text-color);
  text-decoration: none;
  cursor: pointer;
  background-color: var(--background-color);
  display: inline-block;
  height: 40px;
}

.button.inverted {
  background-color: var(--text-color);
  color: var(--background-color);
}

pre {
  font: inherit;
  font-size: 16px;
  font-family: "Courier New", monospace;
  font-weight: 400;
  font-size: 18px;
  padding: 7px;
  border: 0px solid var(--text-color);
  border-radius: 0;
  outline: none;
  background-color: var(--panel-color);
  display: inline-block;
}

input[type="number"] {
  font: inherit;
  font-size: 18px;
  padding: 10px;
  background-color: var(--panel-color);
  color: var(--text-color);
  border: 1px solid var(--text-color);
  border-radius: 0;
  outline: none;
  display: inline-block;
  width: 4.5em;
  appearance: none;
  height: 40px;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.select select {
  font: inherit;
  font-size: 18px;
  padding: 10px;
  background-color: var(--panel-color);
  color: var(--text-color);
  border: 1px solid var(--text-color);
  border-radius: 0;
  outline: none;
  display: inline-block;
  width: 4.5em;
  width: 100%;
  position: relative;
  height: 40px;
  appearance: none;
}

.select {
  position: relative;
  width: 150px;
  display: inline-block;
}

.select:after {
  content: "${miscelMap.filledSplitArrowDown}";
  font-family: "miscel";
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.chess-board {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 3px;
  border: 2px solid var(--text-color);
}

.control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 10px;
  padding: 7px;
  border-bottom: 1px solid var(--text-color);
  background-color: var(--background-color);
  margin-bottom: 24px;
}

.nav-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.nav-buttons.centered {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

[hidden] {
  display: none;
}

.prose {
  /* Base typography */
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.6;
  color: var(--text-color);
  max-width: 65ch;
  margin: 0 auto;
  text-align: left;
}

.prose h1, 
.prose h2, 
.prose h3 {
  color: var(--text-color);
  font-weight: normal;
  line-height: 1.3;
  margin-top: 2.5em;
  margin-bottom: 0.8em;
}

.prose h1 {
  font-size: 1.8rem;
  border-bottom: 1px solid var(--panel-color);
  padding-bottom: 0.3em;
}

.prose h2 {
  font-size: 1.5rem;
  margin-top: 2em;
}

.prose h3 {
  font-size: 1.3rem;
}

.prose p {
  margin-bottom: 1.5em;
}

.prose a {
  color: var(--link-color);
  text-decoration: none;
  border-bottom: 1px solid var(--panel-color);
  transition: border-color 0.2s ease;
}

.prose a:hover {
  border-bottom-color: var(--link-color);
}

.prose ul, 
.prose ol {
  margin-bottom: 1.5em;
  padding-left: 1.5em;
}

.prose li {
  margin-bottom: 0.5em;
}

.prose ul {
  list-style-type: disc;
}

.prose ol {
  list-style-type: decimal;
}

.prose strong {
  font-weight: 600;
}

.prose em {
  font-style: italic;
}

.prose blockquote {
  border-left: 3px solid var(--panel-color);
  padding-left: 1.5em;
  margin-left: 0;
  font-style: italic;
  color: rgba(var(--text-color-rgb), 0.8);
}

.prose code {
  font-family: "Courier New", monospace;
  background-color: var(--panel-color);
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.9em;
}

.prose pre {
  background-color: var(--panel-color);
  padding: 1em;
  overflow-x: auto;
  margin-bottom: 1.5em;
  font-family: "Courier New", monospace;
  font-size: 0.9em;
  border: 1px solid rgba(var(--text-color-rgb), 0.1);
}

/* Chess-specific styling */
.prose .chess-notation {
  font-family: 'ChessMerida', serif;
  font-size: 1.2em;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .prose {
    padding: 0 1rem;
  }
  
  .prose h1 {
    font-size: 1.6rem;
  }
  
  .prose h2 {
    font-size: 1.4rem;
  }
  
  .prose h3 {
    font-size: 1.2rem;
  }
}





.video-card {
  margin-bottom: 1.5rem;
  background-color: var(--panel-color);
  padding: 0;
  max-width: 65ch;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .video-card {
    max-width: calc(100% - 2rem);
  }
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.video-info {
  padding: 16px;
}

.video-info h3 a {
  color: var(--text-color);
  text-decoration: none;
}

.video-info h3 {
  margin: 0 0 10px;
}

.video-info h4 {
  margin: 0;
  font-weight: normal;
  font-size: 1.1rem;
}

.video-channel {
  margin: 0;
  font-size: 0.9rem;
  color: var(--link-color);
}
`;

export default function Page({
  id,
  themeName,
  flipped,
  content,
  video,
}: {
  id: number;
  themeName: ThemeName;
  flipped: boolean;
  content: string;
  video: Video;
}) {
  const position = getPosition(id);
  const fen = generateFen(position);
  const board = renderBoard(fen, themeName, flipped);

  return (
    <html>
      <head>
        <title>Chess960 Visualizer | Position {id}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style dangerouslySetInnerHTML={{ __html: style(themeName) }} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ControlBar themeName={themeName} id={id} />

        <main style={{ textAlign: "center" }}>
          {/*
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {Object.entries(themes).map(([name]) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                backgroundColor: "var(--panel-color)",
                padding: "10px",
              }}
            >
              <ChessBoard
                board={renderBoard(generateFen(fen), name as ThemeName)}
                themeName={name as ThemeName}
                size={36}
              />
              <div style={{ fontSize: "12px", textAlign: "center" }}>
                {name}
              </div>
            </div>
          ))}
        </div>
        */}

          <ChessBoard board={board} themeName={themeName} size={60} />

          <h1
            style={{
              color: "var(--text-color)",
              margin: "32px 0 24px",
              border: "none",
              padding: "0",
            }}
          >
            Chess960 Position <mark>{id}</mark>{" "}
            <mark className="inverted">{position.toLowerCase()}</mark>
          </h1>

          <div>
            <pre style={{ fontSize: "13px" }}>
              <MiscelCharacter char="scoreSheet" />
              &nbsp;
              {fen}
            </pre>
          </div>

          <pre style={{ width: "100%" }} hidden>
            {Object.keys(miscelMap).map((v) => (
              <div style={{ fontSize: "18px", textAlign: "left" }}>
                <MiscelCharacter
                  char={v as MiscelKey}
                  style={{ fontSize: "48px" }}
                />
                &nbsp;
                {v}
              </div>
            ))}
            \
          </pre>

          <br />
          <br />

          <VideoPlayer video={video} />

          <article
            dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
            className="prose"
          />
        </main>

        <Footer />
      </body>
    </html>
  );
}

function ChessBoard({
  board,
  themeName,
  size = 64,
}: {
  board: string;
  themeName: ThemeName;
  size?: number;
}) {
  return (
    <div className="chess-board">
      <div
        className={`fcm font-chess-${themeName}`}
        style={{
          fontSize: `${size}px`,
        }}
        dangerouslySetInnerHTML={{
          __html: board,
        }}
      />
    </div>
  );
}

function MiscelCharacter({
  char,
  style,
}: {
  char: MiscelKey;
  style?: CSSProperties;
}) {
  const v = miscelMap[char];
  return (
    <span
      class="font-chess-miscel"
      style={{ verticalAlign: "baseline", ...style }}
    >
      {v}
    </span>
  );
}

function Footer() {
  return (
    <p style={{ fontSize: "16px", textAlign: "center", marginBottom: "24px" }}>
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

function ControlBar({ themeName, id }: { themeName: ThemeName; id: number }) {
  return (
    <div className="control-bar">
      <div className="nav-buttons">
        <a href="/518" id="standard" className="button">
          Standard&nbsp;&nbsp;
          <MiscelCharacter char="filledChessBoard" />
        </a>
        &nbsp;&nbsp;
        <a href="/random" id="random" className="button inverted">
          Shuffle&nbsp;&nbsp;
          <MiscelCharacter char="filledQuestionMark" />
        </a>
      </div>

      <form
        action="/change-position"
        method="post"
        name="positionForm"
        className="nav-buttons centered"
      >
        <a href={`/${Math.max(0, id - 1)}`} className="button">
          <MiscelCharacter char="filledSplitArrowLeft" />
        </a>
        &nbsp;&nbsp;
        <input
          type="number"
          name="id"
          min="0"
          max="959"
          placeholder="0-959"
          required
          value={id}
        />
        <button type="submit" className="button inverted">
          Set Position
        </button>
        &nbsp;&nbsp;
        <a href={`/${Math.min(959, id + 1)}`} className="button">
          <MiscelCharacter char="filledSplitArrowRight" />
        </a>
      </form>

      <form
        action="/change-theme"
        method="post"
        name="themeForm"
        className="nav-buttons"
      >
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
        <button type="submit" className="button inverted">
          Set Theme
        </button>
        &nbsp;&nbsp;
        <a href={`/next-theme?redirect=/${id}`} className="button">
          <MiscelCharacter char="filledSplitArrowRight" />
        </a>
        &nbsp;&nbsp;
        <a href={`/flip?redirect=/${id}`} className="button">
          Flip
        </a>
      </form>
    </div>
  );
}

function extractYoutubeId(url: string) {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function VideoPlayer({ video }: { video: Video }) {
  const id = extractYoutubeId(video.url);
  const embedUrl = `https://www.youtube.com/embed/${id}`;
  const channelUrl = `https://www.youtube.com/${video.channel}`;

  return (
    <div class="video-card">
      <div class="video-container">
        <iframe
          width="560"
          height="315"
          src={embedUrl}
          title={video.title}
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div class="video-info">
        <h3>
          <a
            href={video.url}
            class="video-title"
            target="_blank"
            rel="noopener noreferrer"
          >
            {video.title}
          </a>
        </h3>

        <h4>
          <a
            href={channelUrl}
            class="video-channel"
            target="_blank"
            rel="noopener noreferrer"
          >
            @{video.channel}
          </a>{" "}
          {video.description}
        </h4>
      </div>
    </div>
  );
}

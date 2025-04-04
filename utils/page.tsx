import { type CSSProperties } from "hono/jsx";
import { getPosition, generateFen, positionToId } from "./get-position.js";
import { MiscelKey, miscelMap } from "./miscel.js";
import { renderBoard, ThemeName, themes } from "./render-board.js";
import { markdownToHtml } from "./markdown.js";
import { type Video } from "./get-video.js";

export default function Page({
  id,
  themeName,
  flipped,
  content,
  video,
  randomId,
}: {
  id: number;
  themeName: ThemeName;
  flipped: boolean;
  content: string;
  video: Video;
  randomId: number;
}) {
  const position = getPosition(id);
  const fen = generateFen(position);
  const board = renderBoard(fen, themeName, flipped);

  const _id = positionToId(position);

  console.log({ _id });

  return (
    <>
      <ControlBar themeName={themeName} id={id} randomId={randomId} />

      <main style={{ textAlign: "center" }}>
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
    </>
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

function ControlBar({
  themeName,
  id,
  randomId,
}: {
  themeName: ThemeName;
  id: number;
  randomId: number;
}) {
  return (
    <div className="control-bar">
      <div className="nav-buttons">
        <a href="/518" id="standard" className="button">
          Standard&nbsp;&nbsp;
          <MiscelCharacter char="filledChessBoard" />
        </a>
        &nbsp;&nbsp;
        <a href={`/${randomId}`} id="random" className="button inverted">
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

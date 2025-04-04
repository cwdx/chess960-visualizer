import { type CSSProperties } from "hono/jsx";
import { getPosition, generateFen, positionToId } from "./get-position.js";
import { MiscelKey, miscelMap } from "./miscel.js";
import { Piece as TPiece, renderBoard, ThemeName, themes } from "./render-board.js";
import { markdownToHtml } from "./markdown.js";
import { type Video } from "./get-video.js";
import { generateChessCoordinates } from "./get-instructions.js";
import { Board } from "./board.js";
import { Piece } from "./piece.js";

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
  const instructions = generateChessCoordinates(position);

  return (
    <>
      <ControlBar themeName={themeName} id={id} randomId={randomId} />

      <div class="p-4 md:p-6 lg:p-8">
        <main class="default-container">
          <div class="text-center">
            <h1 class="text-3xl mb-6 mx-auto">
              Chess960 Position <mark>{id}</mark>
            </h1>
            <Board board={board} themeName={themeName} isFlipped={flipped} />
          </div>

          <article class="my-8 text-center">
            <div className="flex flex-row gap-4">
              <div className="flex-1">
                <h3 class="text-2xl mb-5 font-medium">
                  <Piece
                    piece={position[0] as TPiece}
                    themeName={themeName}
                    darkSquare
                    className="text-3xl align-text-top mr-1"
                  />
                  Setup as White
                </h3>
                <p className="whitespace-pre-wrap">{instructions.white}</p>
              </div>
              <div className="flex-1">
                <h3 class="text-2xl mb-5 font-medium">
                  <Piece
                    piece={position[0].toLowerCase() as TPiece}
                    themeName={themeName}
                    className="text-3xl align-text-top mr-1"
                  />
                  Setup as Black
                </h3>
                <p className="whitespace-pre-wrap">{instructions.black}</p>
              </div>
            </div>

            <p className="whitespace-pre-wrap italic mb-4 mt-4">
              <Icon icon="invitationLetter" className="align-top" />
              &nbsp;&nbsp;{instructions.notes} FEN:
            </p>

            <pre class="text-sm inline-block w-full p-1 px-2 overflow-x-auto">
              <Icon icon="scoreSheet" />
              &nbsp;
              {fen}
            </pre>
          </article>

          <VideoPlayer video={video} />

          <hr class="mb-12 border-none" />

          <article
            dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
            className="prose"
          />
        </main>
      </div>

      <Footer />
    </>
  );
}

function Icon({
  icon: char,
  style,
  className,
}: {
  icon: MiscelKey;
  style?: CSSProperties;
  className?: string;
}) {
  const v = miscelMap[char];
  return (
    <span
      class={`font-chess-miscel inline ${className}`}
      style={{ verticalAlign: "bottom", ...style }}
    >
      {v}
    </span>
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
          <Icon icon="filledChessBoard" />
        </a>
        &nbsp;&nbsp;
        <a href={`/${randomId}`} id="random" className="button inverted">
          Shuffle&nbsp;&nbsp;
          <Icon icon="filledQuestionMark" />
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
          value={id}
        />
        <button type="submit" className="button inverted">
          Set Position
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
          <Icon icon="filledSplitArrowRight" />
        </a>
        &nbsp;&nbsp;
        <a href={`/flip?redirect=/${id}`} className="button">
          Flip
        </a>
      </form>
    </div>
  );
}

function VideoPlayer({ video }: { video: Video }) {
  const embedUrl = `https://www.youtube.com/embed/${video.id}`;
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
      <div class="video-info text-center">
        <h3 class="text-lg mb-2 font-medium">
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

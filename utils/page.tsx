import { useEffect } from "hono/jsx";
import { getPosition, generateFen, fenToPgn } from "./get-position.js";
import { Icon } from "./icon.js";
import {
  Piece as TPiece,
  renderBoard,
  ThemeName,
  themes,
} from "./render-board.js";
import { markdownToHtml } from "./markdown.js";
import { type Video } from "./get-video.js";
import { getInstructions } from "./get-instructions.js";
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
  const instructions = getInstructions(position);

  return (
    <div class="p-4 md:p-6 lg:p-8">
      <main class="default-container">
        <div class="text-center">
          <h1 class="text-3xl mb-6 mx-auto">
            Chess960 Position <mark>#{id}</mark>
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

          <hr class="my-6 border-none" />

          <h5 class="text-sm font-medium text-left my-2">
            <Icon icon="scoreSheet" /> Starting Rank
          </h5>
          <pre class="text-sm inline-block w-full p-1 px-2 overflow-x-auto text-left">
            {position}
          </pre>

          <h5 class="text-sm font-medium text-left my-2">
            <Icon icon="scoreSheet" /> FEN
          </h5>
          <pre class="text-sm inline-block w-full p-1 px-2 overflow-x-auto text-left">
            {fen}
          </pre>

          <h5 class="text-sm font-medium text-left my-2">
            <Icon icon="scoreSheet" /> PGN
          </h5>
          <pre class="text-sm inline-block w-full p-1 px-2 overflow-x-auto text-left">
            {fenToPgn(fen)}
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
        <h3 class="text-lg mb-2">
          <a
            href={video.url}
            class="video-title font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            {video.title}
          </a>
        </h3>

        <a
          href={channelUrl}
          class="video-channel"
          target="_blank"
          rel="noopener noreferrer"
        >
          @{video.channel}
        </a>
        {" - "}
        {video.description}
      </div>
    </div>
  );
}

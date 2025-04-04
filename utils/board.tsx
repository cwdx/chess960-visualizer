import { Style, css } from "hono/css";
import { ThemeName } from "./render-board";
import { CSSProperties } from "hono/jsx";

export const boardStyles = css`
  .chess-board {
    position: relative;
    border: 2px solid var(--text-color);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 3px;
  }

  .show-coordinates .chess-board {
    border: var(--rim-size) solid var(--text-color);
  }

  .x-coordinates {
    bottom: 0;
    left: 0;
    width: calc(var(--square-size) * 8);
  }

  .x-coordinates div {
    width: var(--square-size);
    text-align: center;
    height: var(--rim-size);
    line-height: var(--rim-size);
  }

  .y-coordinates {
    top: 0;
    left: 0;
    height: calc(var(--square-size) * 8);
    flex-direction: column;
    justify-content: space-between;
  }

  .y-coordinates div {
    height: var(--square-size);
    text-align: center;
    line-height: var(--square-size);
    width: var(--rim-size);
  }

  .x-coordinates,
  .y-coordinates {
    font-size: calc(var(--square-size) * 0.2);
    color: var(--background-color);
    position: absolute;
    z-index: 1;
    display: none;
    font-weight: bold;
    text-transform: lowercase;
  }

  .show-coordinates .x-coordinates,
  .show-coordinates .y-coordinates {
    display: flex;
  }
`;

export function Board({
  board,
  themeName,
  isFlipped = false,
  showCoordinates = false,
  className = "",
  style,
}: {
  board: string;
  themeName: ThemeName;
  isFlipped?: boolean;
  showCoordinates?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <>
      <XCoordinates isFlipped={isFlipped} />
      <YCoordinates isFlipped={isFlipped} />

      <div
        className={`chess-board fcm mx-auto font-chess-${themeName} ${className}`}
        style={style}
        dangerouslySetInnerHTML={{
          __html: board,
        }}
      />
    </>
  );
}

function XCoordinates({ isFlipped }: { isFlipped: boolean }) {
  const _x = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const x = isFlipped ? _x.reverse() : _x;

  return (
    <div className="x-coordinates">
      {x.map((coordinate) => (
        <div key={coordinate}>
          {isFlipped ? coordinate : coordinate.toUpperCase()}
        </div>
      ))}
    </div>
  );
}

function YCoordinates({ isFlipped }: { isFlipped: boolean }) {
  const _y = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const y = isFlipped ? _y : _y.reverse();

  return (
    <div className="y-coordinates">
      {y.map((coordinate) => (
        <div key={coordinate}>
          {isFlipped ? coordinate : coordinate.toUpperCase()}
        </div>
      ))}
    </div>
  );
}

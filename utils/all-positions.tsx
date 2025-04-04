import { Board } from "./board";
import { getInstructions } from "./get-instructions";
import { fenToPgn, generateFen, getPosition } from "./get-position";
import { Icon } from "./icon";
import { renderBoard } from "./render-board";

export function AllPositions({ themeName }: { themeName: ThemeName }) {
  const totalPosition = 960;
  const positions = Array.from({ length: totalPosition }, (_, id) => {
    const position = getPosition(id);
    const fen = generateFen(position);

    return {
      id,
      fen: generateFen(position),
      pgn: fenToPgn(fen),
      instructions: getInstructions(position),
      position,
    };
  });

  return (
    <div class="p-4 md:p-6 lg:p-8">
      <div class="default-container">
        <table class="w-full max-auto">
          {positions.map((position, i) => (
            <tr
              key={position.id}
              class={"border-b" + (i % 2 === 0 ? "panessl-alt" : "")}
              id={`position-${position.id}`}
              style={{
                borderBottom: "1px solid var(--text-color)",
              }}
            >
              <td class="font-medium text-lg px-0 pl-2 align-middle">
                <a href={`/${position.id}`} cl>
                  #{position.id}
                </a>
                &nbsp;&nbsp;
              </td>
              <td class="px-0 align-middle">
                <code class="panel px-1 font-mono text-sm">
                  {position.position}
                </code>
              </td>
              <td class="text-right px-0 py-3 align-middle">
                <a href={`/${position.id}`} class="no-underline ">
                  <Board
                    key={position.id}
                    board={renderBoard(position.position, themeName, false)}
                    themeName={themeName}
                    isFlipped={false}
                    className="border-none p-0 text-right"
                    style={{
                      "--square-size": "2rem",
                      display: "block",
                      margin: "0 0 0 auto",
                    }}
                    showCoordinates={false}
                  />
                </a>
              </td>
              <td class="text-right px-2 align-middle">
                <a href={`/${position.id}`} class="button inverted small">
                  Open
                </a>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}

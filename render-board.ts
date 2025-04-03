//RMBWKVNT
//OPOPOPOP
// / / / /
/// / / /
// / / / /
/// / / /
//popopopo
//tnvqlbmr

//tMvWlVmT
//OoOoOoOo
// + + + +
//+ + + +
// + + + +
//+ + + +
//pPpPpPpP
//RnBqKbNr

import fs from "fs";

export const _renderFen = (fen: string): string => {
  const piecePlacement = fen.split(" ")[0];
  const ranks = piecePlacement.split("/");
  const board = new Array(8).fill("").map(() => new Array(8).fill(""));

  ranks.forEach((rank, i) => {
    let squareIndex = 0;
    for (let j = 0; j < rank.length; j++) {
      const char = rank[j];
      const len = parseInt(char);
      if (isNaN(len)) {
        console.log("char", char);
      } else {
        console.log("len", len);

        for (let k = 0; k < len; k++) {
          console.log("k", k);
        }
      }
    }
  });

  return board.map((row) => row.join("")).join("\n");
};

const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const oldRenderFen = (fen: string): string => {
  const piecePlacement = fen.split(" ")[0];
  const ranks = piecePlacement.split("/");
  const board = new Array(8).fill("").map(() => new Array(8).fill(""));

  // Process each rank
  for (let rankIndex = 0; rankIndex < ranks.length; rankIndex++) {
    const rank = ranks[rankIndex];
    let squareIndex = 0;

    for (let i = 0; i < rank.length; i++) {
      const char = rank[i];
      if (isNaN(parseInt(char))) {
        board[rankIndex][squareIndex] = template[char][i % 2 === 1 ? 0 : 1];
        squareIndex++;
      } else {
        const emptyCount = parseInt(char);
        for (let j = 0; j < emptyCount; j++) {
          board[rankIndex][squareIndex] = template.e[i % 2 === 1 ? 0 : 1];
          squareIndex++;
        }
      }
    }
  }

  return board
    .map((row) => row.join(""))
    .join("\n")
    .trim();
};

function renderFen(fen: string) {
  const boardPart = fen.split(" ")[0];
  const rows = boardPart.split("/");
  const board: string[][] = [];

  for (const row of rows) {
    const boardRow: string[] = [];
    for (const char of row) {
      if (!isNaN(Number(char))) {
        const emptyCount = Number(char);
        for (let i = 0; i < emptyCount; i++) {
          boardRow.push("+");
        }
      } else {
        boardRow.push(char);
      }
    }
    board.push(boardRow);
  }

  return board
    .map((row) => row.join(""))
    .join("\n")
    .trim();
}

type OddEven = [odd: string, even: string];

type Theme = {
  // Black
  k: OddEven;
  q: OddEven;
  r: OddEven;
  b: OddEven;
  n: OddEven;
  p: OddEven;

  // White
  K: OddEven;
  Q: OddEven;
  R: OddEven;
  B: OddEven;
  N: OddEven;
  P: OddEven;

  // Empty
  "+": OddEven;
};

const meridaTheme: Theme = {
  k: ["L", "l"],
  q: ["W", "w"],
  r: ["T", "t"],
  b: ["V", "v"],
  n: ["M", "m"],
  p: ["O", "o"],

  K: ["K", "k"],
  Q: ["Q", "q"],
  R: ["R", "r"],
  B: ["B", "b"],
  N: ["N", "n"],
  P: ["P", "p"],

  "+": ["+", " "],
};

const lucenaTheme: Theme = {
  ...meridaTheme,
  "+": ["+", "  "],
};

const utrechtTheme: Theme = {
  // Black pieces
  k: ["L", "K"], // Black king: odd = "L" (black square), even = "K" (white square)
  q: ["W", "Q"], // Black queen: odd = "W", even = "Q"
  r: ["T", "R"], // Black rook: odd = "T", even = "R"
  b: ["V", "B"], // Black bishop: odd = "V", even = "B"
  n: ["M", "N"], // Black knight: odd = "M", even = "N"
  p: ["O", "P"], // Black pawn: odd = "O", even = "P"

  // White pieces
  K: ["l", "k"], // White king: odd = "l", even = "k"
  Q: ["w", "q"], // White queen: odd = "w", even = "q"
  R: ["t", "r"], // White rook: odd = "t", even = "r"
  B: ["v", "b"], // White bishop: odd = "v", even = "b"
  N: ["m", "n"], // White knight: odd = "m", even = "n"
  P: ["o", "p"], // White pawn: odd = "o", even = "p"

  // Empty square
  "+": ["/", " "], // odd = "/" (black square), even = " " (white square)
};

function applyTheme(renderedFen: string, themeMap: Theme, flipped = true) {
  try {
    const board = renderedFen.split("\n").map((row) => row.split(""));
    const newBoard: string[][] = [];

    for (let i = 0; i < board.length; i++) {
      const newRow: string[] = [];
      for (let j = 0; j < board[i].length; j++) {
        const char = board[i][j] as keyof Theme;
        const themeChar = themeMap[char];
        const isOdd = (i + j) % 2 === 1;
        newRow.push(isOdd ? themeChar[0] : themeChar[1]);
      }
      newBoard.push(newRow);
    }

    if (flipped) {
      newBoard.reverse();
      newBoard.forEach((row) => row.reverse());
    }

    return newBoard
      .map((row) => row.join(""))
      .join("\n")
      .trim();
  } catch (e) {
    console.log("error", e);
    return applyTheme(renderedFen, meridaTheme);
  }
}

const expectedTheme = `tMvWlVmT
OoOoOoOo
 + + + +
+ + + + 
 + + + +
+ + + + 
pPpPpPpP
RnBqKbNr`;

// onst rendered = renderFen(defaultFen);
// / console.log(rendered);
// / console.log("\n");
// onst theme = applyTheme(rendered, utrechtTheme);
// onsole.log(theme);
// onsole.log("\n");
// onsole.log(expectedTheme);
//
// onsole.log("equal", theme === expectedTheme);

//console.log("new", renderFen(defaultFen));

// read file with bun sync
export const miscelKitchenSink = fs.readFileSync("unicode.txt", "utf8");

export const themes = {
  merida: meridaTheme,
  utrecht: utrechtTheme,
  motif: meridaTheme,
  adventurer: meridaTheme,
  alfonsox: meridaTheme,
  condal: meridaTheme,
  harlequin: meridaTheme,
  kingdom: meridaTheme,
  leipzig: meridaTheme,
  line: meridaTheme,
  lucena: lucenaTheme,
  magnetic: meridaTheme,
  miscel: meridaTheme,
  maya: meridaTheme,
  mark: meridaTheme,
  mediaeval: meridaTheme,
  millennia: meridaTheme,
  millennia2: meridaTheme,
} as const satisfies Record<string, Theme>;

export type ThemeName = keyof typeof themes;

export function renderBoard(fen: string, themeName: ThemeName, flipped = false) {
  const rendered = renderFen(fen);
  const theme = applyTheme(rendered, themes[themeName], flipped);
  return theme;
}

export const defaultFen =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

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
  k: ["L", "K"],
  q: ["W", "Q"],
  r: ["T", "R"],
  b: ["V", "B"],
  n: ["M", "N"],
  p: ["O", "P"],

  // White piece
  K: ["l", "k"],
  Q: ["w", "q"],
  R: ["t", "r"],
  B: ["v", "b"],
  N: ["m", "n"],
  P: ["o", "p"],

  // Empty square
  "+": ["/", " "],
};

function applyTheme(renderedFen: string, themeMap: Theme, flipped = true): string {
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

export function renderBoard(
  fen: string,
  themeName: ThemeName,
  flipped = false
) {
  const rendered = renderFen(fen);
  const theme = applyTheme(rendered, themes[themeName], flipped);
  return theme;
}

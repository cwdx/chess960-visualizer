const divmod = (a: number, b: number) => [Math.floor(a / b), a % b];

export const validateId = (id: unknown) => {
  if (typeof id === "string") id = parseInt(id);
  if (typeof id !== "number") throw new Error("invalid");
  if (id < 0 || id > 959 || id % 1 !== 0) throw new Error("invalid");
  return id;
};

export const getRandomId = () => Math.floor(Math.random() * 960);

const knightMap: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 3],
  [2, 4],
  [3, 4],
];

export const getPosition = (n = getRandomId()) => {
  validateId(n);

  const board = new Array(8).fill("R");

  const getEmptyIdxs = () =>
    board.map((v, idx) => (v === "R" ? idx : -1)).filter((i) => i > -1);

  // Bishop 1
  // a) [x] Divide N by 4, yielding quotient N2 and remainder B1. Place a Bishop upon the bright square corresponding to B1 (0=b, 1=d, 2=f, 3=h).
  const [n2, b1] = divmod(n, 4);
  const b1Idx = b1 * 2 + 1;
  board[b1Idx] = "B";

  // Bishop 2
  // b) [x] Divide N2 by 4 again, yielding quotient N3 and remainder B2. Place a second Bishop upon the dark square corresponding to B2 (0=a, 1=c, 2=e, 3=g).
  const [n3, b2] = divmod(n2, 4);
  const b2Idx = b2 * 2; // todo modulo?
  board[b2Idx] = "B";

  // Queen
  // c) Divide N3 by 6, yielding quotient N4 and remainder Q. Place the Queen according to Q, where 0 is the first free square starting from a, 1 is the second, etc.
  const [n4, q] = divmod(n3, 6);
  let emptyIdxs = getEmptyIdxs();
  board[emptyIdxs[q]] = "Q";

  // Knights
  // d) N4 will be a single digit, 0 ... 9. Ignoring Bishops and Queen, find the positions of two Knights within the remaining five spaces. Place the Knights according to its value by consulting the following N5N table:
  const [n1Idx, n2Idx] = knightMap[n4];
  emptyIdxs = getEmptyIdxs();
  board[emptyIdxs[n1Idx]] = "N";
  board[emptyIdxs[n2Idx]] = "N";

  // King
  // e) There are three blank squares remaining; place a Rook in each of the outer two and the King in the middle one.
  const [, kIdx] = getEmptyIdxs();
  board[kIdx] = "K";

  return board.join("");
};

export function generateFen(board: string) {
  const normalizedBaseRank = board.toUpperCase();
  const blackBaseRank = normalizedBaseRank.toLowerCase();

  return (
    [
      blackBaseRank,
      "pppppppp",
      "8",
      "8",
      "8",
      "8",
      "PPPPPPPP",
      normalizedBaseRank,
    ].join("/") + " w KQkq - 0 1"
  );
}

//5111111116
//3RMBWKVNT2
//3OPOPOPOP2
//3 / / / /2
//3/ / / / 2
//3 / / / /2
//3/ / / / 2
//3popopopo2
//3tnvqlbmr2
//7444444448

export const renderFen = (fen: string): string => {
  const piecePlacement = fen.split(" ")[0];
  const ranks = piecePlacement.split("/");

  const fenToMerida: Record<string, string> = {
    K: "k",
    Q: "q",
    R: "r",
    B: "b",
    N: "n",
    P: "p",
    k: "l",
    q: "w",
    r: "t",
    b: "v",
    n: "m",
    p: "o",
  };

  const result: string[][] = [];

  // Process each rank
  for (let rankIndex = 0; rankIndex < ranks.length; rankIndex++) {
    const rank = ranks[rankIndex];
    const meridaRank: string[] = [];
    let squareIndex = 0;

    for (let i = 0; i < rank.length; i++) {
      const char = rank[i];
      if (isNaN(parseInt(char))) {
        meridaRank.push(fenToMerida[char] || char);
        squareIndex++;
      } else {
        const emptyCount = parseInt(char);
        for (let j = 0; j < emptyCount; j++) {
          meridaRank.push(" ");
          squareIndex++;
        }
      }
    }
    result.push(meridaRank);
  }

  result.forEach((r, i) => {
    r.forEach((c, j) => {
      if ((i + j) % 2 === 1) {
        if (c === " ") {
          r[j] = "+";
        } else {
          r[j] = c.toUpperCase();
        }
      }
    });
  });

  return result.map((r) => r.join("")).join("\n");
};

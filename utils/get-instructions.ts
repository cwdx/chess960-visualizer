export function generateChessCoordinates(positionString: string): {
  white: string;
  black: string;
  notes: string;
} {
  positionString = positionString.trim().toUpperCase();

  if (!positionString || positionString.length !== 8) {
    throw new Error("Position string must be exactly 8 characters");
  }

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const whitePieces: Array<{ piece: string; file: string; coord: string }> = [];
  const blackPieces: Array<{ piece: string; file: string; coord: string }> = [];

  for (let i = 0; i < positionString.length; i++) {
    const piece = positionString[i];

    if (!Object.keys(piecesMap).includes(piece)) {
      throw new Error(`Invalid piece character: ${piece}`);
    }

    const whiteCoord = `${files[i]}1`;
    whitePieces.push({
      piece,
      file: files[i],
      coord: whiteCoord,
    });

    const blackCoord = `${files[i]}8`;
    blackPieces.push({
      piece,
      file: files[i],
      coord: blackCoord,
    });
  }

  whitePieces.sort((a, b) => files.indexOf(a.file) - files.indexOf(b.file));
  blackPieces.sort((a, b) => files.indexOf(a.file) - files.indexOf(b.file));

  const whiteCoordinates: Record<string, string[]> = {
    R: [],
    N: [],
    B: [],
    Q: [],
    K: [],
  };

  whitePieces.forEach((p) => {
    whiteCoordinates[p.piece].push(p.coord);
  });

  const blackCoordinates: Record<string, string[]> = {
    R: [],
    N: [],
    B: [],
    Q: [],
    K: [],
  };

  blackPieces.forEach((p) => {
    blackCoordinates![p.piece].push(p.coord);
  });

  let whiteInstructions = "";

  whitePieces.forEach((p) => {
    const pieceName = piecesMap[p.piece as keyof typeof piecesMap];
    whiteInstructions += `Place ${pieceName} on ${p.coord}\n`;
  });

  let blackInstructions = "";

  blackPieces.forEach((p) => {
    const pieceName = piecesMap[p.piece as keyof typeof piecesMap];
    blackInstructions += `Place ${pieceName} on ${p.coord}\n`;
  });

  const isStandard = positionString === "RNBQKBNR";

  const positionNote = isStandard
    ? "This is the standard chess starting position."
    : "This is a Chess960 position variant.";

  return {
    white: whiteInstructions,
    black: blackInstructions || "",
    notes: positionNote,
  };
}

const piecesMap = {
  R: "Rook",
  N: "Knight",
  B: "Bishop",
  Q: "Queen",
  K: "King",
};

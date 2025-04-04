import { PropsWithChildren } from "hono/jsx";
import { ThemeName, themes } from "./render-board";
import { Piece, renderPiece } from "./render-board";

const cn = (...classes: (string | undefined | null)[]): string =>
  classes
    .map((c) => c?.trim())
    .filter(Boolean)
    .join(" ") || "";

export function Piece({
  piece,
  themeName,
  darkSquare = false,
  className,
}: PropsWithChildren<{
  piece: Piece;
  themeName: ThemeName;
  darkSquare?: boolean;
  className?: string;
}>) {
  const theme = themes[themeName];
  const char = renderPiece(piece, theme, darkSquare ? "dark" : "light");

  return (
    <div
      className={cn("fcm mx-auto", `font-chess-${themeName}`, className)}
      dangerouslySetInnerHTML={{
        __html: char,
      }}
    />
  );
}

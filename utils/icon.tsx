import { CSSProperties } from "hono/jsx";
import { MiscelKey, miscelMap } from "./miscel";

export function Icon({
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
      class={`font-loader font-chess-miscel inline ${className}`}
      style={{ verticalAlign: "bottom", ...style }}
    >
      {v}
    </span>
  );
}

import { ColorSwatch } from "./ColorSwatch";
import type { ColorSwatchProps } from "./ColorSwatch";

export type { ColorSwatchProps };

type ColorPaletteProps = {
  colors: ColorSwatchProps[];
  /** Máximo de colunas em telas `lg` */
  columns?: 2 | 3 | 4;
};

const gridCols = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export function ColorPalette({ colors, columns = 3 }: ColorPaletteProps) {
  return (
    <div className={`not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 ${gridCols[columns]}`}>
      {colors.map((color) => (
        <ColorSwatch key={`${color.hex}-${color.name}`} {...color} />
      ))}
    </div>
  );
}

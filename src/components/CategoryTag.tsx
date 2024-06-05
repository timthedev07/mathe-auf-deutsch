import { DetailedHTMLProps, FC, LiHTMLAttributes } from "react";

const SELECTED_COLORS = [
  "bg-amber-600",
  "bg-emerald-600",
  "bg-cyan-600",
  "bg-purple-600",
];

const COLORS = [
  "bg-amber-700",
  "bg-emerald-700",
  "bg-cyan-700",
  "bg-purple-700",
];

interface CategoryTagProps
  extends DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  index: number;
  selected: boolean;
}

export const CategoryTag: FC<CategoryTagProps> = ({
  index,
  children,
  selected,
  ...props
}) => {
  return (
    <li
      {...props}
      className={
        "select-none transition duration-300 cursor-pointer rounded-full px-2.5 w-min font-medium py-1 text-sm " +
        (selected
          ? SELECTED_COLORS[index % COLORS.length] +
            " text-slate-100 shadow-2xl ring-2"
          : COLORS[index % COLORS.length] + " text-slate-300/80")
      }
    >
      {children}
    </li>
  );
};

import { DetailedHTMLProps, FC, LiHTMLAttributes } from "react";

const SELECTED_COLORS = [
  "bg-amber-600",
  "bg-green-600",
  "bg-cyan-600",
  "bg-purple-600",
  "bg-lime-600",
  "bg-pink-600",
  "bg-orange-600",
  "bg-teal-600",
  "bg-rose-600",
];

const COLORS = [
  "bg-amber-700",
  "bg-green-700",
  "bg-cyan-700",
  "bg-purple-700",
  "bg-lime-700",
  "bg-pink-700",
  "bg-orange-700",
  "bg-teal-700",
  "bg-rose-700",
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
        "select-none transition duration-300 cursor-pointer rounded-full px-2.5 w-max font-medium py-1 text-sm " +
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

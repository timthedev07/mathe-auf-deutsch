import { FC } from "react";

type LanguageBadgeProps = {
  language: string;
  compact?: boolean;
  className?: string;
};

const getLanguageName = (language: string) => {
  try {
    return (
      new Intl.DisplayNames([language], { type: "language" }).of(language) ||
      language
    );
  } catch {
    return language;
  }
};

export const LanguageBadge: FC<LanguageBadgeProps> = ({
  language,
  compact = false,
  className = "",
}) => {
  const label = getLanguageName(language);
  const code = language.split("-")[0].toUpperCase();

  return (
    <span
      aria-label={`Language: ${label}`}
      title={label}
      className={
        "inline-flex w-max items-center rounded-full border border-white/15 bg-slate-950/70 text-white/85 shadow-lg backdrop-blur " +
        (compact
          ? "px-2 py-0.5 text-[11px] font-semibold "
          : "px-3 py-1 text-sm font-medium ") +
        className
      }
    >
      <span className="tracking-normal">{code}</span>
      {!compact && <span className="ml-2 text-white/60">{label}</span>}
    </span>
  );
};

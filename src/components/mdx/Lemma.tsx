"use client";
import { FC } from "react";
import { LinkOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import Link from "next/link";
import { lemmaLinkId } from "../../lib/lemmaLinkId";

type LemmaColorScheme = {
  bg: string;
  border: string;
  hoverBg: string;
  refBg: string;
};

const Colors: LemmaColorScheme[] = [
  {
    bg: "bg-cyan-600",
    border: "border-cyan-600",
    hoverBg: "hover:bg-cyan-600/80",
    refBg: "bg-cyan-600/70",
  },
  {
    bg: "bg-emerald-600",
    border: "border-emerald-600",
    hoverBg: "hover:bg-emerald-600/80",
    refBg: "bg-emerald-600/70",
  },
  {
    bg: "bg-amber-600",
    border: "border-amber-600",
    hoverBg: "hover:bg-amber-600/80",
    refBg: "bg-amber-600/70",
  },
  {
    bg: "bg-purple-600",
    border: "border-purple-600",
    hoverBg: "hover:bg-purple-600/80",
    refBg: "bg-purple-600/70",
  },
  {
    bg: "bg-pink-600",
    border: "border-pink-600",
    hoverBg: "hover:bg-pink-600/80",
    refBg: "bg-pink-600/70",
  },
];

interface LemmaProps {
  children: React.ReactNode;
  num: number;
}

export const Lemma: FC<LemmaProps> = ({ children, num }) => {
  const copyLink = () => {
    if (!num) return;
    const href = window.location.href.split("#")[0];
    window.navigator.clipboard.writeText(`${href}${lemmaLinkId(num)}`);
    toast.success("Link copied to clipboard");
  };

  const idLink = `${lemmaLinkId(num)}`;
  const color = Colors[(num - 1) % Colors.length];

  return (
    <div
      className={`relative w-full px-4 py-6 rounded-lg ${color.border} border-2 mt-8 shadow-2xl`}
    >
      <Link
        className="scroll-my-32"
        id={lemmaLinkId(num).substring(1)}
        href={idLink}
      />
      {num && (
        <div
          onClick={copyLink}
          className={`cursor-pointer hover:text-neutral-300 group transition duration-300 ${color.hoverBg} ${color.bg} absolute h-10 -top-10 left-3 w-64 rounded-t-lg text-white px-4 flex justify-between items-center`}
        >
          Lemma {num}.
          <LinkOutlined className="transform group-hover:scale-[1.15] transition duration-300 group-hover:animate-wiggle" />
        </div>
      )}
      {children}
    </div>
  );
};

export const LemmaRef: FC<{ num: number }> = ({ num }) => {
  return (
    <Link
      className={`katex ${
        Colors[(num - 1) % Colors.length].refBg
      } rounded-md px-2 py-0.5`}
      href={lemmaLinkId(num)}
    >
      Lemma {num}.
    </Link>
  );
};

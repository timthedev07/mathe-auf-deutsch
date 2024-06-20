"use client";
import { FC, PropsWithChildren } from "react";
import { InlineMath } from "react-katex";
import { LinkOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import Link from "next/link";
import { lemmaLinkId } from "../../lib/mathLinkId";
import { Colors } from "./colors";

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

export const LemmaProof: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <hr className="h-0 mt-8 w-full border-1 border-slate-300/40" />
      <div className="w-full mt-6">
        <div className="katex">Proof</div>
        {children}
        <div className="ml-auto w-max">
          <InlineMath>\square</InlineMath>
        </div>
      </div>
    </>
  );
};

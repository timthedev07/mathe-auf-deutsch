"use client";
import { FC } from "react";
import { LinkOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import Link from "next/link";
import { lemmaLinkId } from "../../lib/lemmaLinkId";

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

  return (
    <div className="relative w-full px-4 py-6 rounded-lg border-cyan-600 border-2 mt-8 shadow-2xl">
      <Link id={lemmaLinkId(num).substring(1)} href={idLink} />
      {num && (
        <div
          onClick={copyLink}
          className="cursor-pointer hover:text-neutral-300 group transition duration-300 hover:bg-cyan-600/80 absolute h-10 -top-10 left-3 w-64 rounded-t-lg bg-cyan-600 text-white px-4 flex justify-between items-center"
        >
          Lemma {num}
          <LinkOutlined className="transform group-hover:scale-[1.15] transition duration-300 group-hover:animate-wiggle" />
        </div>
      )}
      {children}
    </div>
  );
};

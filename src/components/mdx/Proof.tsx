"use client";
import { FC, PropsWithChildren } from "react";
import { proofLinkId } from "../../lib/mathLinkId";
import { toast } from "sonner";
import Link from "next/link";
import { LinkOutlined } from "@ant-design/icons";
import { Colors } from "./colors";

interface ProofProps {
  id: number;
}

export const Proof: FC<PropsWithChildren<ProofProps>> = ({ id, children }) => {
  const idLink = `${proofLinkId(id)}`;

  const copyLink = () => {
    if (!id) return;
    const href = window.location.href.split("#")[0];
    window.navigator.clipboard.writeText(`${href}${idLink}`);
    toast.success("Link copied to clipboard");
  };

  const color = Colors[(id - 1) % Colors.length];
  return (
    <div
      className={`relative w-full px-4 py-6 rounded-lg ${color.border} border-2 mt-8 shadow-2xl`}
    >
      <Link className="scroll-my-32" id={idLink.substring(1)} href={idLink} />
      {id && (
        <div
          onClick={copyLink}
          className={`cursor-pointer hover:text-neutral-300 group transition duration-300 ${color.hoverBg} ${color.bg} absolute h-10 -top-10 left-3 w-64 rounded-t-lg text-white px-4 flex justify-between items-center`}
        >
          Proof {id}.
          <LinkOutlined className="transform group-hover:scale-[1.15] transition duration-300 group-hover:animate-wiggle" />
        </div>
      )}
      {children}
    </div>
  );
};

export const ProofRef: FC<{ id: number }> = ({ id }) => {
  return (
    <Link
      className={`katex ${
        Colors[(id - 1) % Colors.length].refBg
      } rounded-md px-2 py-0.5`}
      href={proofLinkId(id)}
    >
      Proof {id}.
    </Link>
  );
};

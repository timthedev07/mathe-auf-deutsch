import Link from "next/link";
import { FC } from "react";

interface NavProps {}

const Item: FC<{ children: React.ReactNode; href: string }> = ({
  children,
  href,
}) => {
  return (
    <span className="font-medium text-white opacity-70 hover:opacity-100 transition duration-200 cursor-pointer">
      <Link href={href}>{children}</Link>
    </span>
  );
};

export const Nav: FC<NavProps> = ({}) => {
  return (
    <nav
      className={`flex justify-start gap-12 items-center h-16 px-12 sticky glass bg-slate-700/20 z-30 top-0`}
    >
      <Item href="/">Startseite</Item>
      <Item href="/blog">Blog</Item>
      <Item href="https://timthedev07.vercel.app">Der Autor</Item>
    </nav>
  );
};

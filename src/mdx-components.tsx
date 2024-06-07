import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { LinkCopier } from "./components/mdx/LinkCopier";
import Image from "next/image";

const Hr = () => <hr className="h-0 border-1 border-slate-200/30" />;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ id, ...props }) => {
      const Inhalt = (
        <>
          <h1
            id={id}
            className="text-3xl font-semibold text-white hover:after:content-['#'] after:ml-2 after:text-slate-200"
            {...props}
          />
          <Hr />
        </>
      );
      const c = "flex flex-col gap-3 mb-2 mt-8";

      return id ? (
        <Link href={`#${id}`}>
          <LinkCopier id={id} className={c}>
            {Inhalt}
          </LinkCopier>
        </Link>
      ) : (
        <div className={c}>{Inhalt}</div>
      );
    },
    h2: ({ id, ...props }) => {
      const Inhalt = (
        <h2
          id={"_" + id}
          className="text-2xl font-medium text-white hover:after:content-['#'] after:ml-2 after:text-slate-200"
          {...props}
        />
      );
      const c = "flex flex-col gap-3 mb-2 mt-8";

      return id ? (
        <Link href={`#_${id}`}>
          <LinkCopier id={"_" + id} className={c}>
            {Inhalt}
          </LinkCopier>
        </Link>
      ) : (
        <div className={c}>{Inhalt}</div>
      );
    },
    p: (props) => (
      <p
        className="text-sm md:text-base text-white/90 leading-loose md:leading-loose"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="list-[lower-greek] list-inside leading-loose pl-4 text-white"
        {...props}
      ></ol>
    ),
    blockquote: (props) => (
      <blockquote
        className="text-white/90 border-l-4 border-cyan-400/60 italic pl-4"
        {...props}
      />
    ),
    ...components,
  };
}

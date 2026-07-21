import { FC } from "react";
import { readFile, readdir } from "fs/promises";
import { join } from "path";
import { BlogAside } from "../../../../components/BlogAside";
import headings from "@/headings.json";
import { getBlogMetadata } from "../../../../lib/seo";
import { compileMDX } from "../../../../lib/compileMDX";
import Image from "next/image";
import { CalendarOutlined } from "@ant-design/icons";
import { CategoryTag } from "../../../../components/CategoryTag";
import Link from "next/link";
import { normaliseBlogMeta } from "../../../../types/meta";
import { LanguageBadge } from "../../../../components/LanguageBadge";

type Props = {
  params: {
    slug: string;
    category: string;
  };
};

export async function generateStaticParams(): Promise<Props["params"][]> {
  const fpath = join(process.cwd(), "blogs");
  const categories = (await readdir(fpath)).filter(
    (a) => a.search(/\./) === -1,
  );
  const identifiers: Props["params"][] = [];

  for (const category of categories) {
    const slugs = await readdir(join(fpath, category));
    for (const slug of slugs.filter((a) => a.search(/\./) === -1)) {
      identifiers.push({ category, slug });
    }
  }
  return identifiers;
}

// or Dynamic metadata
export async function generateMetadata({
  params: { category, slug },
}: {
  params: Props["params"];
}) {
  const fpath = join(process.cwd(), "blogs", category, slug, "page.mdx");
  const { frontmatter } = await compileMDX(await readFile(fpath, "utf-8"));
  return getBlogMetadata(normaliseBlogMeta(frontmatter, slug));
}

const Page: FC<Props> = async ({ params: { category, slug } }) => {
  const fpath = join(process.cwd(), "blogs");
  let raw = await readFile(join(fpath, category, slug, "page.mdx"), "utf-8");
  raw = raw.replace(/^import\b.*/g, "");

  const { content, frontmatter } = await compileMDX(raw);
  const meta = normaliseBlogMeta(frontmatter, slug);

  return (
    <>
      <BlogAside headings={(headings as any)[`${category}/${slug}`]} />
      <main
        lang={meta.language}
        className="fixed flex w-full top-0 lg:w-[calc(100%-20rem)] flex-col gap-4 h-full overflow-y-auto lg:left-80 p-16 md:p-24 pb-64"
      >
        <header className="relative md:w-7/10 w-8/10 mt-12">
          <h1 className="relative font-bold break-words max-w-[80%] text-white text-4xl underline decoration-cyan-400/60 pb-1 transition duration-200 hover:border-b-cyan-400/80 text-center w-max mx-auto">
            {meta.title}
          </h1>
          <h2 className="text-white/80 text-lg text-center mt-6 flex flex-wrap items-center justify-center gap-3">
            <span>
              <CalendarOutlined />{" "}
              {Intl.DateTimeFormat(meta.language, { dateStyle: "full" }).format(
                new Date(meta.date),
              )}
            </span>
            <LanguageBadge language={meta.language} />
          </h2>
          <ul className="w-full flex justify-center gap-4 my-6">
            {meta.keywords.map((each, index) => (
              <CategoryTag hasRing={false} key={each} index={index} selected>
                {each}
              </CategoryTag>
            ))}
          </ul>
          <div className="max-w-[800px] mx-auto mt-8">
            <Image
              src={meta.coverURL}
              alt={meta.title}
              width={1200}
              height={800}
              className="rounded-lg"
            ></Image>
            {!!meta.coverCredit ? (
              <div className="text-center w-max mx-auto mt-6 border-b-4 transition duration-200 pb-1 border-transparent hover:border-b-cyan-500">
                <Link
                  href={meta.coverCredit.originalURL}
                  className="text-white/70"
                >
                  Vo{`${!!meta.coverCredit.author ? "n" : "m"} `}
                  <i className="text-white/90">
                    {meta.coverCredit.author && "Anonymus"}
                  </i>{" "}
                  auf{" "}
                  <b className="text-white/90">{meta.coverCredit.platform}</b>
                </Link>
              </div>
            ) : null}
          </div>
          {meta.description && (
            <div className="max-w-[800px] mx-auto mt-8 initial-letter">
              {meta.description}
            </div>
          )}
        </header>
        {content}
      </main>
    </>
  );
};

export default Page;

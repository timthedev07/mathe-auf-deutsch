import { FC } from "react";
import { readFile, readdir } from "fs/promises";
import { join } from "path";
import { BlogAside } from "../../../../components/BlogAside";
import headings from "@/headings.json";
import { getBlogMetadata } from "../../../../lib/seo";
import { compileMDX } from "../../../../lib/compileMDX";
import Image from "next/image";
import { IoIosArrowRoundDown } from "react-icons/io";
import { CalendarOutlined } from "@ant-design/icons";
import { CategoryTag } from "../../../../components/CategoryTag";

type Props = {
  params: {
    slug: string;
    category: string;
  };
};

export async function generateStaticParams(): Promise<Props["params"][]> {
  const fpath = join(process.cwd(), "blogs");
  const categories = await readdir(fpath);
  const identifiers: Props["params"][] = [];

  for (const category of categories) {
    const slugs = await readdir(join(fpath, category));
    for (const slug of slugs) {
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
  return getBlogMetadata({ ...frontmatter });
}

const Page: FC<Props> = async ({ params: { category, slug } }) => {
  const fpath = join(process.cwd(), "blogs");
  let raw = await readFile(join(fpath, category, slug, "page.mdx"), "utf-8");
  raw = raw.replace(/^import\b.*/g, "");

  const { content, frontmatter } = await compileMDX(raw);

  return (
    <>
      <BlogAside headings={(headings as any)[`${category}/${slug}`]} />
      <main className="fixed flex w-full top-0 lg:w-[calc(100%-20rem)] flex-col gap-4 h-full overflow-y-auto lg:left-80 p-24 pb-64">
        <header className="relative md:w-7/10 w-8/10 mt-12">
          <h1 className="relative font-bold break-all max-w-[80%] text-white text-4xl border-b-4 pb-1 border-b-cyan-400/60 transition duration-200 hover:border-b-cyan-400/80 text-center w-max mx-auto">
            {frontmatter.title}
          </h1>
          <h2 className="text-white/80 text-lg text-center mt-6">
            <CalendarOutlined />{" "}
            {Intl.DateTimeFormat("de-DE", { dateStyle: "full" }).format(
              new Date(frontmatter.date)
            )}
          </h2>
          <ul className="w-full flex justify-center gap-4 my-6">
            {frontmatter.keywords.map((each, index) => (
              <CategoryTag hasRing={false} key={each} index={index} selected>
                {each}
              </CategoryTag>
            ))}
          </ul>
          <div className="max-w-[800px] mx-auto mt-8">
            <Image
              src={frontmatter.coverURL}
              alt={frontmatter.title}
              width={1200}
              height={800}
              className="rounded-lg"
            ></Image>
            <div>{JSON.stringify(frontmatter.coverCredit)}</div>
          </div>
          {frontmatter.description && (
            <div className="max-w-[800px] mx-auto mt-8 initial-letter">
              {frontmatter.description}
            </div>
          )}
        </header>
        <div className="mx-auto my-24 w-full">
          <IoIosArrowRoundDown className="mx-auto mt-8 mx-auto w-full h-24 animate-pulse text-sky-200" />
        </div>
        {content}
      </main>
    </>
  );
};

export default Page;

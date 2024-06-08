import { FC } from "react";
import { readFile, readdir } from "fs/promises";
import { join } from "path";
import { BlogAside } from "../../../../components/BlogAside";
import headings from "@/headings.json";
import { mdxComponents } from "../../../../mdx-components";
import { getBlogMetadata } from "../../../../lib/seo";
import { compileMDX } from "../../../../lib/compileMDX";

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

  const { content } = await compileMDX(raw);

  return (
    <>
      <BlogAside headings={(headings as any)[`${category}/${slug}`]} />
      <div className="fixed flex w-full top-0 lg:w-[calc(100%-20rem)] flex-col gap-4 h-full overflow-y-auto lg:left-80 p-24 pb-64">
        {content}
      </div>
    </>
  );
};

export default Page;

import { FC } from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import { compileMDX } from "next-mdx-remote/rsc";
import { readFile, readdir } from "fs/promises";
import { join } from "path";
import { BlogAside } from "../../../../components/BlogAside";
import headings from "@/headings.json";
import { mdxComponents } from "../../../../mdx-components";

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

const Page: FC<Props> = async ({ params: { category, slug } }) => {
  const fpath = join(process.cwd(), "blogs");
  let raw = await readFile(join(fpath, category, slug, "page.mdx"), "utf-8");
  raw = raw.replace(/^import\b.*/g, "");

  const { content } = await compileMDX({
    source: raw,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeKatex, rehypeSlug],
      },
      parseFrontmatter: true,
    },
    components: mdxComponents,
  });

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

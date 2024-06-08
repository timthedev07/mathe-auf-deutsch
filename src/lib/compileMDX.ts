import { compileMDX as _ } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import { mdxComponents } from "../mdx-components";
import { Meta } from "../types/meta";

export const compileMDX = async (raw: string) => {
  return _<Meta>({
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
};

import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});

export default withMDX(nextConfig);

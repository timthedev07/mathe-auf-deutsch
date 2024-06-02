import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";
import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["mdx", "ts", "tsx"],
  images: {
    domains: ["i.imgur.com"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(process.cwd(), "src/app/blog/(blogs)"),
              to: path.join(process.cwd(), "public/mdx-content"),
              globOptions: {
                ignore: ["**/*.tsx"],
              },
            },
          ],
        })
      );
    }
    return config;
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      [remarkMdxFrontmatter, { name: "metadata" }],
      remarkGfm,
      remarkMath,
    ],
    rehypePlugins: [rehypeKatex, rehypeSlug],
  },
});

export default withMDX(nextConfig);

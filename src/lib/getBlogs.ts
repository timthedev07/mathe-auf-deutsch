import { readFile, readdir } from "fs/promises";
import matter from "gray-matter";
import { join } from "path";
import { Meta } from "../types/meta";

export const getBlogs = async () => {
  const base = join(process.cwd(), "blogs");
  const categories = (await readdir(base)).filter(
    (each) => each.search(/\./) === -1
  );
  const blogs: Record<string, Meta[]> = {};
  for (const category of categories) {
    if (category.search(/\./) !== -1) continue;
    const entries = (await readdir(join(base, category))).filter(
      (each) => each.search(/\./) === -1
    );
    const meta = await Promise.all(
      entries.map(async (entry) => {
        const src = await readFile(
          join(base, category, entry, "page.mdx"),
          "utf-8"
        );
        return { ...matter(src).data, slug: entry };
      })
    );
    blogs[category] = meta as any as Meta[];
  }
  return [blogs, categories] as [typeof blogs, typeof categories];
};

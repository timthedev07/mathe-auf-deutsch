import { readFile, readdir } from "fs/promises";
import matter from "gray-matter";
import { join } from "path";

export const getBlogs = async () => {
  const categories = (
    await readdir(join(process.cwd(), "src", "app", "blog", "(blogs)"))
  ).filter((each) => each !== "layout.tsx");
  const base = join(process.cwd(), "src", "app", "blog", "(blogs)");
  const blogs: Record<
    string,
    {
      [key: string]: any;
    }[]
  > = {};
  for (const category of categories) {
    if (category === "layout.tsx") continue;
    const entries = await readdir(
      join(process.cwd(), "src", "app", "blog", "(blogs)", category)
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
    blogs[category] = meta;
  }
  return [blogs, categories] as [typeof blogs, typeof categories];
};

import { FC } from "react";
import { readdir } from "fs/promises";
import { join } from "path";

const getBlogs = async () => {
  const categories = await readdir(
    join(process.cwd(), "src", "app", "blog", "(blogs)")
  );
  const blogs: Record<string, string[]> = {};
  for (const category of categories) {
    if (category === "layout.tsx") continue;
    const entries = await readdir(
      join(process.cwd(), "src", "app", "blog", "(blogs)", category)
    );
    blogs[category] = entries;
  }
  return blogs;
};

const BlogHome: FC = async () => {
  const blogs = await getBlogs();
  return <>{Object.keys(blogs)}</>;
};

export default BlogHome;

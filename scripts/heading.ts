import path from "path";
import { extractHeadings, Headings } from "../src/lib/extractHeadings";
import { readdir, readFile, writeFile } from "fs/promises";

(async () => {
  const base = process.cwd();
  const blogsDir = path.join(base, "src", "app", "blog", "(blogs)");
  const categories = (await readdir(blogsDir)).filter(
    (each) => each !== "layout.tsx"
  );
  const files = await Promise.all(
    categories.map((each) => readdir(path.join(blogsDir, each)))
  );
  // [slug, [heading, hType]]
  const res: Record<string, [string, Headings][]> = {};

  for (const category of categories) {
    for (const file of files[categories.indexOf(category)]) {
      const raw = await readFile(
        path.join(blogsDir, category, file, "page.mdx"),
        "utf-8"
      );
      const headings = extractHeadings(raw);
      res[`${category}/${file}`] = headings;
    }
  }

  await writeFile(path.join(base, "src", "headings.json"), JSON.stringify(res));
})();

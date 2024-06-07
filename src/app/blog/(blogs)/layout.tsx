import { FC } from "react";
import { BlogAside } from "../../../components/BlogAside";
import { headers } from "next/headers";
import { join } from "path";
import { readFile } from "fs/promises";
import { extractHeadings } from "../../../lib/extractHeadings";
import data from "../../../headings.json";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = async ({ children }) => {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const slug = pathname.split("/").slice(2);

  let headings: ReturnType<typeof extractHeadings> = [];

  if (process.env.NODE_ENV === "development") {
    const fpath = join(
      process.cwd(),
      "src",
      "app",
      "blog",
      "(blogs)",
      ...slug,
      "page.mdx"
    );
    const raw = await readFile(fpath, "utf-8");
    headings = extractHeadings(raw);
  } else {
    headings = (data as any)[slug.join("/")];
  }

  return (
    <>
      <BlogAside headings={headings} />
      <div className="fixed flex w-full top-0 lg:w-[calc(100%-20rem)] flex-col gap-4 h-full overflow-y-auto lg:left-80 p-24 pb-64">
        {children}
      </div>
    </>
  );
};
export default Layout;

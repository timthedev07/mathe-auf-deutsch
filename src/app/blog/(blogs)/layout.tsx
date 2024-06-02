import { FC } from "react";
import { BlogAside } from "../../../components/BlogAside";
import { headers } from "next/headers";
import { join } from "path";
import { readFile, readdir } from "fs/promises";
import { extractHeadings } from "../../../lib/extractHeadings";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = async ({ children }) => {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const slug = pathname.split("/").slice(2);
  const fpath = join(
    process.cwd(),
    ...(process.env.NODE_ENV === "development"
      ? ["src", "app", "blog", "(blogs)"]
      : ["aux"]),
    ...slug,
    "page.mdx"
  );
  const raw = await readFile(fpath, "utf-8");
  const headings = extractHeadings(raw);

  return (
    <>
      <div className="flex">
        <BlogAside headings={headings} />
        <div className="fixed flex flex-col gap-4 h-full overflow-y-auto lg:left-80 p-24 pb-64">
          {children}
        </div>
      </div>
    </>
  );
};
export default Layout;

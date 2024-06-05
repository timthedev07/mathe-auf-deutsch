import { FC } from "react";
import { BlogMainPage } from "../../components/BlogMain";
import { getBlogs } from "../../lib/getBlogs";

const BlogHome: FC = async () => {
  const [blogs, categories] = await getBlogs();
  const allKeywords = new Set(
    Object.values(blogs)
      .flatMap((each) => each.map((each) => each.keywords))
      .flat()
  );

  return (
    <BlogMainPage
      allKeywords={allKeywords}
      meta={blogs}
      categories={categories}
    />
  );
};

export default BlogHome;

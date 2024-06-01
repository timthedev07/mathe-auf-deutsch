import { FC } from "react";
import { BlogMainPage } from "../../components/BlogMain";
import { getBlogs } from "../../lib/getBlogs";

const BlogHome: FC = async () => {
  const [blogs, categories] = await getBlogs();

  return (
    <div className="flex">
      <BlogMainPage meta={blogs} categories={categories} />
    </div>
  );
};

export default BlogHome;

import { FC } from "react";
import { BlogMainPage } from "../../components/BlogMain";
import { getBlogs } from "../../lib/getBlogs";

const BlogHome: FC = async () => {
  const [blogs, categories] = await getBlogs();

  return <BlogMainPage meta={blogs} categories={categories} />;
};

export default BlogHome;

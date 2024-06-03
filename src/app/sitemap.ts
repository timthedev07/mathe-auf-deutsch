import { MetadataRoute } from "next";
import data from "../headings.json";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...Object.keys(data).map((each) => ({
      url: `/blog/${each}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as "weekly",
      priority: 0.9,
    })),
  ].map((each) => ({
    ...(each as any),
    url: `https://timthedev07.vercel.app${each.url}`,
  }));
}

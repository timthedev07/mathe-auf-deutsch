import { resolveImageUrl } from "../lib/imageUrl";

export const DEFAULT_BLOG_LANGUAGE = "de";

export type Meta = {
  title: string;
  description: string;
  coverURL: string;
  date: string;
  language: string;
  keywords: string[];
  slug: string;
  coverCredit?: {
    author?: string;
    originalURL: string;
    platform: string;
  };
};

export type BlogFrontmatter = Omit<Meta, "slug" | "language"> & {
  language?: string;
};

export const normaliseBlogMeta = (
  meta: BlogFrontmatter,
  slug: string,
): Meta => ({
  ...meta,
  coverURL: resolveImageUrl(meta.coverURL),
  language: meta.language || DEFAULT_BLOG_LANGUAGE,
  slug,
});

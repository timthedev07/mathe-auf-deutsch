import type { Metadata as Metadata_ } from "next";

export type CustomMetadata = {
  coverURL: string;
  date: string;
};

type Metadata = Metadata_ & { other?: CustomMetadata };

const d =
  "Die Seite, in der ich meine Gedanken und Ideen zu Mathematik und vielleicht Informatik festhalte and teile.";

export const getMetadata = ({
  title,
  description,
  ogImages = [],
  keywords = [],
}: {
  title?: string;
  description?: string;
  ogImages?: string[];
  keywords?: string[];
}): Metadata => {
  return {
    title: title
      ? title
      : {
          template: "%s | MatheAufDeutsch",
          default: "MatheAufDeutsch - timthedev07",
        },
    description: description || d,
    openGraph: {
      title: (title || "") + `${!!title ? " " : ""}MatheAufDeutsch`,
      description: description || d,
      images: ogImages,
    },
    verification: { google: "ou31BwzL6hYs78yHQZrfEFRvZIBWxVoPkErFfm0f2z4" },
    creator: "Tim <timpersonal07@gmail.com>",
    keywords,
  };
};

export const getBlogMetadata = ({
  title,
  description,
  keywords,
  coverURL,
  date,
}: {
  title: string;
  description: string;
  keywords: string[];
  coverURL: string;
  date: string;
}): Metadata => {
  const t = getMetadata({ title, description, keywords });
  return {
    ...t,
    other: {
      coverURL,
      date,
    },
  };
};

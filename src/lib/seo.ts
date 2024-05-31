import type { Metadata } from "next";

const d =
  "Die Seite, in der ich meine Gedanken und Ideen zu Mathematik und vielleicht Informatik festhalte and teile.";

export const getMetadata = ({
  title,
  description,
  ogImages = [],
}: {
  title?: string;
  description?: string;
  ogImages?: string[];
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
  };
};

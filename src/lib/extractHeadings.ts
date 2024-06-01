export type Headings = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export const extractHeadings = (src: string) => {
  const headings: [string, Headings][] = [];

  for (const line of src.split("\n")) {
    for (let i = 6; i > 0; i--) {
      const match = new RegExp(`^#{${i}} (.*)$`).exec(line);
      if (match) {
        headings.push([match[1], `h${i as 1 | 2 | 3 | 4 | 5 | 6}`]);
        break;
      }
    }
  }

  return headings;
};

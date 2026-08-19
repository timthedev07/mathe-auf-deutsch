import Link from "next/link";
import { unstable_cache } from "next/cache";
import { FC } from "react";

const getCachedTitle = unstable_cache(async (url: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const html = await response.text();
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    return titleMatch?.[1] ?? url;
  } finally {
    clearTimeout(timeout);
  }
}, ["works-cited-title"], { revalidate: 86400 });

const getTitle = async (url: string) => {
  try {
    return await getCachedTitle(url);
  } catch {
    return url;
  }
};

interface WorksCitedProps {
  worksCited?: string[];
}

export const WorksCited: FC<WorksCitedProps> = async ({ worksCited }) => {
  const citations = worksCited ?? [];
  const titles = await Promise.all(
    citations.map(
      async (each) => [await getTitle(each), each] as [string, string]
    )
  );

  return (
    <ol className="pl-4">
      {titles.map(([title, url], ind) => (
        <li className="flex" key={url}>
          <div className="w-8 font-sans">[{ind + 1}]</div>
          <Link
            className="text-blue-400 hover:text-blue-300 transition duration-200"
            href={url}
          >
            {title}
          </Link>
        </li>
      ))}
    </ol>
  );
};

export const InTextRef: FC<{ id: number }> = ({ id }) => {
  return <sup className="text-blue-400">[{id}]</sup>;
};

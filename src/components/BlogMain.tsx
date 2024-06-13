"use client";
import {
  CloseOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, FloatButton, Input, Menu, MenuProps } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useMemo, useState } from "react";
import { getBlogs } from "../lib/getBlogs";
import Image from "next/image";
import { truncateAtWord } from "../lib/truncateAtWord";
import Link from "next/link";
import { Suspense } from "react";
import { CategoryTag } from "./CategoryTag";
import { getBlurDataURL } from "../lib/blur";

interface BlogMainPageProps {
  categories: string[];
  meta: Awaited<ReturnType<typeof getBlogs>>[0];
  allKeywords: Set<string>;
}

type MenuItem = Required<MenuProps>["items"][number];

const Component: FC<BlogMainPageProps> = ({
  categories,
  meta,
  allKeywords,
}) => {
  const params = useSearchParams();
  const pathname = usePathname();
  const t = params.get("q") || "";
  const { push } = useRouter();
  const items: MenuItem[] = useMemo(
    () => [
      {
        label: "Alle",
        key: "",
        icon: <FolderOutlined />,
      },
      ...categories.map((category) => ({
        label: category
          .split("-")
          .map((each) => each.slice(0, 1).toUpperCase() + each.slice(1))
          .join(" "),
        key: category,
        icon: <FolderOpenOutlined />,
      })),
    ],
    [categories]
  );

  const updateParams = (keys: string[], values: string[]) => {
    const current = new URLSearchParams(Array.from(params.entries()));

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = values[i];
      const v = value.trim();

      if (!v) {
        current.delete(key);
      } else {
        current.set(key, v);
      }
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    push(`${pathname}${query}`);
  };

  const [showAside, setShowAside] = useState(false);
  const [q, setQ] = useState(t);
  const [selectedCategory, setCategory] = useState(
    () => params.get("kategorie") || ""
  );
  const [selectedLabel, setSelectedLabel] = useState<string>(
    params.get("keyword") || ""
  );
  return (
    <>
      <div
        className={`transition top-0 duration-300 w-96 pt-24 md:bg-slate-800/70 bg-slate-900/95 glass fixed left-0 h-full z-50 lg:z-10 p-8 ${
          showAside ? "" : "-translate-x-96 md:translate-x-0"
        } overflow-y-auto `}
      >
        <h1 className="text-center font-bold text-white text-2xl mb-8">
          Suchen
        </h1>
        <Input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParams(["q"], [q]);
          }}
          addonAfter={
            <DeleteOutlined
              className="hover:text-red-500 transition duration-200 cursor-pointer"
              onClick={() => {
                setQ("");
                updateParams(["q"], [""]);
              }}
            />
          }
          addonBefore={
            <SearchOutlined
              className="hover:text-emerald-500 transition duration-200 cursor-pointer"
              onClick={() => {
                updateParams(["q"], [q]);
              }}
            />
          }
        />
        <div className="h-8"></div>
        <Menu
          onClick={(e) => {
            setCategory(e.key);
            updateParams(["kategorie"], [e.key]);
          }}
          defaultSelectedKeys={[selectedCategory]}
          color="red"
          items={items}
        ></Menu>
        <ul className="w-full my-8 list-style-none flex flex-wrap gap-2 select-none">
          {Array.from(allKeywords).map((keyword, i) => (
            <CategoryTag
              onClick={() => {
                if (selectedLabel === keyword) {
                  setSelectedLabel("");
                  updateParams(["keyword"], [""]);
                } else {
                  setSelectedLabel(keyword);
                  updateParams(["keyword"], [keyword]);
                }
              }}
              index={i}
              key={keyword}
              selected={selectedLabel === keyword}
            >
              {keyword}
            </CategoryTag>
          ))}
        </ul>
      </div>
      <FloatButton
        className="md:invisible"
        icon={showAside ? <CloseOutlined /> : <SearchOutlined />}
        type="primary"
        onClick={() => setShowAside((v) => !v)}
      />
      <div className="fixed top-0 md:left-96 pt-24 pl-8 p-8 flex gap-8 md:justify-start md:w-[calc(100%-384px)] justify-center flex-wrap overflow-y-auto h-full pb-48">
        {categories
          .map((category) =>
            meta[category]
              .filter(
                (v) =>
                  (!t ||
                    (v.title as string)
                      .toLowerCase()
                      .includes(t.toLowerCase())) &&
                  (!selectedCategory || category === selectedCategory) &&
                  (!selectedLabel || v.keywords.includes(selectedLabel))
              )
              .map((each) => [each, category] as [typeof each, string])
          )
          .flat()
          .sort(
            (a, b) =>
              -new Date(a[0].date).valueOf() + new Date(b[0].date).valueOf()
          )
          .map(([each, category]) => (
            <li key={each.title} className="flex flex-col w-72">
              <div className="relative w-72 h-48 rounded-lg overflow-hidden">
                <Image
                  alt={each.title}
                  src={each.coverURL}
                  placeholder="blur"
                  blurDataURL={getBlurDataURL(288, 198)}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-white/90 font-semibold text-lg mt-3 h-12">
                {truncateAtWord(each.title || "", 38)}
              </h2>
              <hr className="h-0 border-1 border-slate-400/30 my-4" />
              <p className="h-20 text-sm">
                {truncateAtWord(each.description || "", 80)}
              </p>
              <Link className="w-full" href={`/blog/${category}/${each.slug}`}>
                <Button
                  type="primary"
                  className="w-full"
                  onClick={() => {
                    push(`/blog/${category}/${each.slug}`);
                  }}
                >
                  Anlesen
                </Button>
              </Link>
            </li>
          ))}
      </div>
    </>
  );
};

export const BlogMainPage = (props: BlogMainPageProps) => (
  <Suspense>
    <Component {...props} />
  </Suspense>
);

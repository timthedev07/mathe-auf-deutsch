"use client";
import {
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

interface BlogMainPageProps {
  categories: string[];
  meta: Awaited<ReturnType<typeof getBlogs>>[0];
}

type MenuItem = Required<MenuProps>["items"][number];

const Component: FC<BlogMainPageProps> = ({ categories, meta }) => {
  const params = useSearchParams();
  const pathname = usePathname();
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
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("kategorie") || "");
  return (
    <>
      <div
        className={`transition duration-300 w-96 bg-slate-800/70 glass fixed left-0 h-full z-50 p-8 ${
          showAside ? "" : "-translate-x-96 md:translate-x-0"
        } overflow-y-auto `}
      >
        <h1 className="text-center font-bold text-white text-2xl mb-8">
          Suchen
        </h1>
        <Input
          defaultValue={q}
          onChange={(e) => {
            setQ(e.target.value);
          }}
          addonAfter={
            <SearchOutlined
              className="hover:text-blue-500 transition duration-300 cursor-pointer"
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
          defaultSelectedKeys={[category]}
          color="red"
          items={items}
        ></Menu>
      </div>
      <FloatButton
        className="md:invisible"
        icon={<SearchOutlined />}
        type="primary"
      />
      <div className="fixed md:left-96 pl-8 p-8 flex gap-8 md:justify-start justify-center flex-wrap overflow-y-auto h-full pb-48">
        {categories.map((category) =>
          meta[category].map((each) => (
            <li key={each.title} className="flex flex-col w-72">
              <div className="relative w-72 h-48 rounded-lg overflow-hidden">
                <Image
                  alt={each.title}
                  src={each.coverURL}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-white/90 font-semibold text-lg mt-3 h-6">
                {truncateAtWord(each.title, 20)}
              </h2>
              <hr className="h-0 border-1 border-slate-400/30 my-4" />
              <p className="h-20 text-sm">
                {truncateAtWord(each.description, 80)}
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
          ))
        )}
      </div>
    </>
  );
};

export const BlogMainPage = (props: BlogMainPageProps) => (
  <Suspense>
    <Component {...props} />
  </Suspense>
);

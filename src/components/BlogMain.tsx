"use client";
import {
  FolderOpenOutlined,
  FolderOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FloatButton, Input, Menu, MenuProps } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useMemo, useState } from "react";
import { getBlogs } from "../lib/getBlogs";

interface BlogMainPageProps {
  categories: string[];
  meta: Awaited<ReturnType<typeof getBlogs>>[0];
}

type MenuItem = Required<MenuProps>["items"][number];

export const BlogMainPage: FC<BlogMainPageProps> = ({ categories, meta }) => {
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
      <ul className="fixed left-96 p-8">
        {JSON.stringify(meta)}
        {categories.map((category) => {
          return meta[category].map((each) => (
            <li key={each.title}>{each.title}</li>
          ));
        })}
      </ul>
    </>
  );
};

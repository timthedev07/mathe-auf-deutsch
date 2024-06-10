"use client";

import { CloseOutlined, ReadOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import GithubSlugger from "github-slugger";
import { FC, useState } from "react";
import { Headings, extractHeadings } from "../lib/extractHeadings";
import { useRouter } from "next/navigation";

interface BlogAsideProps {
  headings: ReturnType<typeof extractHeadings>;
}

const st: Record<Headings, string> = {
  h1: "",
  h2: "ml-3",
  h3: "ml-6",
  h4: "ml-9",
  h5: "ml-12",
  h6: "ml-16",
};

export const BlogAside: FC<BlogAsideProps> = ({ headings }) => {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const slugs = new GithubSlugger();

  return (
    <>
      <div className="lg:hidden block">
        <FloatButton
          className={`transition duration-200 fixed top-24 ${
            show ? "translate-y-[80vh]" : ""
          } left-8`}
          onClick={() => setShow(!show)}
          type="primary"
          icon={show ? <CloseOutlined /> : <ReadOutlined />}
        />
      </div>
      <aside
        className={`transition duration-300 top-6 pt-24 w-96 md:w-80 bg-slate-800/70 glass fixed left-0 h-full z-20 p-8 ${
          show ? "" : "-translate-x-96 lg:translate-x-0"
        } overflow-y-auto`}
      >
        <h1 className="text-lg text-white font-semibold text-center mt-2">
          Inhaltsverzeichnis
        </h1>
        <hr className="h-0 mt-3 mb-6 border-1 border-slate-300/20" />
        <ol className="">
          {(headings || []).map((h) => (
            <li
              key={h[0]}
              onClick={() => {
                const url =
                  window.location.href.split("#")[0] + "#" + slugs.slug(h[0]);
                console.log(h[0]);
                router.push(url);
                setShow(false);
              }}
              className={`${
                st[h[1]]
              } list-disc list-inside break-all my-1 rounded-md hover:bg-slate-400/20 px-2 py-1 transition duration-200 hover:text-white cursor-pointer`}
            >
              {h[0]}
            </li>
          ))}
        </ol>
      </aside>
    </>
  );
};

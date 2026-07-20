import localFont from "next/font/local";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AppLayout } from "../components/applayout";
import { getMetadata } from "../lib/seo";
import { AntDProvider } from "../contexts/antd";
import { DEFAULT_BLOG_LANGUAGE } from "../types/meta";

const inter = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  display: "swap",
});

export const metadata = getMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={DEFAULT_BLOG_LANGUAGE}>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className + " bg-gray-900 text-white/70"}>
        <AntdRegistry>
          <AntDProvider>
            <AppLayout>{children}</AppLayout>
          </AntDProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

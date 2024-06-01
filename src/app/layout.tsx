import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AppLayout } from "../components/applayout";
import { getMetadata } from "../lib/seo";
import { AntDProvider } from "../contexts/antd";

const inter = Inter({ subsets: ["latin"] });

export const metadata = getMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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

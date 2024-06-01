import { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return <div className="pt-12 px-24 flex flex-col gap-4">{children}</div>;
};
export default Layout;

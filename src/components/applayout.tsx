import { FC } from "react";
import { Nav } from "./layout/nav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
    <div>
      <Nav />
      <div className="">{children}</div>
    </div>
  );
};

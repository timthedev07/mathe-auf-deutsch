import { FC } from "react";
import { Nav } from "./layout/nav";
import { GitHubCorner } from "./layout/GithubCorner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
    <div>
      <Nav />
      <GitHubCorner href="https://github.com/timthedev07/mathe-auf-deutsch" />
      <div className="">{children}</div>
    </div>
  );
};

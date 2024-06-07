import { FC } from "react";
import { Nav } from "./layout/nav";
import { GitHubCorner } from "./layout/GHCorner";
import { WithToaster } from "./layout/WithToaster";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
    <WithToaster>
      <Nav />
      <GitHubCorner href="https://github.com/timthedev07/mathe-auf-deutsch" />
      {children}
    </WithToaster>
  );
};

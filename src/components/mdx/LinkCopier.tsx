"use client";
import { FC, ReactNode } from "react";

interface LinkCopierProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export const LinkCopier: FC<LinkCopierProps> = ({
  id,
  children,
  className,
}) => {
  return (
    <div
      className={className}
      onClick={() => {
        const s = window.location.href;
        if (id) {
          window.navigator.clipboard.writeText(
            s.slice(0, s.indexOf("#")) + "#" + id
          );
        }
      }}
    >
      {children}
    </div>
  );
};

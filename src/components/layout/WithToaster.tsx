import { Toaster } from "sonner";
import { FC, PropsWithChildren } from "react";

export const WithToaster: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Toaster richColors closeButton theme="dark" />
      {children}
    </>
  );
};

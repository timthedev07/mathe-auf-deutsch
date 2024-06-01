"use client";
import { ConfigProvider, theme } from "antd";
import React, { PropsWithChildren, useContext } from "react";
import colors from "tailwindcss/colors";

interface AntDContextType {}
const AntDContext = React.createContext<AntDContextType>({});

export const useAntD = () => {
  return useContext(AntDContext);
};

export const AntDProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const value: AntDContextType = {};
  return (
    <AntDContext.Provider value={value}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          components: {
            Menu: {
              darkItemSelectedBg: colors.blue[200],
              itemSelectedBg: colors.blue[400] + "20",
              itemSelectedColor: colors.blue[400],
            },
            Input: {
              colorBgContainer: "transparent",
              activeBg: colors.slate[700] + "20",
              colorBorder: colors.gray[700],
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AntDContext.Provider>
  );
};

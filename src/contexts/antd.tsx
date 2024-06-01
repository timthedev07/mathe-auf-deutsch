"use client";
import { ConfigProvider, theme } from "antd";
import React, { PropsWithChildren, useContext } from "react";

interface AntDContextType {}
const AntDContext = React.createContext<AntDContextType>({});

export const useAntD = () => {
  return useContext(AntDContext);
};

export const AntDProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const value: AntDContextType = {};
  return (
    <AntDContext.Provider value={value}>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        {children}
      </ConfigProvider>
    </AntDContext.Provider>
  );
};

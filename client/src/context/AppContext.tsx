import React, { createContext, useEffect, useState, type ReactNode } from "react";

interface FileMeta {
  name: string;
  size: number;
  type: string;
}

interface AppContextValue {
  file: FileMeta[];
  setFile: React.Dispatch<React.SetStateAction<FileMeta[]>>;
}

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContent = createContext<AppContextValue | null>(null);

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const fileData = localStorage.getItem("files");
  const savedFiles: FileMeta[] = fileData ? JSON.parse(fileData) : [];

  const [file, setFile] = useState<FileMeta[]>(savedFiles);

  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(file));
  }, [file]);

  const value = { file, setFile };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};

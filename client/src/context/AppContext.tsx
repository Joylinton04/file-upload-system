import React, { createContext, useEffect, useState, type ReactNode } from "react";

type Status = "local" | "uploaded";

interface FileMeta {
  id: string;
  name: string;
  size: number;
  type: string;
  base64: string;
}

interface AppContextValue {
  file: FileMeta[];
  setFile: React.Dispatch<React.SetStateAction<FileMeta[]>>;
  handleStatus: Status;
  setHandleStatus: React.Dispatch<React.SetStateAction<Status>>;
}

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContent = createContext<AppContextValue | null>(null);

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const fileData = localStorage.getItem("files");
  const status = localStorage.getItem("Status");

  const savedFiles: FileMeta[] = fileData ? JSON.parse(fileData) : [];

  let currentStatus: Status = "local";
  try {
    if (status && status !== "undefined") {
      currentStatus = JSON.parse(status);
    }
  } catch (err) {
    console.warn("Invalid status in localStorage:", err);
  }

  const [file, setFile] = useState<FileMeta[]>(savedFiles);
  const [handleStatus, setHandleStatus] = useState<Status>(currentStatus);

  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(file));
  }, [file]);

  useEffect(() => {
    localStorage.setItem("Status", JSON.stringify(handleStatus));
  }, [handleStatus]);

  const value = { file, setFile, handleStatus, setHandleStatus };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};

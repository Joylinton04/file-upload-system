import { useContext } from "react";
import { AppContent } from "../context/AppContext";

export const useAppContext = () => {
  const context = useContext(AppContent);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

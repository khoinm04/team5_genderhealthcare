import { createContext, useContext } from "react";

export const UserContext = createContext(null);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within UserContext.Provider");
  }
  return context;
}
"use client";
import { createContext, useContext, ReactNode } from "react";

interface Hello {
  greeting: string;
}

const HelloContext = createContext<Hello | null>(null);

const useHello = () => useContext(HelloContext);

interface Props {
  hello: Hello;
  children: ReactNode;
}

export const HelloProvider = ({ hello, children }: Props) => {
  return (
    <HelloContext.Provider value={hello}>{children}</HelloContext.Provider>
  );
};

export default useHello;

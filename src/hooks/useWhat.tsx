"use client";
import { createContext, useContext, ReactNode } from "react";

interface What {
  greeting: string;
}

const WhatContext = createContext<What | null>(null);

const useWhat = () => useContext(WhatContext);

interface Props {
  what: What;
  children: ReactNode;
}

export const WhatProvider = ({ what, children }: Props) => {
  return (
    <WhatContext.Provider value={ what }>{children}</WhatContext.Provider>
  );
};

export default useWhat;

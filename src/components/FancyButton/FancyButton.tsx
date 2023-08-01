"use client";
import { ReactNode } from "react";
import useHello from "hooks/useExample";

interface Props {
  children: ReactNode;
}

const FancyButton = ({ children }: Props) => {
  const hello = useHello();
  return (
    <button>
      {hello?.greeting ?? "Ahoy matey"} from FancyButton. {children}
    </button>
  );
};

export default FancyButton;

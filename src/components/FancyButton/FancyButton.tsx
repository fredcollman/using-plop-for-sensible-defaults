import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const FancyButton = ({ children }: Props) => {
  return <button>TODO: implement FancyButton. {children}</button>;
};

export default FancyButton;

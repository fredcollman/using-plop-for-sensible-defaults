import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Button = ({ children }: Props) => {
  return <button>TODO: implement Button. {children}</button>;
};

export default Button;

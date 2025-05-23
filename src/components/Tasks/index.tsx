import { ReactNode } from "react";
import { Container } from "./styles";
type Props = {
  children: ReactNode;
};
export function Tasks({ children }: Props) {
  return <Container>{children}</Container>;
}

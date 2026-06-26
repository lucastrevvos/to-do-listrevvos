import flowMark from "@/assets/images/flow-mark.png";
import { Container, Logo } from "./styles";

export function Header() {
  return (
    <Container>
      <Logo source={flowMark} />
    </Container>
  );
}

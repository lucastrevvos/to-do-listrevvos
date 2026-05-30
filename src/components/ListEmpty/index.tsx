import { Container, Mark, Text, Title } from "./styles";

const flowMark = require("../../../assets/images/flow-mark.png");

type Props = {
  title: string;
  text: string;
};
export function ListEmpty({ title, text }: Props) {
  return (
    <Container>
      <Mark
        source={flowMark}
        accessible={false}
        accessibilityIgnoresInvertColors
      />
      <Title>{title}</Title>
      <Text>{text}</Text>
    </Container>
  );
}

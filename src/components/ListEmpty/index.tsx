import { Container, Icon, Text, Title } from "./styles";

type Props = {
  title: string;
  text: string;
};
export function ListEmpty({ title, text }: Props) {
  return (
    <Container>
      <Icon name="clipboard-outline" />
      <Title>{title}</Title>
      <Text>{text}</Text>
    </Container>
  );
}

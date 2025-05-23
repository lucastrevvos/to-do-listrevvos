import { Container, Count, Label, StatusBox } from "./styles";

type Props = {
  createdCount: number;
  completedCount: number;
};

export function TaskStatus({ createdCount, completedCount }: Props) {
  return (
    <Container>
      <StatusBox>
        <Label type="created">Criadas</Label>
        <Count>{createdCount}</Count>
      </StatusBox>

      <StatusBox>
        <Label type="completed">Concluídas</Label>
        <Count>{completedCount}</Count>
      </StatusBox>
    </Container>
  );
}

import { Checkbox } from "../Checkbox";
import { Container, Icon, Text } from "./styles";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type Props = {
  task: Task;
  onToggle: () => void;
};

export function Tasks({ task, onToggle }: Props) {
  return (
    <Container>
      <Checkbox onPress={onToggle} checked={task.completed} />
      <Text completed={task.completed}>{task.title}</Text>
      <Icon name="trash-outline"></Icon>
    </Container>
  );
}

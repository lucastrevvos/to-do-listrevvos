import { Task } from "@/src/types/task";
import Animated, {
  FadeInUp,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";
import { Checkbox } from "../Checkbox";
import { Container, Icon, Text } from "./styles";

type Props = {
  task: Task;
  onToggle: () => void;
  onRemove: (id: string) => void;
};

export function Tasks({ task, onToggle, onRemove }: Props) {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      layout={LinearTransition}
    >
      <Container>
        <Checkbox onPress={onToggle} checked={task.completed} />
        <Text completed={task.completed}>{task.title}</Text>
        <Icon onPress={() => onRemove(task.id)} name="trash-outline"></Icon>
      </Container>
    </Animated.View>
  );
}

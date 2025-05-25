import Animated, {
  FadeInUp,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";
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
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      layout={LinearTransition}
    >
      <Container>
        <Checkbox onPress={onToggle} checked={task.completed} />
        <Text completed={task.completed}>{task.title}</Text>
        <Icon name="trash-outline"></Icon>
      </Container>
    </Animated.View>
  );
}

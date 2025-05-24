import { useState } from "react";
import { Checkbox } from "../Checkbox";
import { Container, Icon, Text } from "./styles";

type Props = {
  task: string;
};
export function Tasks({ task }: Props) {
  const [checked, setChecked] = useState(false);
  return (
    <Container>
      <Checkbox onPress={() => setChecked(!checked)} checked={checked} />
      <Text completed={checked}>{task}</Text>
      <Icon name="trash-outline"></Icon>
    </Container>
  );
}

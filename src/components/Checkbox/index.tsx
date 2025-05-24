import { TouchableOpacityProps } from "react-native";
import { Box, Container, Icon } from "./styles";

type Props = TouchableOpacityProps & {
  checked: boolean;
};

export function Checkbox({ checked, ...rest }: Props) {
  return (
    <Container {...rest}>
      <Box checked={checked}>{checked && <Icon name="checkmark" />}</Box>
    </Container>
  );
}

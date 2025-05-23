import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacityProps } from "react-native";
import { Container, Icon } from "./styles";

type Props = TouchableOpacityProps & {
  icon: keyof typeof Ionicons.glyphMap;
};
export function ButtonIcon({ icon, ...rest }: Props) {
  return (
    <Container {...rest}>
      <Icon name={icon} />
    </Container>
  );
}

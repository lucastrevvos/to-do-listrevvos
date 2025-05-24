import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

type Props = {
  checked: boolean;
};

export const Container = styled.TouchableOpacity`
  padding: 4px;
`;

export const Box = styled.View<Props>`
  width: 20px;
  height: 20px;
  border-width: 2px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme, checked }) =>
    checked ? theme.COLORS.PURPLE_DARK : "transparent"};

  border-color: ${({ theme, checked }) =>
    checked ? theme.COLORS.PURPLE_DARK : theme.COLORS.BLUE};
`;

export const Icon = styled(Ionicons).attrs(({ theme }) => ({
  size: 13,
  color: theme.COLORS.WHITE,
}))``;

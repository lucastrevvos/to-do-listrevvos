import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export const Container = styled(TouchableOpacity)`
  width: 56px;
  height: 56px;

  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.COLORS.BLUE_DARK};

  border-radius: 6px;
  justify-content: center;
  align-items: center;
`;

export const Icon = styled(Ionicons).attrs(({ theme }) => ({
  size: 20,
  color: theme.COLORS.GRAY_100,
}))``;

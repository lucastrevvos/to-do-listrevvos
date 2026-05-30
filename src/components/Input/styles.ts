import { TextInput } from "react-native";
import styled from "styled-components/native";

type Props = {
  isFocused: boolean;
};

export const Container = styled(TextInput)<Props>`
  min-height: 52px;
  padding: 0 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme.COLORS.WHITE};
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid
    ${({ theme, isFocused }) =>
      isFocused ? theme.COLORS.BLUE : theme.COLORS.GRAY_500};
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

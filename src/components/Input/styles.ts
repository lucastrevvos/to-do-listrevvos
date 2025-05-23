import { TextInput } from "react-native";
import styled, { css } from "styled-components/native";

type Props = {
  isFocused: boolean;
};
export const Container = styled(TextInput)<Props>`
  flex: 1;
  min-height: 56px;
  max-height: 56px;
  padding: 0 16px;
  border-width: 1px;

  ${({ theme, isFocused }) => css`
    background-color: ${theme.COLORS.GRAY_500};
    color: ${theme.COLORS.WHITE};
    font-family: ${theme.FONT_FAMILY.REGULAR};
    border-color: ${isFocused ? theme.COLORS.PURPLE : theme.COLORS.GRAY_400};
  `}

  border-radius: 6px;
  padding: 0 16px;
`;

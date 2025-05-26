import { Ionicons } from "@expo/vector-icons";
import styled, { css } from "styled-components/native";

type Props = {
  completed: boolean;
};

export const Container = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  text-align: center;
  align-items: center;

  margin-bottom: 12px;

  border-radius: 6px;
  padding: 24px;
  ${({ theme }) => css`
    background-color: ${theme.COLORS.GRAY_600};
  `}
`;

export const Text = styled.Text<Props>`
  flex: 1;
  margin-left: 12px;

  ${({ theme }) => css`
    color: ${theme.COLORS.WHITE};
    font-family: ${theme.FONT_FAMILY.REGULAR};
  `}

  ${({ completed }) =>
    completed &&
    css`
      text-decoration: line-through;
      opacity: 0.6;
    `}
`;

export const Icon = styled(Ionicons).attrs(({ theme }) => ({
  size: 18,
  color: theme.COLORS.GRAY_300,
}))``;

import styled, { css } from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px 24px;
`;

export const Title = styled.Text`
  text-align: center;

  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_400};
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${theme.FONT_SIZE.LG}px;
  `}
`;

export const Text = styled.Text`
  text-align: center;
  margin-top: 6px;

  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_400};
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${theme.FONT_SIZE.MD}px;
  `}
`;

export const Mark = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  margin-bottom: 14px;
`;

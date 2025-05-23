import styled, { css } from "styled-components/native";

export const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0 20px 12px;

  border-bottom-width: 1px;
  border-bottom-color: #333333;
`;

export const StatusBox = styled.View`
  flex-direction: row;
  align-items: center;
`;

type LabelProps = {
  type: "created" | "completed";
};

export const Label = styled.Text<LabelProps>`
  ${({ theme, type }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${theme.FONT_SIZE.MD}px;
    color: ${type === "created" ? theme.COLORS.BLUE : theme.COLORS.PURPLE};
  `}
`;

export const Count = styled.Text`
  ${({ theme }) => css`
    background-color: ${theme.COLORS.GRAY_400};
    color: ${theme.COLORS.WHITE};
    font-family: ${theme.FONT_FAMILY.BOLD};
    border-radius: 999px;
    font-size: ${theme.FONT_SIZE.SM}px;
  `}

  padding: 2px 8px;
  margin-left: 8px;
`;

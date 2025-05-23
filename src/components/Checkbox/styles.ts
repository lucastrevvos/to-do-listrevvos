import styled from "styled-components/native";

type Props = {
  checked: boolean;
};

export const Container = styled.TouchableOpacity`
  padding: 4px;
`;

export const Box = styled.View<Props>`
  width: 24px;
  height: 24px;
  border-width: 2px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme, checked }) =>
    checked ? theme.COLORS.PURPLE_DARK : "transparent"};

  border-color: ${({ theme, checked }) =>
    checked ? theme.COLORS.PURPLE_DARK : theme.COLORS.BLUE};
`;

export const Dot = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
`;

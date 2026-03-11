import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
`;

export const Form = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;

  padding: 0 20px;
  margin-top: 12px;
  z-index: 2;
`;

export const Content = styled.View`
  flex: 1;
  padding: 0 20px;
  padding-top: 16px;
`;
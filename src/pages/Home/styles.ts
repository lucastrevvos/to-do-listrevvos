import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.BLACK};
  position: relative;
`;

export const Content = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
  padding: 60px 12px 12px;
  margin-top: 32px;
`;

export const Form = styled.View`
  position: absolute;

  top: 150px;
  left: 12px;
  right: 12px;
  z-index: 10;

  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

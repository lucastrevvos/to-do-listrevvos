// src/pages/Home/styles.ts
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
`;

export const Form = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;

  /* layout previsível, nada de absolute aqui */
  padding: 0 16px;
  margin-top: 8px;

  /* garante que não fique escondido por algo acima */
  z-index: 2;
  /* position: relative;  // se precisar sobrepor levemente, descomenta */
`;

export const Content = styled.View`
  flex: 1;
  /* espaço pra lista respirar abaixo do form */
  padding: 0 16px;
  padding-top: 12px;
`;

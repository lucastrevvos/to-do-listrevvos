import React from "react";
import styled from "styled-components/native";

export function ProfilePage() {
  return (
    <Container>
      <Title>Perfil</Title>
      <Sub>
        Aqui ficarão configurações, premium, backup e dados da conta.
      </Sub>

      <Card>
        <Item>🔥 Streak de produtividade</Item>
        <Item>👤 Conta</Item>
        <Item>💎 Premium</Item>
        <Item>⚙️ Configurações</Item>
      </Card>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 24px 20px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 24px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 8px;
`;

const Sub = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 14px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  margin-bottom: 20px;
`;

const Card = styled.View`
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
  border-radius: 16px;
  padding: 16px;
  gap: 12px;
`;

const Item = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 15px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;
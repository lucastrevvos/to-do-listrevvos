import { JoinSharedListModal } from "@/src/components/JoinSharedListModal";
import { getGuestId } from "@/src/services/guest";
import { joinSharedInviteByToken } from "@/src/services/sharedInvites";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import { Alert, Pressable } from "react-native";
import styled from "styled-components/native";
import {
  CardDescription,
  CardTitle,
  ItemDescription,
  ItemTitle,
  SectionTitle,
} from "./styles";

export function ProfilePage() {
  const [guestId, setGuestId] = useState("");
  const [showJoin, setShowJoin] = useState(false);

  async function handleJoin(token: string) {
    try {
      const result = await joinSharedInviteByToken(token);
      setShowJoin(false);

      Alert.alert("Sucesso", "Você entrou na lista!");
    } catch (e: any) {
      Alert.alert(
        "Erro",
        e?.response?.data?.message ?? "Não foi possível entrar",
      );
    }
  }

  useEffect(() => {
    getGuestId().then(setGuestId);
  }, []);

  return (
    <Container>
      <Title>Perfil</Title>
      <Sub>Aqui ficarão configurações, premium, backup e dados da conta.</Sub>

      <SectionTitle>Seu dispositivo</SectionTitle>

      <Card>
        <CardTitle>Identificação</CardTitle>

        <CardDescription numberOfLines={1}>
          {guestId || "Carregando..."}
        </CardDescription>

        <Pressable
          onPress={async () => {
            await Clipboard.setStringAsync(guestId);
            Alert.alert("Copiado", "ID copiado para área de transferência");
          }}
          style={{ marginTop: 10 }}
        >
          <ItemTitle>Copiar ID</ItemTitle>
        </Pressable>
      </Card>

      <SectionTitle>Colaboração</SectionTitle>

      <Card>
        <Pressable onPress={() => setShowJoin(true)}>
          <ItemTitle>Entrar por token</ItemTitle>
          <ItemDescription>
            Cole um token recebido para entrar em uma lista compartilhada.
          </ItemDescription>
        </Pressable>
      </Card>
      <JoinSharedListModal
        visible={showJoin}
        onClose={() => setShowJoin(false)}
        onConfirm={handleJoin}
      />
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

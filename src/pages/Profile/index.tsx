import { AppHeader } from "@/src/components/AppHeader";
import { JoinSharedListModal } from "@/src/components/JoinSharedListModal";
import { getGuestId } from "@/src/services/guest";
import { joinSharedInviteByToken } from "@/src/services/sharedInvites";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import { Alert, Pressable } from "react-native";
import {
  AppVersion,
  Badge,
  BadgeText,
  Card,
  CardDescription,
  CardTitle,
  Container,
  HeroCard,
  HeroDescription,
  HeroTitle,
  ItemDescription,
  ItemRow,
  ItemTitle,
  SectionTitle,
} from "./styles";

export function ProfilePage() {
  const [guestId, setGuestId] = useState("");
  const [showJoin, setShowJoin] = useState(false);

  async function handleJoin(token: string) {
    try {
      await joinSharedInviteByToken(token);
      setShowJoin(false);

      Alert.alert("Sucesso", "Você entrou na lista compartilhada.");
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
      <AppHeader
        title="Perfil"
        subtitle="Utilidades, informações e futuro do TodoList Trevvos"
      />

      <HeroCard>
        <Badge>
          <BadgeText>TodoList Trevvos</BadgeText>
        </Badge>

        <HeroTitle>Seu espaço de controle do app</HeroTitle>
        <HeroDescription>
          Aqui você encontra informações do dispositivo, acesso rápido para
          colaboração e uma visão do que vem nas próximas versões.
        </HeroDescription>
      </HeroCard>

      <SectionTitle>Seu dispositivo</SectionTitle>

      <Card>
        <CardTitle>Identificação do app</CardTitle>
        <CardDescription numberOfLines={1}>
          {guestId || "Carregando..."}
        </CardDescription>

        <ItemRow>
          <Pressable
            onPress={async () => {
              if (!guestId) return;
              await Clipboard.setStringAsync(guestId);
              Alert.alert("Copiado", "ID copiado para a área de transferência");
            }}
          >
            <ItemTitle>Copiar ID</ItemTitle>
            <ItemDescription>
              Útil para debug, suporte e testes entre dispositivos.
            </ItemDescription>
          </Pressable>
        </ItemRow>
      </Card>

      <SectionTitle>Colaboração</SectionTitle>

      <Card>
        <ItemRow>
          <Pressable onPress={() => setShowJoin(true)}>
            <ItemTitle>Entrar por token</ItemTitle>
            <ItemDescription>
              Cole um token recebido para entrar em uma lista compartilhada.
            </ItemDescription>
          </Pressable>
        </ItemRow>
      </Card>

      <SectionTitle>Próximas versões</SectionTitle>

      <Card>
        <ItemRow>
          <ItemTitle>v2</ItemTitle>
          <ItemDescription>
            Refinamento visual, estabilidade e melhor experiência com listas.
          </ItemDescription>
        </ItemRow>

        <ItemRow>
          <ItemTitle>v3</ItemTitle>
          <ItemDescription>
            Recursos premium com IA para geração, organização e sugestões de
            listas.
          </ItemDescription>
        </ItemRow>
      </Card>

      <AppVersion>TodoList Trevvos • v2 em evolução</AppVersion>

      <JoinSharedListModal
        visible={showJoin}
        onClose={() => setShowJoin(false)}
        onConfirm={handleJoin}
      />
    </Container>
  );
}

import { todoApi } from "@/src/services/todoApi";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useTheme } from "styled-components/native";
import {
    BtnPrimary,
    BtnText,
    Card,
    Container,
    Pill,
    PillText,
    Row,
    Sub,
    Title,
} from "./styles";

type InvitePreview = {
  token: string;
  role: "EDITOR" | "VIEWER";
  expiresAt: string;
  maxUses: number;
  uses: number;
  revoked: boolean;
  list: { id: string; title: string };
};

type Props = {
  token?: string; // vem do adapter (Expo Router)
};

export function Invite({ token: tokenProp }: Props) {
  const { COLORS } = useTheme();

  // fallback: se alguém renderizar esta tela sem passar prop
  const params = useLocalSearchParams<{ token: string }>();
  const token = (tokenProp ?? params?.token ?? "").toString();

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [invite, setInvite] = useState<InvitePreview | null>(null);

  const status = useMemo(() => {
    if (!invite) return null;

    if (invite.revoked) return { label: "Revogado", tone: "danger" as const };

    const expired = new Date(invite.expiresAt).getTime() < Date.now();
    if (expired) return { label: "Expirado", tone: "danger" as const };

    if (invite.uses >= invite.maxUses)
      return { label: "Esgotado", tone: "danger" as const };

    return { label: "Ativo", tone: "ok" as const };
  }, [invite]);

  async function loadInvite(currentToken: string) {
    try {
      if (!currentToken) {
        Alert.alert("Convite inválido", "Token ausente.", [
          { text: "Ok", onPress: () => router.back() },
        ]);
        return;
      }

      setLoading(true);
      const { data } = await todoApi.get<InvitePreview>(
        `/v1/todo/invites/${currentToken}`,
      );
      setInvite(data);
    } catch (e: any) {
      Alert.alert(
        "Convite inválido",
        e?.response?.data?.message ?? "Não foi possível carregar o convite.",
        [{ text: "Ok", onPress: () => router.back() }],
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    try {
      if (!invite) return;

      if (status?.tone === "danger") {
        Alert.alert("Não dá pra entrar", "Esse convite não está mais válido.");
        return;
      }

      setJoining(true);
      await todoApi.post(`/v1/todo/invites/${token}/join`);

      Alert.alert("Bem-vindo!", `Você entrou na lista: ${invite.list.title}`, [
        {
          text: "Ok",
          onPress: () => {
            // volta pra home do app
            router.replace({
                pathname: "/",
                params: {
                    refreshShared: "1",
                    selectSharedListId: invite.list.id,
                },
            });
          },
        },
      ]);
    } catch (e: any) {
      Alert.alert(
        "Falha ao entrar",
        e?.response?.data?.message ?? "Não foi possível entrar na lista.",
      );
    } finally {
      setJoining(false);
    }
  }

  useEffect(() => {
    loadInvite(token);
     
  }, [token]);

  if (loading) {
    return (
      <Container style={{ alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="small" color={COLORS.GRAY_300} />
      </Container>
    );
  }

  if (!invite) return <Container />;

  const roleLabel = invite.role === "EDITOR" ? "Pode editar" : "Somente leitura";

  return (
    <Container>
      <Card>
        <Pill tone={status?.tone ?? "ok"}>
          <PillText>{status?.label ?? "..."}</PillText>
        </Pill>

        <Title>Convite para lista</Title>
        <Sub>{invite.list.title}</Sub>

        <Row>
          <Sub>Permissão:</Sub>
          <Sub style={{ color: COLORS.GRAY_100 }}>{roleLabel}</Sub>
        </Row>

        <Row>
          <Sub>Validade:</Sub>
          <Sub style={{ color: COLORS.GRAY_100 }}>
            {new Date(invite.expiresAt).toLocaleString()}
          </Sub>
        </Row>

        <Row>
          <Sub>Usos:</Sub>
          <Sub style={{ color: COLORS.GRAY_100 }}>
            {invite.uses}/{invite.maxUses}
          </Sub>
        </Row>

        <BtnPrimary
          onPress={handleJoin}
          disabled={joining || status?.tone === "danger"}
        >
          {joining ? (
            <ActivityIndicator size="small" color={COLORS.WHITE} />
          ) : (
            <BtnText>Entrar na lista</BtnText>
          )}
        </BtnPrimary>

        <BtnPrimary
          onPress={() => router.back()}
          style={{ backgroundColor: COLORS.GRAY_600 }}
        >
          <BtnText>Voltar</BtnText>
        </BtnPrimary>
      </Card>
    </Container>
  );
}
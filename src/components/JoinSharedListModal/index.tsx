import React, { useState } from "react";
import { ActivityIndicator, Modal, Pressable } from "react-native";
import styled from "styled-components/native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (token: string) => Promise<void> | void;
};

export function JoinSharedListModal({ visible, onClose, onConfirm }: Props) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    const value = token.trim();
    if (!value) return;

    try {
      setLoading(true);
      await onConfirm(value);
      setToken("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Backdrop onPress={onClose}>
        <Card onStartShouldSetResponder={() => true}>
          <Title>Entrar por token</Title>

          <Sub>Cole o token do convite para entrar em uma lista compartilhada.</Sub>

          <TokenInput
            value={token}
            onChangeText={setToken}
            placeholder="Cole o token aqui"
            placeholderTextColor="#808080"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
          />

          <Row>
            <GhostButton onPress={onClose} disabled={loading}>
              <GhostButtonText>Cancelar</GhostButtonText>
            </GhostButton>

            <PrimaryButton onPress={handleConfirm} disabled={loading || !token.trim()}>
              {loading ? (
                <ActivityIndicator />
              ) : (
                <PrimaryButtonText>Entrar</PrimaryButtonText>
              )}
            </PrimaryButton>
          </Row>
        </Card>
      </Backdrop>
    </Modal>
  );
}

const Backdrop = styled(Pressable)`
  flex: 1;
  background: rgba(0, 0, 0, 0.55);
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Card = styled.View`
  width: 100%;
  border-radius: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 18px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 8px;
`;

const Sub = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 14px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  margin-bottom: 12px;
`;

const TokenInput = styled.TextInput`
  border-radius: 12px;
  padding: 12px;
  color: ${({ theme }) => theme.COLORS.WHITE};
  background: ${({ theme }) => theme.COLORS.GRAY_700};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
`;

const Row = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 14px;
`;

const GhostButton = styled.Pressable`
  flex: 1;
  border-radius: 12px;
  padding: 12px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
`;

const GhostButtonText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

const PrimaryButton = styled.Pressable`
  flex: 1;
  border-radius: 12px;
  padding: 12px;
  align-items: center;
  background: ${({ theme }) => theme.COLORS.BLUE_DARK};
`;

const PrimaryButtonText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;
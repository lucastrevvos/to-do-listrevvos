import React, { useState } from "react";
import { ActivityIndicator, Modal, Pressable } from "react-native";
import styled from "styled-components/native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (title: string) => Promise<void> | void;
};

export function SharedListCreateModal({ visible, onClose, onConfirm }: Props) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleConfirm() {
    const t = title.trim();
    if (!t) return;
    try {
      setSaving(true);
      await onConfirm(t);
      setTitle("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Backdrop onPress={onClose}>
        <Card onStartShouldSetResponder={() => true}>
          <H1>Nova lista compartilhada</H1>
          <Input
            placeholder="Ex: Mercado do mês"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            editable={!saving}
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
          />

          <Row>
            <BtnGhost onPress={onClose} disabled={saving}>
              <BtnText>Cancelar</BtnText>
            </BtnGhost>

            <BtnPrimary onPress={handleConfirm} disabled={saving || !title.trim()}>
              {saving ? <ActivityIndicator /> : <BtnTextPrimary>Criar</BtnTextPrimary>}
            </BtnPrimary>
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

const H1 = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Input = styled.TextInput`
  border-radius: 12px;
  padding: 12px 12px;
  color: ${({ theme }) => theme.COLORS.WHITE};
  background: ${({ theme }) => theme.COLORS.GRAY_700};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
`;

const Row = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 14px;
`;

const BtnGhost = styled.Pressable`
  flex: 1;
  border-radius: 12px;
  padding: 12px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
`;

const BtnPrimary = styled.Pressable`
  flex: 1;
  border-radius: 12px;
  padding: 12px;
  align-items: center;
  background: ${({ theme }) => theme.COLORS.BLUE_DARK};
`;

const BtnText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-weight: 700;
`;

const BtnTextPrimary = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-weight: 800;
`;
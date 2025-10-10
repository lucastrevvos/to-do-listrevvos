import React, { useEffect, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import styled from "styled-components/native";

const Backdrop = styled(View)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  align-items: center;
  justify-content: center;
`;
const Card = styled(View)`
  width: 90%;
  padding: 16px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
`;
const Title = styled(Text)`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
`;
const Field = styled(TextInput)`
  background: ${({ theme }) => theme.COLORS.GRAY_600};
  color: ${({ theme }) => theme.COLORS.WHITE};
  padding: 12px;
  border-radius: 8px;
`;
const Row = styled(View)`
  flex-direction: row;
  gap: 12px;
  margin-top: 12px;
`;
const Btn = styled(Pressable)`
  padding: 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.COLORS.GRAY_600};
  flex: 1;
`;
const BtnText = styled(Text)`
  color: ${({ theme }) => theme.COLORS.WHITE};
  text-align: center;
  font-weight: 600;
`;

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (title: string) => void;
};

export function GroupCreateModal({ visible, onClose, onConfirm }: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!visible) setName("");
  }, [visible]);

  function submit() {
    const t = name.trim();
    if (t.length === 0) return;
    onConfirm(t);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Backdrop>
        <Card>
          <Title>Novo grupo</Title>
          <Field
            placeholder="Ex.: Compras, Trabalho, Pessoais"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoFocus
            onSubmitEditing={submit}
            returnKeyType="done"
          />
          <Row>
            <Btn onPress={onClose}>
              <BtnText>Cancelar</BtnText>
            </Btn>
            <Btn onPress={submit}>
              <BtnText>Criar</BtnText>
            </Btn>
          </Row>
        </Card>
      </Backdrop>
    </Modal>
  );
}

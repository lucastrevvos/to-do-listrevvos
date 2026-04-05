import type { ListType } from "@/src/types/group";
import React, { useEffect, useRef, useState } from "react";
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

const TypeRow = styled(View)`
  flex-direction: row;
  gap: 8px;
  margin-top: 14px;
`;

const TypeButton = styled(Pressable)<{ active?: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background: ${({ theme, active }) =>
    active ? theme.COLORS.BLUE_DARK : theme.COLORS.GRAY_600};
  border: 1px solid
    ${({ theme, active }) =>
      active ? theme.COLORS.BLUE : theme.COLORS.GRAY_500};
`;

const TypeButtonText = styled(Text)`
  color: ${({ theme }) => theme.COLORS.WHITE};
  text-align: center;
  font-weight: 600;
  font-size: 12px;
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
  onConfirm: (title: string, type: ListType) => void;
};

export function GroupCreateModal({ visible, onClose, onConfirm }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ListType>("task");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);

      return () => clearTimeout(timer);
    }

    setName("");
    setType("task");
  }, [visible]);

  function submit() {
    const t = name.trim();
    if (t.length === 0) return;
    onConfirm(t, type);
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
          <Title>Nova lista</Title>

          <Field
            ref={inputRef}
            placeholder="Ex.: Compras, Trabalho, Pessoais"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            onSubmitEditing={submit}
            returnKeyType="done"
          />

          <TypeRow>
            <TypeButton
              active={type === "shopping"}
              onPress={() => setType("shopping")}
            >
              <TypeButtonText>🛒 Compras</TypeButtonText>
            </TypeButton>

            <TypeButton
              active={type === "task"}
              onPress={() => setType("task")}
            >
              <TypeButtonText>✔ Tarefas</TypeButtonText>
            </TypeButton>

            <TypeButton
              active={type === "routine"}
              onPress={() => setType("routine")}
            >
              <TypeButtonText>🔁 Rotina</TypeButtonText>
            </TypeButton>
          </TypeRow>

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

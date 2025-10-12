import React from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";

type Props = {
  text: string;
  actionLabel?: string;
  onPress?: () => void;
  onClose?: () => void;
};

const Wrap = styled.View`
  margin: 8px 16px 0;
  padding: 12px 14px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Text = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 13px;
`;

const Action = styled(Pressable)`
  padding: 6px 10px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.COLORS.PURPLE};
`;

const ActionText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 12px;
  font-weight: 600;
`;

export function HintBanner({
  text,
  actionLabel = "Entendi",
  onPress,
  onClose,
}: Props) {
  return (
    <Wrap>
      <Row>
        <Text>{text}</Text>
        <Action onPress={onPress ?? onClose}>
          <ActionText>{actionLabel}</ActionText>
        </Action>
      </Row>
    </Wrap>
  );
}

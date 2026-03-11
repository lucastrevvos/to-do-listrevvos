import React from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";

export type ScopeTabValue = "local" | "shared";

type Props = {
  value: ScopeTabValue;
  onChange: (v: ScopeTabValue) => void;
};

const Wrapper = styled.View`
  padding: 8px 16px 0px 16px;
  flex-direction: row;
  gap: 8px;
`;

const Tab = styled(Pressable)<{ active: boolean }>`
  padding: 8px 12px;
  border-radius: 999px;
  border-width: 1px;

  background-color: ${({ active, theme }) =>
    active ? theme.COLORS.BLUE_DARK : "#333"};
  border-color: ${({ active, theme }) =>
    active ? theme.COLORS.BLUE_DARK : "#666"};
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-weight: 600;
  font-size: 14px;
`;

export function ScopeTabs({ value, onChange }: Props) {
  return (
    <Wrapper>
      <Tab active={value === "local"} onPress={() => onChange("local")}>
        <Label>Locais</Label>
      </Tab>

      <Tab active={value === "shared"} onPress={() => onChange("shared")}>
        <Label>Compartilhadas</Label>
      </Tab>
    </Wrapper>
  );
}

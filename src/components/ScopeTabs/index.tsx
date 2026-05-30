import React from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";

export type ScopeTabValue = "local" | "shared";

type Props = {
  value: ScopeTabValue;
  onChange: (v: ScopeTabValue) => void;
};

const Wrapper = styled.View`
  padding: 8px 20px 0;
  flex-direction: row;
  gap: 6px;
`;

const Tab = styled(Pressable)<{ active: boolean }>`
  flex: 1;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  padding: 8px 10px;
  border-radius: 12px;
  border-width: 1px;

  background-color: ${({ active, theme }) =>
    active ? theme.COLORS.BLUE_DARK : theme.COLORS.GRAY_600};
  border-color: ${({ active, theme }) =>
    active ? theme.COLORS.BLUE : theme.COLORS.GRAY_500};
`;

const Label = styled.Text<{ active: boolean }>`
  color: ${({ active, theme }) =>
    active ? theme.COLORS.WHITE : theme.COLORS.GRAY_200};
  font-weight: 600;
  font-size: 13px;
`;

export function ScopeTabs({ value, onChange }: Props) {
  return (
    <Wrapper>
      <Tab active={value === "local"} onPress={() => onChange("local")}>
        <Label active={value === "local"}>Locais</Label>
      </Tab>

      <Tab active={value === "shared"} onPress={() => onChange("shared")}>
        <Label active={value === "shared"}>Compartilhadas</Label>
      </Tab>
    </Wrapper>
  );
}

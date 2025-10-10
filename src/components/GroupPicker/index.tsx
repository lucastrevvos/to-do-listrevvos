import type { Group } from "@/src/types/group";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import styled from "styled-components/native";

type Props = {
  groups: Group[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd?: () => void;
  onLongPressGroup?: (group: Group) => void;
};

const Bar = styled.View`
  padding: 8px 16px;
`;

const AddChip = styled(Pressable)`
  padding: 9px 14px;
  border-radius: 999px;
  margin-left: 4px;
  background-color: ${({ theme }) => theme.COLORS.BLUE_DARK};
  border: 1px solid ${({ theme }) => theme.COLORS.BLUE_DARK};
  shadow-color: #000000;
  shadow-opacity: 0.25;
  shadow-radius: 6px;
  shadow-offset: 0px 2px;
  elevation: 3;
`;

const ChipText = styled(Text)`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 14px;
  font-weight: 600;
`;

export function GroupPicker({
  groups,
  selectedId,
  onSelect,
  onAdd,
  onLongPressGroup,
}: Props) {
  const PURPLE =
    // usa a chave que existir no tema; se não, fallback roxo
    (global as any)?.theme?.COLORS?.PURPLE ??
    (global as any)?.theme?.COLORS?.PURPLE_DARK ??
    "#7C3AED";

  const PURPLE_BORDER =
    (global as any)?.theme?.COLORS?.PURPLE_DARK ??
    (global as any)?.theme?.COLORS?.PURPLE ??
    "#6D28D9";

  if (!groups || groups.length === 0) {
    return (
      <Bar>
        {onAdd ? (
          <AddChip onPress={onAdd} hitSlop={8}>
            <ChipText>+ Novo grupo</ChipText>
          </AddChip>
        ) : null}
      </Bar>
    );
  }

  return (
    <Bar>
      <FlatList
        horizontal
        data={groups}
        keyExtractor={(g) =>
          `${g.id}-${g.id === selectedId ? "active" : "inactive"}`
        }
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
        renderItem={({ item }) => {
          const active = item.id === selectedId;
          return (
            <Pressable
              onPress={() => onSelect(item.id)}
              onLongPress={() => onLongPressGroup?.(item)}
              delayLongPress={300}
              android_ripple={{
                color: "rgba(255,255,255,0.12)",
                borderless: true,
              }}
              hitSlop={8}
              style={({ pressed }) => [
                styles.chipBase,
                active
                  ? { backgroundColor: PURPLE, borderColor: PURPLE_BORDER }
                  : { backgroundColor: "#333", borderColor: "#666" },
                pressed && { opacity: 0.9 },
              ]}
            >
              <ChipText>{item.title}</ChipText>
            </Pressable>
          );
        }}
        ListFooterComponent={
          onAdd ? (
            <View style={{ paddingLeft: 4 }}>
              <AddChip
                onPress={onAdd}
                android_ripple={{ color: "rgba(0,0,0,0.12)", borderless: true }}
                hitSlop={8}
              >
                <ChipText>+ Novo Grupo</ChipText>
              </AddChip>
            </View>
          ) : null
        }
        extraData={selectedId} // força re-render quando muda o grupo
      />
    </Bar>
  );
}

const styles = StyleSheet.create({
  chipBase: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    borderWidth: 1,
  },
});

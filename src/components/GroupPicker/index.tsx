import type { Group } from "@/src/types/group";
import React from "react";
import { FlatList, Pressable, View } from "react-native";
import styled from "styled-components/native";

type Props = {
  groups: Group[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd?: () => void;
};

const Bar = styled.View`
  padding: 8px 16px;
`;

const Chip = styled(Pressable)<{ active?: boolean }>`
  padding: 8px 12px;
  border-radius: 999px;
  margin-right: 8px;
  /* CONTRASTE: quando inativo GRAY_600; quando ativo GRAY_500 */
  background-color: ${({ theme, active }) =>
    active ? theme.COLORS.GRAY_500 : theme.COLORS.GRAY_600};
`;

const ChipText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 14px;
`;

export function GroupPicker({ groups, selectedId, onSelect, onAdd }: Props) {
  // Se não há grupos, mostra um CTA claro (sem FlatList)
  if (!groups || groups.length === 0) {
    return (
      <Bar>
        <Chip onPress={onAdd}>
          <ChipText>+ Novo grupo</ChipText>
        </Chip>
      </Bar>
    );
  }

  return (
    <Bar>
      <FlatList
        horizontal
        data={groups}
        keyExtractor={(g) => g.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
        renderItem={({ item }) => (
          <Chip
            active={item.id === selectedId}
            onPress={() => onSelect(item.id)}
          >
            <ChipText>{item.title}</ChipText>
          </Chip>
        )}
        ListFooterComponent={
          onAdd ? (
            <View style={{ paddingLeft: 4 }}>
              <Chip onPress={onAdd}>
                <ChipText>+ Novo grupo</ChipText>
              </Chip>
            </View>
          ) : null
        }
      />
    </Bar>
  );
}

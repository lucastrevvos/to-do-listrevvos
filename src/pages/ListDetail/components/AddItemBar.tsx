import { Ionicons } from "@expo/vector-icons";
import type { RefObject } from "react";
import type { TextInput } from "react-native";
import { AddItemButton, FormCard, InputRow, StyledInput } from "../styles";

type Props = {
  value: string;
  placeholder: string;
  inputRef: RefObject<TextInput | null>;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
};

export function AddItemBar({
  value,
  placeholder,
  inputRef,
  onChangeText,
  onSubmit,
}: Props) {
  return (
    <FormCard>
      <InputRow>
        <StyledInput
          ref={inputRef}
          placeholder={placeholder}
          placeholderTextColor="#808080"
          onChangeText={onChangeText}
          value={value}
          onSubmitEditing={onSubmit}
          returnKeyType="done"
        />
        <AddItemButton onPress={onSubmit}>
          <Ionicons name="add" size={22} color="#FFF" />
        </AddItemButton>
      </InputRow>
    </FormCard>
  );
}

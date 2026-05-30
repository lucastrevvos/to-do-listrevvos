import { Ionicons } from "@expo/vector-icons";
import type { RefObject } from "react";
import type { TextInput } from "react-native";
import {
  AddItemButton,
  FormCard,
  InputRow,
  StyledInput,
  SuggestionButton,
  SuggestionButtonText,
} from "../styles";

type Props = {
  value: string;
  placeholder: string;
  inputRef: RefObject<TextInput | null>;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  showSuggestionsAction?: boolean;
  onSuggestItems?: () => void;
};

export function AddItemBar({
  value,
  placeholder,
  inputRef,
  onChangeText,
  onSubmit,
  showSuggestionsAction = false,
  onSuggestItems,
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

      {showSuggestionsAction ? (
        <SuggestionButton onPress={onSuggestItems}>
          <Ionicons name="sparkles-outline" size={14} color="#F2F2F2" />
          <SuggestionButtonText>Sugerir itens</SuggestionButtonText>
        </SuggestionButton>
      ) : null}
    </FormCard>
  );
}

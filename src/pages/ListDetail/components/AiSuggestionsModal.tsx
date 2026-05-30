import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Modal } from "react-native";
import {
  ModalBackdrop,
  ModalCloseButton,
  SuggestionCheck,
  SuggestionOption,
  SuggestionsActions,
  SuggestionsButtonText,
  SuggestionsEmptyText,
  SuggestionsHeader,
  SuggestionsLoading,
  SuggestionsPanel,
  SuggestionsPrimaryButton,
  SuggestionsSecondaryButton,
  SuggestionsSubtitle,
  SuggestionsTitle,
  SuggestionText,
} from "../styles";

type Props = {
  visible: boolean;
  loading: boolean;
  suggestions: string[];
  selectedSuggestions: string[];
  onToggleSuggestion: (suggestion: string) => void;
  onAddSelected: () => void;
  onClose: () => void;
};

export function AiSuggestionsModal({
  visible,
  loading,
  suggestions,
  selectedSuggestions,
  onToggleSuggestion,
  onAddSelected,
  onClose,
}: Props) {
  const hasSelection = selectedSuggestions.length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <ModalBackdrop>
        <SuggestionsPanel>
          <SuggestionsHeader>
            <SuggestionsTitle>Itens sugeridos</SuggestionsTitle>
            <ModalCloseButton onPress={onClose}>
              <Ionicons name="close" size={18} color="#FFF" />
            </ModalCloseButton>
          </SuggestionsHeader>

          <SuggestionsSubtitle>
            Revise as sugestões antes de adicionar à lista.
          </SuggestionsSubtitle>

          {loading ? (
            <SuggestionsLoading>
              <ActivityIndicator />
            </SuggestionsLoading>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => {
              const selected = selectedSuggestions.includes(suggestion);

              return (
                <SuggestionOption
                  key={suggestion}
                  selected={selected}
                  onPress={() => onToggleSuggestion(suggestion)}
                >
                  <SuggestionCheck selected={selected}>
                    {selected ? (
                      <Ionicons name="checkmark" size={14} color="#FFF" />
                    ) : null}
                  </SuggestionCheck>

                  <SuggestionText>{suggestion}</SuggestionText>
                </SuggestionOption>
              );
            })
          ) : (
            <SuggestionsEmptyText>
              Nenhuma sugestão nova foi retornada para esta lista.
            </SuggestionsEmptyText>
          )}

          <SuggestionsActions>
            <SuggestionsSecondaryButton onPress={onClose}>
              <SuggestionsButtonText>Cancelar</SuggestionsButtonText>
            </SuggestionsSecondaryButton>

            <SuggestionsPrimaryButton
              disabled={!hasSelection}
              onPress={hasSelection ? onAddSelected : undefined}
            >
              <SuggestionsButtonText>Adicionar</SuggestionsButtonText>
            </SuggestionsPrimaryButton>
          </SuggestionsActions>
        </SuggestionsPanel>
      </ModalBackdrop>
    </Modal>
  );
}

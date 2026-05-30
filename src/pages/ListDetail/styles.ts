import { TextInput } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
`;

export const HeaderArea = styled.View`
  padding: 0 0 10px;
`;

export const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BackButton = styled.Pressable`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
`;

export const BackText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 15px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  gap: 8px;
`;

export const ActionButton = styled.Pressable`
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
  padding: 8px 12px;
  border-radius: 999px;
`;

export const ActionButtonText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 12px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const HeaderDetails = styled.View`
  padding: 0 20px;
`;

export const MetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
`;

export const Badge = styled.View<{ shared?: boolean }>`
  padding: 4px 8px;
  border-radius: 999px;
  background-color: ${({ theme, shared }) =>
    shared ? theme.COLORS.PURPLE_DARK : theme.COLORS.BLUE_DARK};
`;

export const BadgeText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 10px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const ListMeta = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 12px;
  line-height: 17px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const ProgressBar = styled.View`
  margin-top: 10px;
  height: 6px;
  width: 100%;
  border-radius: 999px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.COLORS.GRAY_500};
`;

export const ProgressFill = styled.View<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => `${Math.max(0, Math.min(progress, 1)) * 100}%`};
  background-color: ${({ theme }) => theme.COLORS.BLUE};
  border-radius: 999px;
`;

export const ProgressMeta = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-top: 7px;
`;

export const ProgressText = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 12px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const Content = styled.View`
  flex: 1;
  padding: 0 20px;
`;

export const FormCard = styled.View`
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
  border-radius: 14px;
  padding: 4px 4px 4px 12px;
  margin-bottom: 10px;
`;

export const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const StyledInput = styled(TextInput)`
  flex: 1;
  color: ${({ theme }) => theme.COLORS.WHITE};
  min-height: 42px;
  font-size: 14px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const AddItemButton = styled.Pressable`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.COLORS.BLUE_DARK};
  align-items: center;
  justify-content: center;
`;

export const SuggestionButton = styled.Pressable`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  margin-top: 6px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_500};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_400};
`;

export const SuggestionButtonText = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_100};
  font-size: 12px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const Fab = styled.Pressable`
  position: absolute;
  right: 20px;
  bottom: 28px;
  width: 50px;
  height: 50px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.COLORS.BLUE_DARK};
  align-items: center;
  justify-content: center;
`;

export const FabText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 30px;
  line-height: 32px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const LoadingWrap = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const EmptyWrap = styled.View`
  flex: 1;
  justify-content: center;
`;

export const ModalBackdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.72);
  justify-content: flex-end;
`;

export const SuggestionsPanel = styled.View`
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
  padding: 18px 20px 22px;
`;

export const SuggestionsHeader = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
`;

export const SuggestionsTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 16px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const SuggestionsSubtitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 12px;
  line-height: 17px;
  margin-top: 3px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const ModalCloseButton = styled.Pressable`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLORS.GRAY_500};
`;

export const SuggestionsLoading = styled.View`
  padding: 22px 0;
  align-items: center;
  justify-content: center;
`;

export const SuggestionOption = styled.Pressable<{ selected: boolean }>`
  min-height: 46px;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 12px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.COLORS.BLUE_DARK : theme.COLORS.GRAY_500};
  border: 1px solid
    ${({ theme, selected }) =>
      selected ? theme.COLORS.BLUE : theme.COLORS.GRAY_400};
`;

export const SuggestionCheck = styled.View<{ selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  border: 1px solid
    ${({ theme, selected }) =>
      selected ? theme.COLORS.BLUE : theme.COLORS.GRAY_300};
`;

export const SuggestionText = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 14px;
  line-height: 19px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const SuggestionsEmptyText = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 13px;
  line-height: 18px;
  padding: 16px 0;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const SuggestionsActions = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 12px;
`;

export const SuggestionsSecondaryButton = styled.Pressable`
  flex: 1;
  min-height: 44px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLORS.GRAY_500};
`;

export const SuggestionsPrimaryButton = styled.Pressable<{ disabled?: boolean }>`
  flex: 1.4;
  min-height: 44px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.COLORS.GRAY_400 : theme.COLORS.BLUE_DARK};
`;

export const SuggestionsButtonText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 13px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

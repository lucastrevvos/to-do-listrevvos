import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
`;

export const HeaderArea = styled.View`
  padding: 24px 20px 16px;
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

export const ListTitle = styled.Text`
  margin-top: 12px;
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 28px;
  line-height: 32px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const Badge = styled.View<{ shared?: boolean }>`
  margin-top: 8px;
  align-self: flex-start;
  padding: 6px 10px;
  border-radius: 999px;
  background-color: ${({ theme, shared }) =>
    shared ? theme.COLORS.PURPLE_DARK : theme.COLORS.BLUE_DARK};
`;

export const BadgeText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 11px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const ListMeta = styled.Text`
  margin-top: 10px;
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 14px;
  line-height: 20px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const ProgressBar = styled.View`
  margin-top: 16px;
  height: 10px;
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
  gap: 6px;
  margin-top: 10px;
`;

export const ProgressNumber = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 20px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const ProgressText = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 13px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const QuickStatsRow = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 16px;
`;

export const QuickStat = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
  border-radius: 16px;
  padding: 12px;
`;

export const QuickStatValue = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 18px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const QuickStatLabel = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 12px;
  margin-top: 4px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const Content = styled.View`
  flex: 1;
  padding: 0 20px;
`;

export const FormCard = styled.View`
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
  border-radius: 18px;
  padding: 12px;
  margin-bottom: 14px;
`;

export const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const StyledInput = styled.TextInput`
  flex: 1;
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 15px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const Fab = styled.Pressable`
  position: absolute;
  right: 20px;
  bottom: 28px;
  width: 58px;
  height: 58px;
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

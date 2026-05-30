import styled from "styled-components/native";

export const SectionActionText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 12px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
`;

export const LoadingWrap = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

export const SectionTitleWrap = styled.View`
  flex: 1;
  min-width: 0;
`;

export const SummaryText = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_300};
  font-size: 12px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  margin-top: 2px;
`;

export const ListsContainer = styled.View`
  flex: 1;
  padding: 12px 20px 0;
`;

export const SectionTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 18px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const SharedActionButton = styled.Pressable`
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
`;

export const SharedActionContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const CardTouchable = styled.Pressable`
  min-height: 96px;
`;

export const Card = styled.View<{ accent?: "shopping" | "task" | "routine" }>`
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid
    ${({ theme, accent }) => {
      if (accent === "shopping") return theme.COLORS.BLUE_DARK;
      if (accent === "routine") return theme.COLORS.PURPLE_DARK;
      return theme.COLORS.GRAY_500;
    }};
  border-radius: 14px;
  padding: 12px;
  gap: 8px;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`;

export const CardMain = styled.View`
  flex: 1;
  min-width: 0;
`;

export const CardTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 16px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const CardSubtitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 12px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
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

export const CardProgressBar = styled.View`
  width: 100%;
  height: 6px;
  border-radius: 999px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.COLORS.GRAY_500};
`;

export const CardProgressFill = styled.View<{
  progress: number;
  accent?: "shopping" | "task" | "routine";
}>`
  height: 100%;
  width: ${({ progress }) => `${Math.max(0, Math.min(progress, 1)) * 100}%`};
  background-color: ${({ theme, accent }) => {
    if (accent === "shopping") return theme.COLORS.BLUE;
    if (accent === "routine") return theme.COLORS.PURPLE;
    return theme.COLORS.GRAY_300;
  }};
  border-radius: 999px;
`;

export const CardFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const MenuButton = styled.Pressable`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  margin-top: -4px;
  margin-right: -4px;
`;

export const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
`;

export const EmptyLogo = styled.Image`
  width: 54px;
  height: 54px;
  border-radius: 14px;
  margin-bottom: 14px;
`;

export const EmptyTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 16px;
  text-align: center;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const EmptyDescription = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_300};
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  margin-top: 6px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const Fab = styled.Pressable`
  position: absolute;
  right: 20px;
  bottom: 24px;
  width: 58px;
  height: 58px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLORS.BLUE_DARK};
`;

export const FabText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 30px;
  line-height: 32px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

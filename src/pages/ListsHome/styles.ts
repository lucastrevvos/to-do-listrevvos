import styled from "styled-components/native";

export const SectionActionText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 13px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
`;

export const HeaderBlock = styled.View`
  padding: 4px 20px 12px;
`;

export const HeroCard = styled.View`
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
  border-radius: 20px;
  padding: 18px;
`;

export const HeroLabel = styled.Text`
  color: ${({ theme }) => theme.COLORS.BLUE};
  font-size: 12px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 6px;
`;

export const HeroText = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_100};
  font-size: 14px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  line-height: 20px;
`;

export const HeroRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 16px;
`;

export const HeroNumber = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 22px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const ListsContainer = styled.View`
  flex: 1;
  padding: 16px 20px 0;
`;

export const SectionTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 20px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 14px;
`;

export const Card = styled.View<{ accent?: "shopping" | "task" | "routine" }>`
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid
    ${({ theme, accent }) => {
      if (accent === "shopping") return theme.COLORS.BLUE_DARK;
      if (accent === "routine") return theme.COLORS.PURPLE_DARK;
      return theme.COLORS.GRAY_500;
    }};
  border-radius: 18px;
  padding: 16px;
  gap: 12px;
`;

export const CardTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 16px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const CardSubtitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 13px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const Badge = styled.View<{ shared?: boolean }>`
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

export const CardProgressBar = styled.View`
  width: 100%;
  height: 8px;
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

export const EmptyText = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_300};
  font-size: 14px;
  text-align: center;
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

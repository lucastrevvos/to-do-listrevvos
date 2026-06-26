import styled from "styled-components/native";

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: 120,
  },
})`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
  padding: 0 20px;
`;

export const HeroCard = styled.View`
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
  border-radius: 18px;
  padding: 18px;
  margin-top: 6px;
  margin-bottom: 16px;
`;

export const HeroMark = styled.Image`
  position: absolute;
  right: 12px;
  top: 12px;
  width: 72px;
  height: 72px;
  opacity: 0.16;
`;

export const Badge = styled.View`
  align-self: flex-start;
  background-color: rgba(49, 216, 199, 0.12);
  border: 1px solid rgba(49, 216, 199, 0.36);
  padding: 6px 10px;
  border-radius: 999px;
  margin-bottom: 12px;
`;

export const BadgeText = styled.Text`
  color: ${({ theme }) => theme.COLORS.BLUE};
  font-size: 11px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const HeroTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 22px;
  line-height: 28px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 8px;
  padding-right: 52px;
`;

export const HeroText = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_100};
  font-size: 14px;
  line-height: 20px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const SectionTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 16px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 10px;
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const StatusBadge = styled.View<{ available: boolean }>`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  gap: 6px;
  background-color: ${({ available }) =>
    available ? "#31D8C7" : "rgba(255, 255, 255, 0.08)"};
  border: 1px solid
    ${({ available }) => (available ? "#31D8C7" : "rgba(255, 255, 255, 0.16)")};
  padding: 6px 10px;
  border-radius: 999px;
  margin-bottom: 12px;
`;

export const StatusText = styled.Text<{ available: boolean }>`
  color: ${({ available, theme }) =>
    available ? "#06201B" : theme.COLORS.GRAY_100};
  font-size: 12px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const CardTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 17px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 8px;
`;

export const CardDescription = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 14px;
  line-height: 20px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  margin-bottom: 10px;
`;

export const ExamplesGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 2px;
  margin-bottom: 14px;
`;

export const ExampleChip = styled.View`
  background-color: rgba(49, 216, 199, 0.1);
  border: 1px solid rgba(49, 216, 199, 0.28);
  border-radius: 999px;
  padding: 7px 10px;
`;

export const ExampleText = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_100};
  font-size: 12px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const PrimaryButton = styled.Pressable`
  min-height: 44px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.COLORS.BLUE};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 14px;
`;

export const PrimaryButtonText = styled.Text`
  color: #061b20;
  font-size: 14px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const RoadmapItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
`;

export const RoadmapText = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.COLORS.GRAY_100};
  font-size: 14px;
  line-height: 19px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const FooterText = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_300};
  font-size: 12px;
  text-align: center;
  margin-top: 2px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

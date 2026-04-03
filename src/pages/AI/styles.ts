import styled from "styled-components/native";

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: 120,
  },
})`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
  padding: 24px 20px 0;
`;

export const HeroCard = styled.View`
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
  border-radius: 22px;
  padding: 18px;
  margin-bottom: 20px;
`;

export const Badge = styled.View`
  align-self: flex-start;
  background-color: ${({ theme }) => theme.COLORS.PURPLE_DARK};
  padding: 6px 10px;
  border-radius: 999px;
  margin-bottom: 12px;
`;

export const BadgeText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 11px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const HeroLabel = styled.Text`
  color: ${({ theme }) => theme.COLORS.BLUE};
  font-size: 12px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 6px;
`;

export const HeroTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 24px;
  line-height: 30px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 10px;
`;

export const HeroText = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_100};
  font-size: 14px;
  line-height: 20px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const SectionTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 20px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 12px;
`;

export const FeatureCard = styled.View`
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 12px;
`;

export const FeatureTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 16px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 8px;
`;

export const FeatureDescription = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 14px;
  line-height: 20px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const PremiumCard = styled.View`
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.PURPLE_DARK};
  border-radius: 20px;
  padding: 18px;
  margin-bottom: 14px;
`;

export const PremiumTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 17px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 8px;
`;

export const PremiumDescription = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_100};
  font-size: 14px;
  line-height: 20px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 14px;
`;

export const CardTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 16px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 8px;
`;

export const CardDescription = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 14px;
  line-height: 20px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const FooterText = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_300};
  font-size: 12px;
  text-align: center;
  margin-top: 4px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;
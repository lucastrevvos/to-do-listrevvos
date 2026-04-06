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

export const HeroBadge = styled.View`
  align-self: flex-start;
  background-color: ${({ theme }) => theme.COLORS.BLUE_DARK};
  padding: 6px 10px;
  border-radius: 999px;
  margin-bottom: 12px;
`;

export const HeroBadgeText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 11px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const HeroTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 24px;
  line-height: 30px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 10px;
`;

export const HeroDescription = styled.Text`
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

export const ItemRow = styled.View`
  margin-bottom: 14px;
`;

export const ItemTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 15px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 4px;
`;

export const ItemDescription = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 13px;
  line-height: 19px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const AppVersion = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_300};
  font-size: 12px;
  text-align: center;
  margin-top: 2px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

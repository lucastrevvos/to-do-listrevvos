import styled from "styled-components/native";

export const Container = styled.View`
  padding: 0 20px 10px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
`;

export const TopRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const LeftColumn = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
  min-width: 0;
  padding-right: 12px;
`;

export const TextColumn = styled.View`
  flex: 1;
  min-width: 0;
`;

export const BackButton = styled.Pressable`
  width: 38px;
  height: 38px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 24px;
  line-height: 28px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const Subtitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_200};
  font-size: 13px;
  line-height: 18px;
  margin-top: 4px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const ActionWrap = styled.View`
  flex-shrink: 0;
  align-self: flex-start;
  margin-left: 4px;
`;

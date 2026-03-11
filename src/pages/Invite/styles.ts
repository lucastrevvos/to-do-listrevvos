import { Pressable, Text, View } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding: 24px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  border-radius: 16px;
  padding: 18px;
  gap: 10px;
`;

export const Title = styled(Text)`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 20px;
  font-weight: 700;
`;

export const Sub = styled(Text)`
  color: ${({ theme }) => theme.COLORS.GRAY_300};
  font-size: 14px;
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BtnPrimary = styled(Pressable)`
  margin-top: 10px;
  padding: 14px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLORS.BLUE_DARK};
`;

export const BtnText = styled(Text)`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 14px;
  font-weight: 700;
`;

export const Pill = styled(View)<{ tone: "ok" | "danger" }>`
  align-self: flex-start;
  padding: 6px 10px;
  border-radius: 999px;
  background-color: ${({ tone }) => (tone === "danger" ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)")};
`;

export const PillText = styled(Text)`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 12px;
  font-weight: 700;
`;
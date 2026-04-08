import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ActionWrap,
  BackButton,
  Container,
  LeftColumn,
  Subtitle,
  TextColumn,
  Title,
  TopRow,
} from "./styles";

type Props = {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
};

export function AppHeader({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightAction,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Container style={{ paddingTop: insets.top + 10 }}>
      <TopRow>
        <LeftColumn>
          {showBackButton ? (
            <BackButton onPress={onBackPress}>
              <Ionicons name="chevron-back" size={22} color="#FFF" />
            </BackButton>
          ) : null}

          <TextColumn>
            <Title numberOfLines={1}>{title}</Title>
            {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
          </TextColumn>
        </LeftColumn>

        {rightAction ? <ActionWrap>{rightAction}</ActionWrap> : null}
      </TopRow>
    </Container>
  );
}

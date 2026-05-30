import { Ionicons } from "@expo/vector-icons";
import React from "react";
import type { ImageSourcePropType } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ActionWrap,
  BackButton,
  Container,
  LeftColumn,
  Logo,
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
  logoSource?: ImageSourcePropType;
};

export function AppHeader({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightAction,
  logoSource,
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

          {logoSource ? (
            <Logo
              source={logoSource}
              accessible={false}
              accessibilityIgnoresInvertColors
            />
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

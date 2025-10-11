// app/_layout.tsx
import "react-native-gesture-handler";
import "react-native-reanimated";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "styled-components/native";

import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";

import { setupChannelsAndCategories } from "@/src/services/notifications";
import theme from "@/src/theme";

// ————————————————————————————————
// Handler global de notificações (mostrar alerta na foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    // configura canais (Android) e categorias (botões)
    setupChannelsAndCategories().catch(() => {});

    // abrir deep link quando o usuário toca numa ação/notificação
    const sub = Notifications.addNotificationResponseReceivedListener(
      (resp) => {
        const url = resp.notification.request.content.data?.url as
          | string
          | undefined;
        if (url) Linking.openURL(url);
      }
    );
    return () => sub.remove();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <StatusBar style="light" backgroundColor={theme.COLORS.GRAY_700} />

      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* evita qualquer frame branco atrás do stack */}
        <View style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_700 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.COLORS.GRAY_700 },
              animation: "fade",
            }}
          />
        </View>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

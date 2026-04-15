import "react-native-reanimated";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "styled-components/native";

import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";

import {
  ensurePermissionsSoft,
  maybeInactivityNudge,
  recordAppOpen,
  scheduleOnboardingNudgeIfNeeded,
  setupChannelsAndCategories,
} from "@/src/services/notifications";
import theme from "@/src/theme";

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
    async function bootstrapNotifications() {
      try {
        await setupChannelsAndCategories();

        const granted = await ensurePermissionsSoft();

        if (granted) {
          await maybeInactivityNudge();
          await scheduleOnboardingNudgeIfNeeded();
        }

        await recordAppOpen();
      } catch (error) {
        console.log("[noti] bootstrap error:", error);
      }
    }

    bootstrapNotifications();

    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = response.notification.request.content.data?.url;

        if (typeof url === "string" && url.length > 0) {
          Linking.openURL(url).catch((error) => {
            console.log("[noti] openURL error:", error);
          });
        }
      },
    );

    return () => {
      sub.remove();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <StatusBar style="light" backgroundColor={theme.COLORS.GRAY_700} />

      <GestureHandlerRootView style={{ flex: 1 }}>
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

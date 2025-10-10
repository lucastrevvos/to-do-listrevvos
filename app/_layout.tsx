import "react-native-gesture-handler";
import "react-native-reanimated";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ThemeProvider } from "styled-components/native";

import theme from "@/src/theme"; // ajuste o caminho se for diferente
import { View } from "react-native";

export default function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_700 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.COLORS.GRAY_700 },
            animation: "fade", // opcional: menos “flash”
          }}
        />
      </View>
    </ThemeProvider>
  );
}

import theme from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.COLORS.BLUE,
        tabBarInactiveTintColor: theme.COLORS.GRAY_300,
        tabBarStyle: {
          backgroundColor: theme.COLORS.GRAY_600,
          borderTopColor: theme.COLORS.GRAY_500,
          height: 64 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 10),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: theme.FONT_FAMILY.BOLD,
        },
        sceneStyle: {
          backgroundColor: theme.COLORS.GRAY_700,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Listas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="ai"
        options={{
          title: "IA",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
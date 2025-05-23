import theme from "@/src/theme";
import { Stack } from "expo-router";
import { ThemeProvider } from "styled-components/native";

export default function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <Stack />
    </ThemeProvider>
  );
}

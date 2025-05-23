import { Home } from "@/src/pages/Home";
import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

export default function Index() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });

  return fontsLoaded ? <Home /> : null;
}

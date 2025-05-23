import { Checkbox } from "@/src/components/Checkbox";
import { useState } from "react";
import { Text, View } from "react-native";

export function Home() {
  const [checked, setChecked] = useState(false);

  return (
    <View>
      <Text>Home</Text>
      <Checkbox checked={checked} onPress={() => setChecked(!checked)} />
    </View>
  );
}

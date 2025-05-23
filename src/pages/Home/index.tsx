import { Checkbox } from "@/src/components/Checkbox";
import { Header } from "@/src/components/Header";
import { useState } from "react";
import { Container } from "./styles";

export function Home() {
  const [checked, setChecked] = useState(false);

  return (
    <Container>
      <Header />
      <Checkbox checked={checked} onPress={() => setChecked(!checked)} />
    </Container>
  );
}

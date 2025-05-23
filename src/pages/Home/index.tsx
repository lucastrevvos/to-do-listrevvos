import { ButtonIcon } from "@/src/components/ButtonIcon";
import { Header } from "@/src/components/Header";
import { Input } from "@/src/components/Input";
import { useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "styled-components/native";
import { Container, Content, Form } from "./styles";

export function Home() {
  const { COLORS } = useTheme();
  const [checked, setChecked] = useState(false);

  return (
    <>
      <Container>
        <Header />
        <Form>
          <Input
            placeholder="Adicione uma nova tarefa"
            placeholderTextColor={COLORS.GRAY_300}
          />
          <ButtonIcon icon="add-circle-outline" />
        </Form>
        <Content>
          <View>
            <Text>teste</Text>
          </View>
        </Content>
      </Container>
    </>
  );
}

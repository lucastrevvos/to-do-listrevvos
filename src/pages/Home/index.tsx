import { ButtonIcon } from "@/src/components/ButtonIcon";
import { Header } from "@/src/components/Header";
import { Input } from "@/src/components/Input";
import { TaskStatus } from "@/src/components/TaskStatus";
import { useState } from "react";
import { useTheme } from "styled-components/native";
import { Container, Content, Form } from "./styles";

export function Home() {
  const { COLORS } = useTheme();
  const [checked, setChecked] = useState(false);
  const [createdCount, setCreatedCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

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
          <TaskStatus
            createdCount={createdCount}
            completedCount={completedCount}
          ></TaskStatus>
        </Content>
      </Container>
    </>
  );
}

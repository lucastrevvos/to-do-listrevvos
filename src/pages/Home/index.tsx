import { ButtonIcon } from "@/src/components/ButtonIcon";
import { Header } from "@/src/components/Header";
import { Input } from "@/src/components/Input";
import { ListEmpty } from "@/src/components/ListEmpty";
import { Tasks } from "@/src/components/Tasks";
import { TaskStatus } from "@/src/components/TaskStatus";
import { useState } from "react";
import { FlatList } from "react-native";
import { useTheme } from "styled-components/native";
import { Container, Content, Form } from "./styles";

export function Home() {
  const { COLORS } = useTheme();

  const [createdCount, setCreatedCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [tasks, setTasks] = useState([
    "Fazer comida",
    "Lavar louça",
    "Terminar o app do todo",
    "Limpar a casa",
    "Fazer alguam coisa grande pra ter significad na vida, Fazer alguam coisa grande pra ter significad na vida",
    "Achar o amor verdadeiro",
  ]);

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
          <FlatList
            data={tasks}
            keyExtractor={(item) => item}
            renderItem={({ item }) => <Tasks task={item} />}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <ListEmpty
                title="Você ainda não tem tarefas cadastradas"
                text="Crie tarefas e organize seus itens a fazer"
              />
            )}
          />
        </Content>
      </Container>
    </>
  );
}

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
    { id: "1", title: "Fazer comida", completed: false },
    { id: "2", title: "Lavar louça", completed: false },
    { id: "3", title: "Terminar o app do todo", completed: false },
    { id: "4", title: "Limpar a casa", completed: false },
    { id: "5", title: "Fazer algo com significado na vida", completed: false },
    { id: "6", title: "Achar o amor verdadeiro", completed: false },
  ]);

  function handleToggleTask(id: string) {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    const reordered = [
      ...updated.filter((t) => !t.completed),
      ...updated.filter((t) => t.completed),
    ];

    return setTasks(reordered);
  }

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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Tasks task={item} onToggle={() => handleToggleTask(item.id)} />
            )}
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

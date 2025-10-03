import { ButtonIcon } from "@/src/components/ButtonIcon";
import { Header } from "@/src/components/Header";
import { Input } from "@/src/components/Input";
import { ListEmpty } from "@/src/components/ListEmpty";
import { Tasks } from "@/src/components/Tasks";
import { TaskStatus } from "@/src/components/TaskStatus";
import { loadTasks, removeTaskById, saveTasks } from "@/src/storage/tasks";
import { Task } from "@/src/types/task";
import { AppError } from "@/src/utils/AppError";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Keyboard } from "react-native";
import { useTheme } from "styled-components/native";
import { Container, Content, Form } from "./styles";

import { DEFAULT_GROUP_ID } from "@/src/constants/app";
import { migrateIfNeeded } from "@/src/storage/migrations";

export function Home() {
  const { COLORS } = useTheme();
  const [newTask, setNewTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isReady, setIsReady] = useState(false);

  const createdCount = useMemo(() => tasks.length, [tasks]);
  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  function handleToggleTask(id: string) {
    const updated = (tasks ?? []).map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    const reordered = [
      ...updated.filter((t) => !t.completed),
      ...updated.filter((t) => t.completed),
    ];
    setTasks(reordered);
    saveTasks(reordered);
  }

  async function handleAddTask() {
    try {
      const title = (newTask || "").trim();
      if (!title) throw new AppError("Você precisa escrever uma tarefa.");

      const exists = tasks.some((t) => t.title === title);
      if (exists) throw new AppError("Essa tarefa já existe");

      const newTaskObj: Task = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        title,
        completed: false,
        groupId: DEFAULT_GROUP_ID,
        createdAt: Date.now(),
      };

      const updated = [newTaskObj, ...tasks];
      Keyboard.dismiss();
      setTasks(updated);
      setNewTask("");
      await saveTasks(updated);
    } catch (err) {
      if (err instanceof AppError) {
        Alert.alert("Nova Task", err.message);
      } else {
        console.log(err);
        Alert.alert("Nova Task", "Não foi possível criar uma nova tarefa");
      }
    }
  }

  async function handleRemoveTask(id: string) {
    try {
      if (!tasks.some((t) => t.id === id)) {
        throw new AppError("Tarefa não encontrada");
      }
      const updated = tasks.filter((t) => t.id !== id);
      setTasks(updated);
      await removeTaskById(id);
    } catch (err) {
      if (err instanceof AppError) {
        Alert.alert("Remover Tarefa", err.message);
      } else {
        console.log(err);
        Alert.alert("Remover Tarefa", "Não foi possível remover a tarefa");
      }
    }
  }

  async function fetchTasks() {
    try {
      const stored = await loadTasks();
      setTasks(Array.isArray(stored) ? stored : []);
    } catch (err) {
      console.log(err);
      Alert.alert("Exibir Tasks", "Erro ao carregar tasks do AsyncStorage");
    } finally {
      setIsReady(true);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await migrateIfNeeded();
        await fetchTasks();
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  // Loading simples (sem form duplicado)
  if (!isReady) {
    return (
      <Container>
        <Header />
        <Content style={{ alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="small" color={COLORS.GRAY_300} />
        </Content>
      </Container>
    );
  }

  // Tela principal
  return (
    <Container>
      <Header />

      <Form>
        <Input
          placeholder="Adicione uma nova tarefa"
          placeholderTextColor={COLORS.GRAY_300}
          onChangeText={setNewTask}
          value={newTask}
          onSubmitEditing={handleAddTask}
          returnKeyType="done"
        />
        <ButtonIcon icon="add-circle-outline" onPress={handleAddTask} />
      </Form>

      <Content>
        <TaskStatus
          createdCount={createdCount}
          completedCount={completedCount}
        />

        <FlatList
          data={tasks ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Tasks
              task={item}
              onRemove={() => handleRemoveTask(item.id)}
              onToggle={() => handleToggleTask(item.id)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
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
  );
}

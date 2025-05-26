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
import { Alert, FlatList, Keyboard } from "react-native";
import { useTheme } from "styled-components/native";
import { Container, Content, Form } from "./styles";

export function Home() {
  const { COLORS } = useTheme();
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const createdCount = useMemo(() => tasks.length, [tasks]);
  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  function handleToggleTask(id: string) {
    const updated = tasks.map((task) =>
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
      const title = newTask.trim();

      if (!title) {
        throw new AppError("Você precisa escrever uma tarefa.");
      }

      const taskAlreadyExists = tasks.some((task) => task.title === title);

      if (taskAlreadyExists) {
        throw new AppError("Essa tarefa já existe");
      }

      const newTaskObj: Task = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        title,
        completed: false,
      };

      const updatedTasks = [newTaskObj, ...tasks];

      Keyboard.dismiss();

      setTasks(updatedTasks);
      setNewTask("");

      await saveTasks(updatedTasks);
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert("Nova Task", error.message);
      } else {
        console.log(error);
        Alert.alert("Nova Task", "Não foi possível criar uma nova tarefa");
      }
    }
  }

  async function fetchTasks() {
    try {
      const stored = await loadTasks();
      setTasks(stored);
    } catch (error) {
      console.log(error);
      Alert.alert("Exibir Tasks", "Erro ao carregar tasks do AsyncStorage");
    }
  }

  async function handleRemoveTask(id: string) {
    try {
      if (!tasks.some((task) => task.id === id)) {
        throw new AppError("Tarefa não encontrada");
      }

      const updated = tasks.filter((task) => task.id !== id);

      setTasks(updated);

      removeTaskById(id);
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert("Remover Tarefa", error.message);
      } else {
        console.log(error);
        Alert.alert("Remover Tarefa", "Não foi possível remove a tarefa");
      }
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
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
          ></TaskStatus>
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Tasks
                task={item}
                onRemove={() => handleRemoveTask(item.id)}
                onToggle={() => handleToggleTask(item.id)}
              />
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

// src/pages/Home/index.tsx (ou src/screens/Home/index.tsx)
import { ButtonIcon } from "@/src/components/ButtonIcon";
import { GroupCreateModal } from "@/src/components/GroupCreateModal";
import { GroupPicker } from "@/src/components/GroupPicker";
import { Header } from "@/src/components/Header";
import { Input } from "@/src/components/Input";
import { ListEmpty } from "@/src/components/ListEmpty";
import { Tasks } from "@/src/components/Tasks";
import { TaskStatus } from "@/src/components/TaskStatus";

import { DEFAULT_GROUP_ID } from "@/src/constants/app";
import { addGroup, ensureDefaultGroup } from "@/src/storage/groups";
import { migrateIfNeeded } from "@/src/storage/migrations";
import { loadTasks, removeTaskById, saveTasks } from "@/src/storage/tasks";

import type { Group } from "@/src/types/group";
import type { Task } from "@/src/types/task";
import { AppError } from "@/src/utils/AppError";

import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Keyboard } from "react-native";
import { useTheme } from "styled-components/native";
import { Container, Content, Form } from "./styles";

import { Pressable, ScrollView, Text, View } from "react-native";

function GroupBar({
  groups,
  selectedId,
  onSelect,
  onAdd,
}: {
  groups: Group[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd?: () => void;
}) {
  return (
    <View
      style={{ paddingVertical: 8, backgroundColor: "rgba(255,255,255,0.05)" }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, alignItems: "center" }}
      >
        {groups.map((g) => (
          <Pressable
            key={g.id}
            onPress={() => onSelect(g.id)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              marginRight: 8,
              backgroundColor: g.id === selectedId ? "#444" : "#333",
              borderWidth: 1,
              borderColor: "#666",
            }}
          >
            <Text style={{ color: "#fff" }}>{g.title}</Text>
          </Pressable>
        ))}

        {onAdd && (
          <Pressable
            onPress={onAdd}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: "#333",
              borderWidth: 1,
              borderColor: "#666",
            }}
          >
            <Text style={{ color: "#fff" }}>+ Novo</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

export function Home() {
  const { COLORS } = useTheme();

  const [newTask, setNewTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] =
    useState<string>(DEFAULT_GROUP_ID);
  const [isReady, setIsReady] = useState(false);

  // modal de novo grupo
  const [showNewGroup, setShowNewGroup] = useState(false);

  const filteredTasks = useMemo(
    () => tasks.filter((t) => t.groupId === selectedGroupId),
    [tasks, selectedGroupId]
  );

  const createdCount = filteredTasks.length;
  const completedCount = useMemo(
    () => filteredTasks.filter((task) => task.completed).length,
    [filteredTasks]
  );

  function handleToggleTask(id: string) {
    const updated = (tasks ?? []).map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    // reordena dentro do grupo selecionado
    const sameGroup = updated.filter((t) => t.groupId === selectedGroupId);
    const others = updated.filter((t) => t.groupId !== selectedGroupId);

    const reorderedSameGroup = [
      ...sameGroup.filter((t) => !t.completed),
      ...sameGroup.filter((t) => t.completed),
    ];

    const next = [...reorderedSameGroup, ...others];
    setTasks(next);
    saveTasks(next);
  }

  async function handleAddTask() {
    try {
      const title = (newTask || "").trim();
      if (!title) throw new AppError("Você precisa escrever uma tarefa.");

      const taskAlreadyExists = filteredTasks.some((t) => t.title === title);
      if (taskAlreadyExists) throw new AppError("Essa tarefa já existe");

      const newTaskObj: Task = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        title,
        completed: false,
        groupId: selectedGroupId,
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

  async function bootstrap() {
    try {
      await migrateIfNeeded();
      // garante grupo "Geral"
      const gs = await ensureDefaultGroup();
      const ts = await loadTasks();

      setGroups(gs);
      setTasks(ts);

      const hasDefault = gs.find((g) => g.id === DEFAULT_GROUP_ID);
      setSelectedGroupId(
        hasDefault ? DEFAULT_GROUP_ID : gs[0]?.id ?? DEFAULT_GROUP_ID
      );
    } finally {
      setIsReady(true);
    }
  }

  useEffect(() => {
    bootstrap();
  }, []);

  // abrir modal
  function openCreateGroup() {
    setShowNewGroup(true);
  }

  // confirmar criação via modal
  async function onConfirmCreateGroup(title: string) {
    try {
      const g = await addGroup(title);
      const next = [g, ...groups];
      setGroups(next);
      setSelectedGroupId(g.id);
      setShowNewGroup(false);
    } catch (e: any) {
      Alert.alert("Novo grupo", e?.message ?? "Não foi possível criar o grupo");
    }
  }

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

  return (
    <Container>
      <Header />

      <GroupPicker
        groups={groups}
        selectedId={selectedGroupId}
        onSelect={setSelectedGroupId}
        onAdd={openCreateGroup}
      />

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
          data={filteredTasks}
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
              title="Sem tarefas nesse grupo"
              text="Crie tarefas e organize seus itens aqui"
            />
          )}
        />
      </Content>

      {/* Modal de criação de grupo */}
      <GroupCreateModal
        visible={showNewGroup}
        onClose={() => setShowNewGroup(false)}
        onConfirm={onConfirmCreateGroup}
      />
    </Container>
  );
}

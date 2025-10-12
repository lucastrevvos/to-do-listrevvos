// src/pages/Home/index.tsx
import { ButtonIcon } from "@/src/components/ButtonIcon";
import { GroupCreateModal } from "@/src/components/GroupCreateModal";
import { GroupPicker } from "@/src/components/GroupPicker";
import { Header } from "@/src/components/Header";
import { Input } from "@/src/components/Input";
import { ListEmpty } from "@/src/components/ListEmpty";
import { Tasks } from "@/src/components/Tasks";
import { TaskStatus } from "@/src/components/TaskStatus";

import { DEFAULT_GROUP_ID } from "@/src/constants/app";
import {
  addGroup,
  deleteGroupAndMoveTasks,
  ensureDefaultGroup,
} from "@/src/storage/groups";
import { migrateIfNeeded } from "@/src/storage/migrations";
import { loadTasks, removeTaskById, saveTasks } from "@/src/storage/tasks";

import type { Group } from "@/src/types/group";
import type { Task } from "@/src/types/task";
import { AppError } from "@/src/utils/AppError";

import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  FlatList,
  Keyboard,
} from "react-native";
import { useTheme } from "styled-components/native";
import { Container, Content, Form } from "./styles";

// ==== Notificações (ajustado para não notificar ao criar) ====
import { HintBanner } from "@/src/components/HintBanner";
import {
  ensurePermissionsSoft,
  // NOVOS usos:
  markInteraction,
  maybeInactivityNudge,
  maybeScheduleOnBackground,
  recordAppOpen,
  scheduleOnboardingNudgeIfNeeded,
  scheduleWeeklyDigest,
} from "@/src/services/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UI_KEYS = {
  hideDeleteGroupHint: "@trevvos/ui:hideDeleteGroupHint",
} as const;

export function Home() {
  const { COLORS } = useTheme();

  const [newTask, setNewTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] =
    useState<string>(DEFAULT_GROUP_ID);
  const [isReady, setIsReady] = useState(false);

  const [showDeleteHint, setShowDeleteHint] = useState(false);

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

  function totalPending(all: Task[]) {
    return all.filter((t) => !t.completed).length;
  }

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

    // marcou interação (sem agendar push agora)
    markInteraction();
  }

  function confirmDeleteGroup(group: Group) {
    if (group.id === DEFAULT_GROUP_ID) {
      Alert.alert("Excluir grupo", 'O grupo "Geral" não pode ser excluído.');
      return;
    }

    Alert.alert(
      "Excluir grupo",
      `Deseja excluir o grupo "${group.title}"?\nAs tarefas dele serão movidas para "Geral".`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteGroupAndMoveTasks(group.id, DEFAULT_GROUP_ID);

              // Atualiza estado local: remove o grupo e remapeia tasks
              const newGroups = groups.filter((g) => g.id !== group.id);
              const newTasks = tasks.map((t) =>
                t.groupId === group.id ? { ...t, groupId: DEFAULT_GROUP_ID } : t
              );

              setGroups(newGroups);
              setTasks(newTasks);

              if (selectedGroupId === group.id) {
                setSelectedGroupId(DEFAULT_GROUP_ID);
              }

              // marcou interação (sem push agora)
              await markInteraction();
            } catch (e: any) {
              Alert.alert(
                "Excluir grupo",
                e?.message ?? "Não foi possível excluir o grupo"
              );
            }
          },
        },
      ]
    );
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

      // pede permissão (macio) após ação significativa
      await ensurePermissionsSoft().catch(() => {});
      // marcou interação (sem push agora)
      await markInteraction();
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

      // marcou interação (sem push agora)
      await markInteraction();
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

      const hide = await AsyncStorage.getItem(UI_KEYS.hideDeleteGroupHint);
      if (!hide && (gs?.length ?? 0) > 1) {
        setShowDeleteHint(true);
      }

      const hasDefault = gs.find((g) => g.id === DEFAULT_GROUP_ID);
      setSelectedGroupId(
        hasDefault ? DEFAULT_GROUP_ID : gs[0]?.id ?? DEFAULT_GROUP_ID
      );

      // ===== Notificações (sem agendar diário aqui)
      await recordAppOpen();
      await scheduleOnboardingNudgeIfNeeded();
      await maybeInactivityNudge();

      // semanal (dom 19h) com métricas simples
      const pending = totalPending(ts);
      const created = ts.length;
      const done = ts.filter((t) => t.completed).length;
      await scheduleWeeklyDigest(pending, created, done);
    } finally {
      setIsReady(true);
    }
  }

  useEffect(() => {
    bootstrap();
  }, []);

  // Agenda lembrete DIÁRIO somente quando o app vai para background/inactive
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if (state === "background" || state === "inactive") {
        const pending = filteredTasks.filter((t) => !t.completed).length;
        await maybeScheduleOnBackground(pending);
      }
    });
    return () => sub.remove();
  }, [filteredTasks]);

  // abrir modal
  function openCreateGroup() {
    setShowNewGroup(true);
  }

  async function dismissDeleteHint() {
    setShowDeleteHint(false);
    await AsyncStorage.setItem(UI_KEYS.hideDeleteGroupHint, "1");
  }

  // confirmar criação via modal
  async function onConfirmCreateGroup(title: string) {
    try {
      const g = await addGroup(title);
      const next = [g, ...groups];
      setGroups(next);
      setSelectedGroupId(g.id);
      setShowNewGroup(false);
      await markInteraction();
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
        onLongPressGroup={confirmDeleteGroup}
      />

      {showDeleteHint && (
        <HintBanner
          text="Dica: para excluir um grupo, toque e segure no nome dele."
          onClose={dismissDeleteHint}
        />
      )}

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

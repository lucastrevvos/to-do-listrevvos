// src/pages/Home/index.tsx
import { ButtonIcon } from "@/src/components/ButtonIcon";
import { GroupCreateModal } from "@/src/components/GroupCreateModal";
import { GroupPicker } from "@/src/components/GroupPicker";
import { Header } from "@/src/components/Header";
import { Input } from "@/src/components/Input";
import { ListEmpty } from "@/src/components/ListEmpty";
import { ScopeTabs, type ScopeTabValue } from "@/src/components/ScopeTabs";
import { SharedListCreateModal } from "@/src/components/SharedListCreateModal";
import { Tasks } from "@/src/components/Tasks";
import { TaskStatus } from "@/src/components/TaskStatus";

import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";

import { createSharedInvite, joinSharedInviteByToken } from "@/src/services/sharedInvites";

import {
  ActivityIndicator,
  Alert,
  AppState,
  FlatList,
  Keyboard,
  Share,
  View,
} from "react-native";

import {
  createSharedItem,
  deleteSharedItem,
  fetchSharedItems,
  updateSharedItem,
  type SharedTodoItem,
} from "@/src/services/sharedItems";
import { createSharedList } from "@/src/services/sharedLists";

import { fetchSharedListsFromApi } from "@/src/storage/sharedLists";

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

import { useTheme } from "styled-components/native";
import { Container, Content, Form } from "./styles";

import { HintBanner } from "@/src/components/HintBanner";
import { JoinSharedListModal } from "@/src/components/JoinSharedListModal";
import {
  ensurePermissionsSoft,
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

type GroupWithScope = Group & { scope?: ScopeTabValue };

export function Home() {
  const { COLORS } = useTheme();

  // deep-link / params (quando entra por invite, etc)
  const { refreshShared, selectSharedListId } = useLocalSearchParams<{
    refreshShared?: string;
    selectSharedListId?: string;
  }>();

  // UI state
  const [activeTab, setActiveTab] = useState<ScopeTabValue>("local");
  const [selectedGroupId, setSelectedGroupId] =
    useState<string>(DEFAULT_GROUP_ID);

  const [newTask, setNewTask] = useState<string>("");

  // local data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  // shared data
  const [sharedGroups, setSharedGroups] = useState<GroupWithScope[]>([]);
  const [sharedItems, setSharedItems] = useState<SharedTodoItem[]>([]);
  const [sharedLoading, setSharedLoading] = useState(false);

  // modals
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showNewSharedList, setShowNewSharedList] = useState(false);
  const [showJoinSharedList, setShowJoinSharedList] = useState(false);

  // hints / boot
  const [isReady, setIsReady] = useState(false);
  const [showDeleteHint, setShowDeleteHint] = useState(false);

  function getSelectedSharedListId() {
    if (activeTab !== "shared") return null;
    if (!selectedGroupId?.startsWith("shared:")) return null;
    return selectedGroupId.replace("shared:", "");
  }

  async function syncSharedGroups() {
    const lists = await fetchSharedListsFromApi();

    const mapped: GroupWithScope[] = lists.map((l) => ({
      id: `shared:${l.id}`,
      title: l.title,
      createdAt: Date.now(),
      color: undefined,
      sort: undefined,
      scope: "shared",
    }));

    setSharedGroups(mapped);
    return mapped;
  }

  async function refreshSharedItemsForSelected() {
    const listId = getSelectedSharedListId();
    if (!listId) return;

    setSharedLoading(true);
    try {
      const items = await fetchSharedItems(listId);
      setSharedItems(items);
    } catch (e: any) {
      setSharedItems([]);
      Alert.alert(
        "Lista compartilhada",
        e?.response?.data?.message ?? "Não foi possível carregar os itens",
      );
    } finally {
      setSharedLoading(false);
    }
  }

  // Quando volta de invite (ou qualquer fluxo) pedindo refresh
  useFocusEffect(
    React.useCallback(() => {
      let cancelled = false;

      (async () => {
        if (refreshShared !== "1") return;

        const mapped = await syncSharedGroups();
        if (cancelled) return;

        if (selectSharedListId) {
          setActiveTab("shared");
          const id = `shared:${selectSharedListId}`;

          if (mapped.some((g) => g.id === id)) {
            setSelectedGroupId(id);
          }
        }

        router.setParams({
          refreshShared: undefined,
          selectSharedListId: undefined,
        });
      })();

      return () => {
        cancelled = true;
      };
    }, [refreshShared, selectSharedListId]),
  );

  // Quando troca para shared e seleciona uma lista, carrega itens do backend
  useEffect(() => {
    if (activeTab !== "shared") return;
    refreshSharedItemsForSelected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedGroupId]);

  const visibleGroups = useMemo(() => {
    if (activeTab === "shared") return sharedGroups;

    return (groups as GroupWithScope[]).filter(
      (g) => (g.scope ?? "local") === "local",
    );
  }, [groups, sharedGroups, activeTab]);

  // Garante que o selectedGroupId exista na aba atual
  useEffect(() => {
    if (!visibleGroups.length) return;

    if (!visibleGroups.some((g) => g.id === selectedGroupId)) {
      setSelectedGroupId(visibleGroups[0].id);
    }
  }, [visibleGroups, selectedGroupId]);

  // === Fonte única pro FlatList: sempre Task[]
  const filteredTasks = useMemo(() => {
    if (activeTab === "shared") {
      return sharedItems.map(
        (i) =>
          ({
            id: i.id,
            title: i.text,
            completed: i.isDone,
            groupId: selectedGroupId,
            createdAt: new Date(i.createdAt).getTime(),
          }) as Task,
      );
    }

    return tasks.filter((t) => t.groupId === selectedGroupId);
  }, [tasks, selectedGroupId, activeTab, sharedItems]);

  const createdCount = filteredTasks.length;
  const completedCount = useMemo(
    () => filteredTasks.filter((t) => t.completed).length,
    [filteredTasks],
  );

  const selectedSharedListId = getSelectedSharedListId();

  function totalPending(all: Task[]) {
    return all.filter((t) => !t.completed).length;
  }

  async function handleAddTask() {
    try {
      const title = (newTask || "").trim();
      if (!title) throw new AppError("Você precisa escrever uma tarefa.");

      // ===== SHARED
      if (activeTab === "shared") {
        const listId = getSelectedSharedListId();
        if (!listId) throw new AppError("Lista compartilhada inválida.");

        setSharedLoading(true);
        try {
          await createSharedItem(listId, title);
          setNewTask("");
          Keyboard.dismiss();
          await refreshSharedItemsForSelected();
          await markInteraction();
        } catch (e: any) {
          Alert.alert(
            "Nova task",
            e?.response?.data?.message ?? "Não foi possível criar a task",
          );
        } finally {
          setSharedLoading(false);
        }
        return;
      }

      // ===== LOCAL
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

      await ensurePermissionsSoft().catch(() => {});
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

  async function handleJoinByToken(token: string) {
    try {
      const result = await joinSharedInviteByToken(token);

      setShowJoinSharedList(false);

      const mapped = await syncSharedGroups();
      setActiveTab("shared");

      const id = `shared:${result.listId}`;
      if (mapped.some((g) => g.id === id)) {
        setSelectedGroupId(id);
      }

      await refreshSharedItemsForSelected();

      Alert.alert("Tudo certo", "Você entrou na lista compartilhada.");
    } catch (e: any) {
      console.log("joinSharedInviteByToken error:", {
        message: e?.message,
        code: e?.code,
        status: e?.response?.status,
        data: e?.response?.data,
        url: e?.config?.baseURL + e?.config?.url,
      });

      Alert.alert(
        "Entrar por token",
        e?.response?.data?.message ?? "Não foi possível entrar na lista",
      );
    }
}

  async function handleShareSharedList() {
  try {
    const listId = getSelectedSharedListId();
    if (!listId) {
      Alert.alert("Compartilhar", "Selecione uma lista compartilhada primeiro.");
      return;
    }

    const currentGroup = sharedGroups.find((g) => g.id === selectedGroupId);
    const listTitle = currentGroup?.title ?? "Lista compartilhada";

    const invite = await createSharedInvite(listId, {
      role: "EDITOR",
      expiresInDays: 7,
      maxUses: 10,
    });

    const deepLink =
      invite.deepLink ?? `todolistrevvos://todo/invite/${invite.token}`;

    const webLink =
      invite.webLink ?? `https://trevvos.com.br/todo/invite/${invite.token}`;

    const message =
      `Convite para colaborar na lista "${listTitle}"\n\n` +
      `Abrir no app: ${deepLink}\n` +
      `Fallback web: ${webLink}`;

    await Share.share({
      message,
      title: `Compartilhar lista: ${listTitle}`,
    });
  } catch (e: any) {
    console.log("createSharedInvite error:", {
      message: e?.message,
      code: e?.code,
      status: e?.response?.status,
      data: e?.response?.data,
      url: e?.config?.baseURL + e?.config?.url,
    });

    Alert.alert(
      "Compartilhar lista",
      e?.response?.data?.message ?? "Não foi possível gerar o convite",
    );
  }
}

  async function handleToggleTask(id: string) {
    // ===== SHARED
    if (activeTab === "shared") {
      const listId = getSelectedSharedListId();
      if (!listId) return;

      const current = sharedItems.find((i) => i.id === id);
      if (!current) return;

      // otimista
      setSharedItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isDone: !i.isDone } : i)),
      );

      try {
        await updateSharedItem(listId, id, {
          isDone: !current.isDone,
          // version: current.version, // se você usar concurrency
        });
        await markInteraction();
      } catch (e: any) {
        // rollback
        setSharedItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, isDone: current.isDone } : i)),
        );
        Alert.alert(
          "Atualizar task",
          e?.response?.data?.message ?? "Não foi possível atualizar a task",
        );
      }
      return;
    }

    // ===== LOCAL
    const updated = (tasks ?? []).map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );

    const sameGroup = updated.filter((t) => t.groupId === selectedGroupId);
    const others = updated.filter((t) => t.groupId !== selectedGroupId);

    const reorderedSameGroup = [
      ...sameGroup.filter((t) => !t.completed),
      ...sameGroup.filter((t) => t.completed),
    ];

    const next = [...reorderedSameGroup, ...others];
    setTasks(next);
    saveTasks(next);
    markInteraction();
  }

  async function handleRemoveTask(id: string) {
    // ===== SHARED
    if (activeTab === "shared") {
      const listId = getSelectedSharedListId();
      if (!listId) return;

      const snapshot = sharedItems;
      setSharedItems((prev) => prev.filter((i) => i.id !== id));

      try {
        await deleteSharedItem(listId, id);
        await markInteraction();
      } catch (e: any) {
        setSharedItems(snapshot);
        Alert.alert(
          "Remover task",
          e?.response?.data?.message ?? "Não foi possível remover a task",
        );
      }
      return;
    }

    // ===== LOCAL
    try {
      if (!tasks.some((t) => t.id === id)) {
        throw new AppError("Tarefa não encontrada");
      }
      const updated = tasks.filter((t) => t.id !== id);
      setTasks(updated);
      await removeTaskById(id);

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

  function confirmDeleteGroup(group: Group) {
    if (group.id === DEFAULT_GROUP_ID) {
      Alert.alert("Excluir grupo", 'O grupo "Geral" não pode ser excluído.');
      return;
    }

    if (activeTab === "shared" || group.id.startsWith("shared:")) {
      Alert.alert(
        "Ops",
        "Listas compartilhadas não são excluídas por aqui (ainda).",
      );
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

              const newGroups = groups.filter((g) => g.id !== group.id);
              const newTasks = tasks.map((t) =>
                t.groupId === group.id
                  ? { ...t, groupId: DEFAULT_GROUP_ID }
                  : t,
              );

              setGroups(newGroups);
              setTasks(newTasks);

              if (selectedGroupId === group.id) {
                setSelectedGroupId(DEFAULT_GROUP_ID);
              }

              await markInteraction();
            } catch (e: any) {
              Alert.alert(
                "Excluir grupo",
                e?.message ?? "Não foi possível excluir o grupo",
              );
            }
          },
        },
      ],
    );
  }

  async function dismissDeleteHint() {
    setShowDeleteHint(false);
    await AsyncStorage.setItem(UI_KEYS.hideDeleteGroupHint, "1");
  }

  function openCreateGroup() {
    if (activeTab === "shared") {
      setShowNewSharedList(true);
      return;
    }
    setShowNewGroup(true);
  }

  async function onConfirmCreateGroup(title: string) {
    try {
      const g = await addGroup(title, activeTab);
      const gWithScope = { ...g, scope: activeTab };
      const next = [gWithScope, ...groups];
      setGroups(next);
      setSelectedGroupId(g.id);
      setShowNewGroup(false);
      await markInteraction();
    } catch (e: any) {
      Alert.alert("Novo grupo", e?.message ?? "Não foi possível criar o grupo");
    }
  }

  async function bootstrap() {
    try {
      await migrateIfNeeded();

      const gs = await ensureDefaultGroup();
      const ts = await loadTasks();

      setGroups(gs);
      setTasks(ts);

      // shared em paralelo
      syncSharedGroups().catch(() => {});

      const hide = await AsyncStorage.getItem(UI_KEYS.hideDeleteGroupHint);
      if (!hide && (gs?.length ?? 0) > 1) {
        setShowDeleteHint(true);
      }

      const hasDefault = gs.find((g) => g.id === DEFAULT_GROUP_ID);
      setSelectedGroupId(
        hasDefault ? DEFAULT_GROUP_ID : (gs[0]?.id ?? DEFAULT_GROUP_ID),
      );

      await recordAppOpen();
      await scheduleOnboardingNudgeIfNeeded();
      await maybeInactivityNudge();

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

  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if (state === "background" || state === "inactive") {
        const pending = filteredTasks.filter((t) => !t.completed).length;
        await maybeScheduleOnBackground(pending);
      }
    });
    return () => sub.remove();
  }, [filteredTasks]);

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

      <ScopeTabs value={activeTab} onChange={setActiveTab} />

      <GroupPicker
        groups={visibleGroups}
        selectedId={selectedGroupId}
        onSelect={setSelectedGroupId}
        onAdd={openCreateGroup}
        onLongPressGroup={confirmDeleteGroup}
      />

      {activeTab === "shared" ? (
  <View
    style={{
      paddingHorizontal: 20,
      paddingTop: 8,
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 8,
    }}
  >
    <ButtonIcon
      icon="enter-outline"
      onPress={() => setShowJoinSharedList(true)}
    />

    {selectedSharedListId ? (
      <ButtonIcon
        icon="share-social-outline"
        onPress={handleShareSharedList}
      />
    ) : null}
  </View>
) : null}

      {showDeleteHint && (
        <HintBanner
          text="Dica: para excluir um grupo, toque e segure no nome dele."
          onClose={dismissDeleteHint}
        />
      )}

      <Form>
        <Input
          placeholder={
            activeTab === "shared"
              ? "Adicione uma nova task na lista"
              : "Adicione uma nova tarefa"
          }
          placeholderTextColor={COLORS.GRAY_300}
          onChangeText={setNewTask}
          value={newTask}
          onSubmitEditing={handleAddTask}
          returnKeyType="done"
        />
        <ButtonIcon icon="add-circle-outline" onPress={handleAddTask} />
      </Form>

      <Content>
        <TaskStatus createdCount={createdCount} completedCount={completedCount} />

        {/* Spinner no lugar da lista quando sharedLoading */}
        {activeTab === "shared" && sharedLoading ? (
          <Content style={{ alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="small" color={COLORS.GRAY_300} />
          </Content>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Tasks
                task={item}
                onRemove={(id) => handleRemoveTask(id)}
                onToggle={() => handleToggleTask(item.id)}
              />
            )}
            contentContainerStyle={{
              paddingBottom: 100,
              ...(filteredTasks.length === 0 ? { flexGrow: 1 } : null),
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <ListEmpty
                title={
                  activeTab === "shared"
                    ? "Sem tasks nessa lista"
                    : "Sem tarefas nesse grupo"
                }
                text={
                  activeTab === "shared"
                    ? "Crie tasks e compartilhe com outras pessoas."
                    : "Crie tarefas e organize seus itens aqui"
                }
              />
            )}
          />
        )}
      </Content>

      {/* Modal de criação de grupo LOCAL */}
      <GroupCreateModal
        visible={showNewGroup}
        onClose={() => setShowNewGroup(false)}
        onConfirm={onConfirmCreateGroup}
      />

      {/* Modal de criação de lista compartilhada */}
      <SharedListCreateModal
        visible={showNewSharedList}
        onClose={() => setShowNewSharedList(false)}
        onConfirm={async (title) => {
          try {
            const created = await createSharedList(title);

            setShowNewSharedList(false);

            const mapped = await syncSharedGroups();
            setActiveTab("shared");

            const id = `shared:${created.id}`;
            if (mapped.some((g) => g.id === id)) {
              setSelectedGroupId(id);
            }

            // já carrega items da lista nova
            await refreshSharedItemsForSelected();
          } catch (e: any) {
            console.log("createSharedList error:", {
              message: e?.message,
              code: e?.code,
              status: e?.response?.status,
              data: e?.response?.data,
              url: e?.config?.baseURL + e?.config?.url,
            });

            Alert.alert(
              "Nova lista compartilhada",
              e?.response?.data?.message ?? "Não foi possível criar a lista",
            );
          }
        }}
      />

      <JoinSharedListModal
        visible={showJoinSharedList}
        onClose={() => setShowJoinSharedList(false)}
        onConfirm={handleJoinByToken}
      />
    </Container>
  );
}
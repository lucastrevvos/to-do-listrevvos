import { router, useFocusEffect } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  FlatList,
} from "react-native";
import { useTheme } from "styled-components/native";

import { Ionicons } from "@expo/vector-icons";

import { AppHeader } from "@/src/components/AppHeader";
import { GroupCreateModal } from "@/src/components/GroupCreateModal";
import { JoinSharedListModal } from "@/src/components/JoinSharedListModal";
import { ScopeTabs, type ScopeTabValue } from "@/src/components/ScopeTabs";
import { SharedListCreateModal } from "@/src/components/SharedListCreateModal";
import { DEFAULT_GROUP_ID } from "@/src/constants/app";
import {
  getNotifiablePendingCount,
  markInteraction,
  maybeScheduleOnBackground,
} from "@/src/services/notifications";
import { joinSharedInviteByToken } from "@/src/services/sharedInvites";
import { fetchSharedItems } from "@/src/services/sharedItems";
import {
  createSharedList,
  deleteSharedList,
  leaveSharedList,
} from "@/src/services/sharedLists";
import {
  addGroup,
  ensureDefaultGroup,
  removeGroup,
} from "@/src/storage/groups";
import { migrateIfNeeded } from "@/src/storage/migrations";
import {
  fetchSharedListsFromApi,
  type SharedList,
} from "@/src/storage/sharedLists";
import { loadTasks } from "@/src/storage/tasks";
import type { Group, ListType } from "@/src/types/group";
import type { Task } from "@/src/types/task";

import {
  Badge,
  BadgeText,
  Card,
  CardFooter,
  CardHeader,
  CardMain,
  CardProgressBar,
  CardProgressFill,
  CardSubtitle,
  CardTouchable,
  CardTitle,
  Container,
  EmptyDescription,
  EmptyLogo,
  EmptyState,
  EmptyTitle,
  Fab,
  FabText,
  ListsContainer,
  LoadingWrap,
  MenuButton,
  SectionHeader,
  SectionActionText,
  SectionTitleWrap,
  SectionTitle,
  SharedActionButton,
  SharedActionContent,
  SummaryText,
} from "./styles";

const flowMark = require("../../../assets/images/flow-mark.png");

type LocalListCard = {
  id: string;
  scope: "local";
  title: string;
  total: number;
  completed: number;
  type: ListType;
};

type SharedListCard = {
  id: string;
  scope: "shared";
  title: string;
  total: number;
  completed: number;
  role: "OWNER" | "EDITOR" | "VIEWER";
};

type ListCardItem = LocalListCard | SharedListCard;

function getRoleLabel(role: "OWNER" | "EDITOR" | "VIEWER") {
  switch (role) {
    case "OWNER":
      return "Dono";
    case "EDITOR":
      return "Editor";
    case "VIEWER":
      return "Leitor";
    default:
      return "";
  }
}

function getListAccent(type?: "shopping" | "task" | "routine") {
  switch (type) {
    case "shopping":
      return "shopping";
    case "routine":
      return "routine";
    default:
      return "task";
  }
}

function getListTypeLabel(type?: "shopping" | "task" | "routine") {
  switch (type) {
    case "shopping":
      return "Compras";
    case "routine":
      return "Rotina";
    default:
      return "Tarefa";
  }
}

export function ListsHome() {
  const { COLORS } = useTheme();

  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState<ScopeTabValue>("local");

  const [groups, setGroups] = useState<Group[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [sharedLists, setSharedLists] = useState<SharedList[]>([]);
  const [sharedCounts, setSharedCounts] = useState<
    Record<string, { total: number; completed: number }>
  >({});
  const [sharedLoading, setSharedLoading] = useState(false);

  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showNewSharedList, setShowNewSharedList] = useState(false);
  const [showJoinSharedList, setShowJoinSharedList] = useState(false);

  async function refreshSharedLists() {
    try {
      setSharedLoading(true);

      const lists = await fetchSharedListsFromApi();
      setSharedLists(lists);

      const countsEntries = await Promise.all(
        lists.map(async (list) => {
          try {
            const items = await fetchSharedItems(list.id);

            return [
              list.id,
              {
                total: items.length,
                completed: items.filter((item) => item.isDone).length,
              },
            ] as const;
          } catch {
            return [list.id, { total: 0, completed: 0 }] as const;
          }
        }),
      );

      setSharedCounts(Object.fromEntries(countsEntries));
    } catch (error: any) {
      Alert.alert(
        "Listas compartilhadas",
        error?.response?.data?.message ??
          "Não foi possível carregar as listas compartilhadas",
      );
    } finally {
      setSharedLoading(false);
    }
  }

  async function bootstrap() {
    try {
      await migrateIfNeeded();

      const loadedGroups = await ensureDefaultGroup();
      const loadedTasks = await loadTasks();

      setGroups(loadedGroups);
      setTasks(loadedTasks);

      await refreshSharedLists();
      setActiveTab("local");
      await markInteraction();
    } finally {
      setIsReady(true);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      let cancelled = false;

      (async () => {
        if (cancelled) return;
        await bootstrap();
      })();

      return () => {
        cancelled = true;
      };
    }, []),
  );

  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if (state === "background" || state === "inactive") {
        const pendingCount = getNotifiablePendingCount(tasks, groups);
        await maybeScheduleOnBackground(pendingCount);
      }
    });

    return () => sub.remove();
  }, [tasks, groups]);

  const localCards = useMemo<ListCardItem[]>(() => {
    return groups.map((group) => {
      const groupTasks = tasks.filter((task) => task.groupId === group.id);
      const completed = groupTasks.filter((task) => task.completed).length;

      return {
        id: group.id,
        scope: "local",
        title: group.title,
        total: groupTasks.length,
        completed,
        type: group.type ?? "task",
      };
    });
  }, [groups, tasks]);

  const sharedCards = useMemo<ListCardItem[]>(() => {
    return sharedLists.map((list) => {
      const counts = sharedCounts[list.id] ?? { total: 0, completed: 0 };

      return {
        id: list.id,
        scope: "shared",
        title: list.title,
        total: counts.total,
        completed: counts.completed,
        role: list.role,
      };
    });
  }, [sharedLists, sharedCounts]);

  const visibleCards = activeTab === "local" ? localCards : sharedCards;

  const totalLists = visibleCards.length;
  const totalItems = visibleCards.reduce((acc, item) => acc + item.total, 0);
  const totalCompleted = visibleCards.reduce(
    (acc, item) => acc + item.completed,
    0,
  );

  function openCreateList() {
    if (activeTab === "shared") {
      setShowNewSharedList(true);
      return;
    }

    setShowNewGroup(true);
  }

  async function handleCreateLocalList(title: string, type: ListType) {
    try {
      const group = await addGroup(title, "local", type);
      setGroups((prev) => [group, ...prev]);
      setShowNewGroup(false);

      await markInteraction();
    } catch (error: any) {
      Alert.alert(
        "Nova lista",
        error?.message ?? "Não foi possível criar a lista",
      );
    }
  }

  async function handleCreateSharedList(title: string) {
    try {
      await createSharedList(title);
      setShowNewSharedList(false);

      await refreshSharedLists();
      setActiveTab("shared");

      await markInteraction();
    } catch (error: any) {
      Alert.alert(
        "Nova lista compartilhada",
        error?.response?.data?.message ?? "Não foi possível criar a lista",
      );
    }
  }

  async function handleJoinByToken(token: string) {
    try {
      const result = await joinSharedInviteByToken(token);

      setShowJoinSharedList(false);

      await refreshSharedLists();
      setActiveTab("shared");

      router.push({
        pathname: "/lists/[id]",
        params: {
          id: result.listId,
          scope: "shared",
        },
      });
    } catch (error: any) {
      Alert.alert(
        "Entrar por token",
        error?.response?.data?.message ?? "Não foi possível entrar na lista",
      );
    }
  }

  function openList(item: ListCardItem) {
    router.push({
      pathname: "/lists/[id]",
      params: {
        id: item.id,
        scope: item.scope,
      },
    });
  }

  function confirmRemoveList(item: ListCardItem) {
    if (item.scope !== "local") {
      Alert.alert(
        "Listas compartilhadas",
        "A remoção de listas compartilhadas virá depois.",
      );
      return;
    }

    if (item.id === DEFAULT_GROUP_ID) {
      Alert.alert("Lista protegida", 'A lista "Geral" não pode ser removida.');
      return;
    }

    Alert.alert(
      "Remover lista",
      `A lista "${item.title}" será removida junto com todos os itens dela.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await removeGroup(item.id);
              setGroups(result.groups);
              setTasks(result.tasks);

              await markInteraction();
            } catch (error: any) {
              Alert.alert(
                "Remover lista",
                error?.message ?? "Não foi possível remover a lista",
              );
            }
          },
        },
      ],
    );
  }

  function openSharedListMenu(item: ListCardItem) {
    if (item.scope !== "shared") return;

    const options: {
      text: string;
      style?: "default" | "cancel" | "destructive";
      onPress?: () => void;
    }[] = [];

    if ("role" in item && item.role === "OWNER") {
      options.push({
        text: "Excluir lista",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteSharedList(item.id);
            await refreshSharedLists();
          } catch (error: any) {
            Alert.alert(
              "Excluir lista",
              error?.response?.data?.message ??
                "Não foi possível excluir a lista",
            );
          }
        },
      });
    }

    if ("role" in item && item.role === "EDITOR") {
      options.push({
        text: "Sair da lista",
        style: "destructive",
        onPress: async () => {
          try {
            await leaveSharedList(item.id);
            await refreshSharedLists();
          } catch (error: any) {
            Alert.alert(
              "Sair da lista",
              error?.response?.data?.message ??
                "Não foi possível sair da lista",
            );
          }
        },
      });
    }

    options.push({
      text: "Cancelar",
      style: "cancel",
    });

    Alert.alert("Opções da lista", "", options);
  }

  if (!isReady) {
    return (
      <Container>
        <LoadingWrap>
          <ActivityIndicator size="small" color={COLORS.GRAY_300} />
        </LoadingWrap>
      </Container>
    );
  }

  return (
    <Container>
      <AppHeader
        title="Trevvos Flow"
        subtitle="Listas, tarefas e rotinas em fluxo."
        logoSource={flowMark}
      />

      <ScopeTabs value={activeTab} onChange={setActiveTab} />

      <ListsContainer>
        <SectionHeader>
          <SectionTitleWrap>
            <SectionTitle>
              {activeTab === "local" ? "Suas listas" : "Compartilhadas"}
            </SectionTitle>
            <SummaryText>
              {totalLists} listas · {totalItems} itens · {totalCompleted} feitos
            </SummaryText>
          </SectionTitleWrap>

          {activeTab === "shared" ? (
            <SharedActionButton onPress={() => setShowJoinSharedList(true)}>
              <SharedActionContent>
                <Ionicons
                  name="enter-outline"
                  size={15}
                  color={COLORS.WHITE}
                />
                <SectionActionText>Entrar por token</SectionActionText>
              </SharedActionContent>
            </SharedActionButton>
          ) : null}
        </SectionHeader>

        {activeTab === "shared" && sharedLoading ? (
          <LoadingWrap>
            <ActivityIndicator size="small" color={COLORS.GRAY_300} />
          </LoadingWrap>
        ) : (
          <FlatList
            data={visibleCards}
            keyExtractor={(item) => `${item.scope}:${item.id}`}
            contentContainerStyle={{
              paddingBottom: 120,
              gap: 12,
              ...(visibleCards.length === 0
                ? { flexGrow: 1, justifyContent: "center" }
                : null),
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const progress = item.total > 0 ? item.completed / item.total : 0;

              return (
                <CardTouchable onPress={() => openList(item)}>
                  <Card
                    accent={getListAccent("type" in item ? item.type : "task")}
                  >
                    <CardHeader>
                      <CardMain>
                        <CardTitle numberOfLines={1}>{item.title}</CardTitle>
                        <CardSubtitle>
                          {item.completed} de {item.total} itens
                        </CardSubtitle>
                      </CardMain>

                      <Badge shared={item.scope === "shared"}>
                        <BadgeText>
                          {item.scope === "shared"
                            ? "Compartilhada"
                            : getListTypeLabel(
                                "type" in item ? item.type : "task",
                              )}
                        </BadgeText>
                      </Badge>

                      {(item.scope === "local" &&
                        item.id !== DEFAULT_GROUP_ID) ||
                      item.scope === "shared" ? (
                        <MenuButton
                          onPress={() => {
                            if (item.scope === "local") {
                              confirmRemoveList(item);
                            } else {
                              openSharedListMenu(item);
                            }
                          }}
                          hitSlop={8}
                        >
                          <Ionicons
                            name="ellipsis-horizontal"
                            size={18}
                            color={COLORS.GRAY_200}
                          />
                        </MenuButton>
                      ) : null}
                    </CardHeader>

                    <CardProgressBar>
                      <CardProgressFill
                        progress={progress}
                        accent={getListAccent(
                          "type" in item ? item.type : "task",
                        )}
                      />
                    </CardProgressBar>

                    <CardFooter>
                      <CardSubtitle>
                        {item.total === 0
                          ? "Lista vazia"
                          : `${Math.round(progress * 100)}% concluído`}
                      </CardSubtitle>

                      {item.scope === "shared" ? (
                        <CardSubtitle>
                          {"role" in item ? getRoleLabel(item.role) : ""}
                        </CardSubtitle>
                      ) : null}
                    </CardFooter>
                  </Card>
                </CardTouchable>
              );
            }}
            ListEmptyComponent={() => (
              <EmptyState>
                <EmptyLogo
                  source={flowMark}
                  accessible={false}
                  accessibilityIgnoresInvertColors
                />
                <EmptyTitle>
                  {activeTab === "local"
                    ? "Crie sua primeira lista"
                    : "Nenhuma lista compartilhada"}
                </EmptyTitle>
                <EmptyDescription>
                  {activeTab === "local"
                    ? "Use o botão + para organizar tarefas, compras ou rotinas."
                    : "Entre por token ou crie uma lista compartilhada pelo botão +."}
                </EmptyDescription>
              </EmptyState>
            )}
          />
        )}
      </ListsContainer>

      <Fab onPress={openCreateList}>
        <FabText>+</FabText>
      </Fab>

      <GroupCreateModal
        visible={showNewGroup}
        onClose={() => setShowNewGroup(false)}
        onConfirm={handleCreateLocalList}
      />

      <SharedListCreateModal
        visible={showNewSharedList}
        onClose={() => setShowNewSharedList(false)}
        onConfirm={handleCreateSharedList}
      />

      <JoinSharedListModal
        visible={showJoinSharedList}
        onClose={() => setShowJoinSharedList(false)}
        onConfirm={handleJoinByToken}
      />
    </Container>
  );
}

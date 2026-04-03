import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  View,
} from "react-native";
import { useTheme } from "styled-components/native";

import { GroupCreateModal } from "@/src/components/GroupCreateModal";
import { ScopeTabs, type ScopeTabValue } from "@/src/components/ScopeTabs";
import { SharedListCreateModal } from "@/src/components/SharedListCreateModal";

import { addGroup, ensureDefaultGroup } from "@/src/storage/groups";
import { migrateIfNeeded } from "@/src/storage/migrations";
import {
  fetchSharedListsFromApi,
  type SharedList,
} from "@/src/storage/sharedLists";
import { loadTasks } from "@/src/storage/tasks";

import { fetchSharedItems } from "@/src/services/sharedItems";
import { createSharedList } from "@/src/services/sharedLists";

import type { Group } from "@/src/types/group";
import type { Task } from "@/src/types/task";

import { joinSharedInviteByToken } from "@/src/services/sharedInvites";

import { JoinSharedListModal } from "@/src/components/JoinSharedListModal";
import {
  Badge,
  BadgeText,
  Card,
  CardFooter,
  CardProgressBar,
  CardProgressFill,
  CardSubtitle,
  CardTitle,
  Container,
  EmptyText,
  Fab,
  FabText,
  HeaderBlock,
  HeroCard,
  HeroLabel,
  HeroNumber,
  HeroRow,
  HeroText,
  ListsContainer,
  SectionActionText,
  SectionTitle,
  TopTitle,
} from "./styles";

type LocalListCard = {
  id: string;
  scope: "local";
  title: string;
  total: number;
  completed: number;
  type: "shopping" | "task" | "routine";
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

function getListTypeLabel(type?: "shopping" | "task" | "routine") {
  switch (type) {
    case "shopping":
      return "🛒 Compras";
    case "routine":
      return "🔁 Rotina";
    default:
      return "📝 Tarefa";
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

  async function bootstrap() {
    try {
      await migrateIfNeeded();

      const gs = await ensureDefaultGroup();
      const ts = await loadTasks();

      setGroups(gs);
      setTasks(ts);

      await refreshSharedLists();
    } finally {
      setIsReady(true);
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
    } catch (e: any) {
      Alert.alert(
        "Entrar por token",
        e?.response?.data?.message ?? "Não foi possível entrar na lista",
      );
    }
  }

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
                completed: items.filter((i) => i.isDone).length,
              },
            ] as const;
          } catch {
            return [list.id, { total: 0, completed: 0 }] as const;
          }
        }),
      );

      setSharedCounts(Object.fromEntries(countsEntries));
    } catch (e: any) {
      Alert.alert(
        "Listas compartilhadas",
        e?.response?.data?.message ??
          "Não foi possível carregar as listas compartilhadas",
      );
    } finally {
      setSharedLoading(false);
    }
  }

  useEffect(() => {
    bootstrap();
  }, []);

  const localCards = useMemo<ListCardItem[]>(() => {
    return groups.map((group) => {
      const groupTasks = tasks.filter((t) => t.groupId === group.id);
      const completed = groupTasks.filter((t) => t.completed).length;

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

  async function handleCreateLocalList(title: string) {
    try {
      const g = await addGroup(title, "local");
      setGroups((prev) => [g, ...prev]);
      setShowNewGroup(false);
    } catch (e: any) {
      Alert.alert("Nova lista", e?.message ?? "Não foi possível criar a lista");
    }
  }

  async function handleCreateSharedList(title: string) {
    try {
      await createSharedList(title);
      setShowNewSharedList(false);
      await refreshSharedLists();
      setActiveTab("shared");
    } catch (e: any) {
      Alert.alert(
        "Nova lista compartilhada",
        e?.response?.data?.message ?? "Não foi possível criar a lista",
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

  if (!isReady) {
    return (
      <Container>
        <ListsContainer
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="small" color={COLORS.GRAY_300} />
        </ListsContainer>
      </Container>
    );
  }

  return (
    <Container>
      <HeaderBlock>
        <TopTitle>Trevvos Lists</TopTitle>

        <HeroCard>
          <HeroLabel>
            {activeTab === "local"
              ? "Seu espaço local"
              : "Espaço compartilhado"}
          </HeroLabel>

          <HeroText>
            {activeTab === "local"
              ? "Listas pessoais, compras, viagens e lembretes."
              : "Listas em grupo para colaborar com outras pessoas."}
          </HeroText>

          <HeroRow>
            <View>
              <HeroNumber>{totalLists}</HeroNumber>
              <CardSubtitle>listas</CardSubtitle>
            </View>

            <View>
              <HeroNumber>{totalItems}</HeroNumber>
              <CardSubtitle>itens</CardSubtitle>
            </View>

            <View>
              <HeroNumber>{totalCompleted}</HeroNumber>
              <CardSubtitle>concluídos</CardSubtitle>
            </View>
          </HeroRow>
        </HeroCard>
      </HeaderBlock>

      <ScopeTabs value={activeTab} onChange={setActiveTab} />

      <ListsContainer>
        <SectionTitle>
          {activeTab === "local" ? "Suas listas" : "Listas compartilhadas"}
        </SectionTitle>

        {activeTab === "shared" ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginBottom: 12,
            }}
          >
            <Pressable
              onPress={() => setShowJoinSharedList(true)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 999,
                backgroundColor: COLORS.GRAY_600,
                borderWidth: 1,
                borderColor: COLORS.GRAY_500,
              }}
            >
              <SectionActionText>Entrar por token</SectionActionText>
            </Pressable>
          </View>
        ) : null}

        {activeTab === "shared" && sharedLoading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size="small" color={COLORS.GRAY_300} />
          </View>
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
                <Pressable onPress={() => openList(item)}>
                  <Card>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <CardTitle numberOfLines={1}>{item.title}</CardTitle>
                        <CardSubtitle>
                          {item.completed} de {item.total} itens
                        </CardSubtitle>
                      </View>

                      <Badge shared={item.scope === "shared"}>
                        <BadgeText>
                          {item.scope === "shared"
                            ? "Shared"
                            : getListTypeLabel(
                                "type" in item ? item.type : "task",
                              )}
                        </BadgeText>
                      </Badge>
                    </View>

                    <CardProgressBar>
                      <CardProgressFill progress={progress} />
                    </CardProgressBar>

                    <CardFooter>
                      <CardSubtitle>
                        {item.total === 0
                          ? "Lista vazia"
                          : `${Math.round(progress * 100)}% concluído`}
                      </CardSubtitle>

                      {item.scope === "shared" ? (
                        <CardSubtitle>
                          {"role" in item ? item.role : ""}
                        </CardSubtitle>
                      ) : null}
                    </CardFooter>
                  </Card>
                </Pressable>
              );
            }}
            ListEmptyComponent={() => (
              <EmptyText>
                {activeTab === "local"
                  ? "Você ainda não criou nenhuma lista."
                  : "Nenhuma lista compartilhada encontrada."}
              </EmptyText>
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

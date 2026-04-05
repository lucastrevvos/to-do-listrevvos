import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Share,
  TextInput,
} from "react-native";

import { ButtonIcon } from "@/src/components/ButtonIcon";
import { JoinSharedListModal } from "@/src/components/JoinSharedListModal";
import { ListEmpty } from "@/src/components/ListEmpty";
import { Tasks } from "@/src/components/Tasks";

import {
  createSharedInvite,
  joinSharedInviteByToken,
} from "@/src/services/sharedInvites";
import {
  createSharedItem,
  deleteSharedItem,
  fetchSharedItems,
  updateSharedItem,
  type SharedTodoItem,
} from "@/src/services/sharedItems";

import { ensureDefaultGroup } from "@/src/storage/groups";
import { fetchSharedListsFromApi } from "@/src/storage/sharedLists";
import { loadTasks, removeTaskById, saveTasks } from "@/src/storage/tasks";

import type { Task } from "@/src/types/task";
import { AppError } from "@/src/utils/AppError";

import { ListType } from "@/src/types/group";
import { Ionicons } from "@expo/vector-icons";
import {
  ActionButton,
  ActionButtonText,
  ActionsRow,
  BackButton,
  Badge,
  BadgeText,
  Container,
  Content,
  EmptyWrap,
  Fab,
  FabText,
  FormCard,
  HeaderArea,
  InputRow,
  ListMeta,
  ListTitle,
  LoadingWrap,
  ProgressBar,
  ProgressFill,
  ProgressMeta,
  ProgressNumber,
  ProgressText,
  QuickStat,
  QuickStatLabel,
  QuickStatsRow,
  QuickStatValue,
  StyledInput,
  TopRow,
} from "./styles";

type Props = {
  id: string;
  scope: "local" | "shared";
};

function getListTypeLabel(type: ListType, isShared: boolean) {
  if (isShared) return "Shared";

  switch (type) {
    case "shopping":
      return "🛒 Compras";
    case "routine":
      return "🔁 Rotina";
    default:
      return "✔ Tarefas";
  }
}

function getProgressLabel(type: ListType) {
  switch (type) {
    case "shopping":
      return "itens comprados";
    case "routine":
      return "hábitos concluídos";
    default:
      return "tarefas concluídas";
  }
}

function getMetaDescription(type: ListType, isShared: boolean) {
  if (isShared) {
    return "Lista colaborativa para uso em grupo.";
  }

  switch (type) {
    case "shopping":
      return "Lista ideal para compras e itens recorrentes.";
    case "routine":
      return "Lista reiniciável para hábitos e rotinas.";
    default:
      return "Lista pessoal para organizar suas tarefas.";
  }
}

export function ListDetail({ id, scope }: Props) {
  const inputRef = useRef<TextInput>(null);

  const [title, setTitle] = useState("Lista");
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [sharedItems, setSharedItems] = useState<SharedTodoItem[]>([]);

  const [listType, setListType] = useState<ListType>("task");

  const [showJoinByToken, setShowJoinByToken] = useState(false);

  const isShared = scope === "shared";

  const bootstrap = useCallback(async () => {
    try {
      setLoading(true);

      if (isShared) {
        const [lists, items] = await Promise.all([
          fetchSharedListsFromApi(),
          fetchSharedItems(id),
        ]);

        const current = lists.find((l) => l.id === id);
        if (current) {
          setTitle(current.title);
          setListType("task");
        }

        setSharedItems(items);
        return;
      }

      const [groups, tasks] = await Promise.all([
        ensureDefaultGroup(),
        loadTasks(),
      ]);

      const currentGroup = groups.find((g) => g.id === id);
      if (currentGroup) {
        setTitle(currentGroup.title);
        setListType(currentGroup.type ?? "task");
      }

      setLocalTasks(tasks.filter((t) => t.groupId === id));
    } finally {
      setLoading(false);
    }
  }, [id, isShared]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        if (cancelled) return;
        await bootstrap();
      })();

      return () => {
        cancelled = true;
      };
    }, [bootstrap]),
  );

  const itemsAsTasks = useMemo(() => {
    if (isShared) {
      return sharedItems.map(
        (i) =>
          ({
            id: i.id,
            title: i.text,
            completed: i.isDone,
            groupId: id,
            createdAt: new Date(i.createdAt).getTime(),
          }) as Task,
      );
    }

    return localTasks;
  }, [isShared, sharedItems, localTasks, id]);

  const completed = itemsAsTasks.filter((t) => t.completed).length;
  const total = itemsAsTasks.length;
  const pending = total - completed;
  const progress = total > 0 ? completed / total : 0;

  async function refreshSharedItems() {
    const items = await fetchSharedItems(id);
    setSharedItems(items);
  }

  async function handleRefresh() {
    try {
      setRefreshing(true);
      await bootstrap();
    } finally {
      setRefreshing(false);
    }
  }

  async function handleAddItem() {
    try {
      const value = newItem.trim();
      if (!value) throw new AppError("Digite um item.");

      if (isShared) {
        await createSharedItem(id, value);
        setNewItem("");
        Keyboard.dismiss();
        await refreshSharedItems();
        return;
      }

      const allTasks = await loadTasks();

      const alreadyExists = allTasks.some(
        (t) => t.groupId === id && t.title === value,
      );
      if (alreadyExists) throw new AppError("Esse item já existe");

      const newTask: Task = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        title: value,
        completed: false,
        groupId: id,
        createdAt: Date.now(),
      };

      const updated = [newTask, ...allTasks];
      await saveTasks(updated);

      setLocalTasks((prev) => [newTask, ...prev]);
      setNewItem("");
      Keyboard.dismiss();
    } catch (err) {
      if (err instanceof AppError) {
        Alert.alert("Novo item", err.message);
      } else {
        Alert.alert("Novo item", "Não foi possível criar");
      }
    }
  }

  async function handleToggle(idItem: string) {
    if (isShared) {
      const current = sharedItems.find((i) => i.id === idItem);
      if (!current) return;

      setSharedItems((prev) =>
        prev.map((i) => (i.id === idItem ? { ...i, isDone: !i.isDone } : i)),
      );

      try {
        await updateSharedItem(id, idItem, {
          isDone: !current.isDone,
        });
      } catch {
        await bootstrap();
      }
      return;
    }

    const all = await loadTasks();
    const updated = all.map((t) =>
      t.id === idItem ? { ...t, completed: !t.completed } : t,
    );

    await saveTasks(updated);
    setLocalTasks(updated.filter((t) => t.groupId === id));
  }

  async function handleRemove(idItem: string) {
    if (isShared) {
      await deleteSharedItem(id, idItem);
      await refreshSharedItems();
      return;
    }

    await removeTaskById(idItem);
    const all = await loadTasks();
    setLocalTasks(all.filter((t) => t.groupId === id));
  }

  async function handleResetRoutine() {
    if (isShared) return;
    if (listType !== "routine") return;

    try {
      const allTasks = await loadTasks();

      const updated = allTasks.map((task) =>
        task.groupId === id ? { ...task, completed: false } : task,
      );

      await saveTasks(updated);
      setLocalTasks(updated.filter((t) => t.groupId === id));
    } catch {
      Alert.alert("Rotina", "Não foi possível reiniciar a rotina.");
    }
  }

  async function handleShare() {
    try {
      const invite = await createSharedInvite(id);

      const message =
        `Convite para colaborar na lista "${title}"\n\n` +
        `Token:\n${invite.token}\n\n` +
        `Se o link não abrir, use "Entrar por token" no app.\n\n` +
        `Abrir no app:\n` +
        `todolistrevvos://todo/invite/${invite.token}`;

      await Share.share({ message });
    } catch {
      Alert.alert("Erro", "Não foi possível compartilhar");
    }
  }

  async function handleJoinByToken(token: string) {
    try {
      const result = await joinSharedInviteByToken(token);
      setShowJoinByToken(false);

      Alert.alert("Tudo certo", "Você entrou na lista compartilhada.", [
        {
          text: "Ok",
          onPress: () => {
            router.replace({
              pathname: "/lists/[id]",
              params: {
                id: result.listId,
                scope: "shared",
              },
            });
          },
        },
      ]);
    } catch (e: any) {
      Alert.alert(
        "Entrar por token",
        e?.response?.data?.message ?? "Não foi possível entrar na lista",
      );
    }
  }

  function handleFocusInput() {
    inputRef.current?.focus();
  }

  if (loading) {
    return (
      <Container>
        <LoadingWrap>
          <ActivityIndicator />
        </LoadingWrap>
      </Container>
    );
  }

  return (
    <Container>
      <HeaderArea>
        <TopRow>
          <BackButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#FFF" />
          </BackButton>

          <ActionsRow>
            {listType === "routine" && !isShared ? (
              <ActionButton onPress={handleResetRoutine}>
                <ActionButtonText>Reiniciar</ActionButtonText>
              </ActionButton>
            ) : null}

            {isShared ? (
              <>
                <ActionButton onPress={() => setShowJoinByToken(true)}>
                  <ActionButtonText>Token</ActionButtonText>
                </ActionButton>

                <ActionButton onPress={handleShare}>
                  <ActionButtonText>Compartilhar</ActionButtonText>
                </ActionButton>
              </>
            ) : null}
          </ActionsRow>
        </TopRow>

        <ListTitle>{title}</ListTitle>

        <Badge shared={isShared}>
          <BadgeText>{getListTypeLabel(listType, isShared)}</BadgeText>
        </Badge>

        <ListMeta>{getMetaDescription(listType, isShared)}</ListMeta>

        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>

        <ProgressMeta>
          <ProgressNumber>
            {completed}/{total}
          </ProgressNumber>
          <ProgressText>{getProgressLabel(listType)}</ProgressText>
        </ProgressMeta>

        <QuickStatsRow>
          <QuickStat>
            <QuickStatValue>{total}</QuickStatValue>
            <QuickStatLabel>Total</QuickStatLabel>
          </QuickStat>

          <QuickStat>
            <QuickStatValue>{completed}</QuickStatValue>
            <QuickStatLabel>Feitos</QuickStatLabel>
          </QuickStat>

          <QuickStat>
            <QuickStatValue>{pending}</QuickStatValue>
            <QuickStatLabel>Pendentes</QuickStatLabel>
          </QuickStat>
        </QuickStatsRow>
      </HeaderArea>

      <Content>
        <FormCard>
          <InputRow>
            <StyledInput
              ref={inputRef}
              placeholder="Adicionar item"
              placeholderTextColor="#808080"
              onChangeText={setNewItem}
              value={newItem}
              onSubmitEditing={handleAddItem}
              returnKeyType="done"
            />
            <ButtonIcon icon="add-circle-outline" onPress={handleAddItem} />
          </InputRow>
        </FormCard>

        <FlatList
          data={itemsAsTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Tasks
              task={item}
              onToggle={() => handleToggle(item.id)}
              onRemove={() => handleRemove(item.id)}
            />
          )}
          ListEmptyComponent={() => (
            <EmptyWrap>
              <ListEmpty
                title="Lista vazia"
                text={
                  listType === "shopping"
                    ? "Adicione itens para montar sua lista de compras."
                    : listType === "routine"
                      ? "Adicione hábitos para começar sua rotina."
                      : "Adicione tarefas para começar."
                }
              />
            </EmptyWrap>
          )}
          contentContainerStyle={{
            paddingBottom: 140,
            ...(itemsAsTasks.length === 0 ? { flexGrow: 1 } : null),
          }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </Content>

      <Fab onPress={handleFocusInput}>
        <FabText>+</FabText>
      </Fab>

      <JoinSharedListModal
        visible={showJoinByToken}
        onClose={() => setShowJoinByToken(false)}
        onConfirm={handleJoinByToken}
      />
    </Container>
  );
}

import { DEFAULT_GROUP_ID } from "@/src/constants/app";
import { STORAGE_KEYS } from "@/src/constants/storage";
import type { Group, ListType } from "@/src/types/group";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../types/task";

export async function loadGroups(): Promise<Group[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.groups);
  return raw ? JSON.parse(raw) : [];
}

export async function saveGroups(groups: Group[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.groups, JSON.stringify(groups));
}

export async function ensureDefaultGroup(): Promise<Group[]> {
  const groups = await loadGroups();
  const hasDefault = groups.some((g) => g.id === DEFAULT_GROUP_ID);
  if (hasDefault) return groups;
  const def: Group = {
    id: DEFAULT_GROUP_ID,
    title: "Geral",
    createdAt: Date.now(),
  };
  const next = [def, ...groups];
  await saveGroups(next);
  return next;
}

export async function addGroup(
  title: string,
  scope?: string,
  type: ListType = "task",
): Promise<Group> {
  const groups = await loadGroups();

  const t = title.trim();

  if (!t) throw new Error("Título inválido");

  const exists = groups.some((g) => g.title.toLowerCase() === t.toLowerCase());

  if (exists) throw new Error("Já existe um grupo com esse nome.");

  const newGroup: Group = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    title: t,
    createdAt: Date.now(),
    type,
  };

  await saveGroups([newGroup, ...groups]);

  return newGroup;
}

export async function removeGroup(groupId: string) {
  if (groupId === DEFAULT_GROUP_ID) {
    throw new Error('A lista "Geral" não pode ser removida.');
  }

  const groupsRaw = await AsyncStorage.getItem(STORAGE_KEYS.groups);
  const tasksRaw = await AsyncStorage.getItem(STORAGE_KEYS.tasks);

  const groups: Group[] = groupsRaw ? JSON.parse(groupsRaw) : [];
  const tasks: Task[] = tasksRaw ? JSON.parse(tasksRaw) : [];

  const nextGroups = groups.filter((g) => g.id !== groupId);
  const nextTasks = tasks.filter((t) => t.groupId !== groupId);

  await AsyncStorage.multiSet([
    [STORAGE_KEYS.groups, JSON.stringify(nextGroups)],
    [STORAGE_KEYS.tasks, JSON.stringify(nextTasks)],
  ]);

  return {
    groups: nextGroups,
    tasks: nextTasks,
  };
}

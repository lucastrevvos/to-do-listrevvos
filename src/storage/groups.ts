// src/storage/groups.ts
import { DEFAULT_GROUP_ID } from "@/src/constants/app";
import { STORAGE_KEYS } from "@/src/constants/storage";
import type { Group } from "@/src/types/group";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export async function addGroup(title: string): Promise<Group> {
  const groups = await loadGroups();
  const t = title.trim();
  if (!t) throw new Error("Título inválido");

  const exists = groups.some((g) => g.title.toLowerCase() === t.toLowerCase());
  if (exists) throw new Error("Já existe um grupo com esse nome.");

  const newGroup: Group = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    title: t,
    createdAt: Date.now(),
  };
  await saveGroups([newGroup, ...groups]);
  return newGroup;
}

export async function removeGroup(groupId: string): Promise<void> {
  if (groupId === DEFAULT_GROUP_ID) return;
  const groups = await loadGroups();
  const next = groups.filter((g) => g.id !== groupId);
  await saveGroups(next);
}

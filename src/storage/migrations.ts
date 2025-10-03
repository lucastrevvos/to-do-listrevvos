import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_GROUP_ID } from "../constants/app";
import { STORAGE_KEYS } from "../constants/storage";
import { Group } from "../types/group";
import { Task } from "../types/task";

const DEFAULT_GROUP: Group = {
  id: DEFAULT_GROUP_ID,
  title: "Geral",
  createdAt: Date.now(),
};

export async function migrateIfNeeded() {
  const rawVer = await AsyncStorage.getItem(STORAGE_KEYS.schemaVersion);
  const ver = rawVer ? Number(rawVer) : 1;

  if (ver < 2) {
    // 1) Garante que @trevvos/groups existe com o grupo "Geral"
    const groupsRaw = await AsyncStorage.getItem(STORAGE_KEYS.groups);
    const groups: Group[] = groupsRaw ? JSON.parse(groupsRaw) : [];
    const hasDefault = groups.some((g) => g.id === DEFAULT_GROUP_ID);
    const newGroups = hasDefault ? groups : [DEFAULT_GROUP, ...groups];

    // 2) Migra tasks antigas adicionando groupId + createdAt
    const taskRaw = await AsyncStorage.getItem(STORAGE_KEYS.tasks);
    const tasks: Task[] = taskRaw ? JSON.parse(taskRaw) : [];
    const migrated: Task[] = tasks.map((t: any) => ({
      id: t.id,
      title: t.title,
      completed: !!t.completed,
      groupId: t.groupId ?? DEFAULT_GROUP_ID,
      createdAt: t.createdAt ?? Date.now(),
    }));

    // 3) Persiste e avança versão do schema

    await AsyncStorage.multiSet([
      [STORAGE_KEYS.groups, JSON.stringify(newGroups)],
      [STORAGE_KEYS.tasks, JSON.stringify(migrated)],
      [STORAGE_KEYS.schemaVersion, "2"],
    ]);
  }
}

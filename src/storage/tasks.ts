// src/storage/tasks.ts
import { STORAGE_KEYS } from "@/src/constants/storage";
import type { Task } from "@/src/types/task";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TASKS_KEY = STORAGE_KEYS.tasks;

export async function saveTasks(tasks: Task[]): Promise<void> {
  const json = JSON.stringify(tasks);
  await AsyncStorage.setItem(TASKS_KEY, json);
}

export async function loadTasks(): Promise<Task[]> {
  const raw = await AsyncStorage.getItem(TASKS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Task[];
  } catch {
    // se corromper, evita crash
    return [];
  }
}

export async function removeTaskById(id: string): Promise<void> {
  const current = await loadTasks();
  const next = current.filter((t) => t.id !== id);
  await saveTasks(next);
}

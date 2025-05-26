import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../types/task";
import { TASKS_STORAGE_KEY } from "./storageConfig";

export async function saveTasks(tasks: Task[]) {
  try {
    const json = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, json);
  } catch (error) {
    throw error;
  }
}

export async function loadTasks() {
  try {
    const storage = await AsyncStorage.getItem(TASKS_STORAGE_KEY);

    const tasks = storage ? JSON.parse(storage) : [];

    return tasks;
  } catch (error) {
    throw error;
  }
}

export async function removeTaskById(id: string) {
  try {
    const storage = await AsyncStorage.getItem(TASKS_STORAGE_KEY);

    const tasks: Task[] = storage ? JSON.parse(storage) : [];

    const tasksFiltered = tasks.filter((task) => task.id !== id);

    await AsyncStorage.setItem(
      TASKS_STORAGE_KEY,
      JSON.stringify(tasksFiltered)
    );
  } catch (error) {
    throw error;
  }
}

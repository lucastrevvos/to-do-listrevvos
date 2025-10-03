import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/storage";
import { Group } from "../types/group";

export async function loadGroups(): Promise<Group[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.groups);
  return raw ? JSON.parse(raw) : [];
}

export async function saveGroups(groups: Group[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.groups, JSON.stringify(groups));
}

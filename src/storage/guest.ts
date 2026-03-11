import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const KEY = "@trevvos/guestId";

export async function getOrCreateGuestId() {
  const existing = await AsyncStorage.getItem(KEY);
  if (existing) return existing;

  const id = Crypto.randomUUID(); // UUID v4 válido
  await AsyncStorage.setItem(KEY, id);
  return id;
}
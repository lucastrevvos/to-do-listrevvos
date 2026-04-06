import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@trevvos/guest-id";

function generateGuestId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  // fallback simples caso randomUUID não exista
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export async function getGuestId(): Promise<string> {
  const existing = await AsyncStorage.getItem(KEY);
  if (existing) return existing;

  const newId = generateGuestId();
  await AsyncStorage.setItem(KEY, newId);
  return newId;
}

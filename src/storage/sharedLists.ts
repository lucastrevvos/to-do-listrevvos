import { todoApi } from "@/src/services/todoApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@trevvos/sharedLists";

export type SharedList = {
  id: string;
  title: string;
  role: "OWNER" | "EDITOR";
};

/**
 * Busca listas compartilhadas no backend
 * Atualiza cache local
 * Sempre retorna algo (mesmo offline)
 */
export async function fetchSharedListsFromApi(): Promise<SharedList[]> {
  try {
    const { data } = await todoApi.get<SharedList[]>("/v1/todo/shared-lists");

    // salva cache
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    return data;
  } catch (error) {
    console.warn("Erro ao buscar shared lists, usando cache local.");

    // fallback para cache
    const cached = await AsyncStorage.getItem(STORAGE_KEY);
    return cached ? (JSON.parse(cached) as SharedList[]) : [];
  }
}

/**
 * Apenas carrega do cache (não chama API)
 */
export async function loadSharedListsCache(): Promise<SharedList[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as SharedList[]) : [];
}

/**
 * Limpa cache (opcional)
 */
export async function clearSharedListsCache() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

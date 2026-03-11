// src/services/sharedItems.ts
import { todoApi } from "@/src/services/todoApi";

export type SharedTodoItem = {
  id: string;
  listId: string;
  text: string;
  isDone: boolean;
  position: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  version?: number;  // se você retornar isso do backend, fica pronto
};

export async function fetchSharedItems(listId: string) {
  const { data } = await todoApi.get<SharedTodoItem[]>(
    `/v1/todo/shared-lists/${listId}/items`,
  );
  return data;
}

export async function createSharedItem(listId: string, text: string) {
  const payload = { text: text.trim() }; // CreateTodoItemDto
  const { data } = await todoApi.post<SharedTodoItem>(
    `/v1/todo/shared-lists/${listId}/items`,
    payload,
  );
  return data;
}

export async function updateSharedItem(
  listId: string,
  itemId: string,
  patch: { text?: string; isDone?: boolean; position?: number; version?: number },
) {
  // UpdateTodoItemDto
  const { data } = await todoApi.patch<SharedTodoItem>(
    `/v1/todo/shared-lists/${listId}/items/${itemId}`,
    patch,
  );
  return data;
}

export async function deleteSharedItem(listId: string, itemId: string) {
  await todoApi.delete(`/v1/todo/shared-lists/${listId}/items/${itemId}`);
}
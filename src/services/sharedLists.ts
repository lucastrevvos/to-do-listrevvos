import { todoApi } from "@/src/services/todoApi";

export type CreateSharedListResponse = {
  id: string;
  title: string;
  role?: "OWNER" | "EDITOR" | "VIEWER";
};

export async function createSharedList(title: string) {
  const { data } = await todoApi.post<CreateSharedListResponse>(
    "/v1/todo/shared-lists",
    {
      title,
    },
  );
  return data;
}

export async function leaveSharedList(listId: string) {
  console.log("Leaving shared list", listId);
  await todoApi.post(`/v1/todo/shared-lists/${listId}/leave`);
}

export async function deleteSharedList(listId: string) {
  await todoApi.delete(`/v1/todo/shared-lists/${listId}`);
}

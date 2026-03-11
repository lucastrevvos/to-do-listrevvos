import { todoApi } from "@/src/services/todoApi";

export type CreateSharedListResponse = {
  id: string;
  title: string;
  role?: "OWNER" | "EDITOR" | "VIEWER";
};

export async function createSharedList(title: string) {
  const { data } = await todoApi.post<CreateSharedListResponse>("/v1/todo/shared-lists", {
    title,
  });
  return data;
}
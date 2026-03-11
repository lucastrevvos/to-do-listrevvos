import { todoApi } from "@/src/services/todoApi";

export type CreateSharedInviteResponse = {
  token: string;
  role?: "EDITOR" | "VIEWER";
  expiresAt?: string;
  maxUses?: number;
  uses?: number;
  revoked?: boolean;
  deepLink?: string;
  webLink?: string;
};

type CreateSharedInviteInput = {
  role?: "EDITOR" | "VIEWER";
  expiresInDays?: number;
  maxUses?: number;
};

export async function createSharedInvite(
  listId: string,
  input?: CreateSharedInviteInput,
) {
  const { data } = await todoApi.post<CreateSharedInviteResponse>(
    `/v1/todo/shared-lists/${listId}/invites`,
    {
      role: input?.role ?? "EDITOR",
      expiresInDays: input?.expiresInDays ?? 7,
      maxUses: input?.maxUses ?? 10,
    },
  );

  return data;
}

export async function joinSharedInviteByToken(token: string) {
  const { data } = await todoApi.post<{ listId: string; joined: boolean }>(
    `/v1/todo/invites/${token}/join`,
  );
  return data;
}
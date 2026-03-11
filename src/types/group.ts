type GroupScope = "local" | "shared";

export type GroupRole = "OWNER" | "EDITOR" | "VIEWER";

export type Group = {
  id: string;
  title: string;
  color?: string;
  sort?: number;
  createdAt: number;

  scope?: GroupScope;
  remoteId?: string;
  role?: GroupRole;
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  groupId: string;
  createdAt: number;

  remoteId: string;
  remoteVersion: number;
  dirty?: boolean;
  deletedAt?: number;
};

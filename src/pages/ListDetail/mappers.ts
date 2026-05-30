import type { SharedTodoItem } from "@/src/services/sharedItems";
import type { Task } from "@/src/types/task";
import { sortTasksForDisplay } from "./helpers";

export function mapSharedItemsToTasks(
  items: SharedTodoItem[],
  groupId: string,
): Task[] {
  return sortTasksForDisplay(
    items.map((item) => ({
      id: item.id,
      title: item.text,
      completed: item.isDone,
      groupId,
      createdAt: new Date(item.createdAt).getTime(),
      remoteId: item.id,
      remoteVersion: item.version ?? 0,
    })),
  );
}

export function sortSharedItemsForDisplay(
  items: SharedTodoItem[],
): SharedTodoItem[] {
  return [...items].sort((a, b) => {
    if (a.isDone !== b.isDone) {
      return a.isDone ? 1 : -1;
    }

    const aCreatedAt = new Date(a.createdAt).getTime();
    const bCreatedAt = new Date(b.createdAt).getTime();
    const hasACreatedAt = Number.isFinite(aCreatedAt);
    const hasBCreatedAt = Number.isFinite(bCreatedAt);

    if (hasACreatedAt && hasBCreatedAt) {
      const byCreatedAt = aCreatedAt - bCreatedAt;
      if (byCreatedAt !== 0) return byCreatedAt;
    }

    if (hasACreatedAt) return -1;
    if (hasBCreatedAt) return 1;

    return `${a.text}:${a.id}`.localeCompare(`${b.text}:${b.id}`);
  });
}

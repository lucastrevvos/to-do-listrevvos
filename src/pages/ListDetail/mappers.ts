import type { SharedTodoItem } from "@/src/services/sharedItems";
import type { Task } from "@/src/types/task";

export function mapSharedItemsToTasks(
  items: SharedTodoItem[],
  groupId: string,
): Task[] {
  return items.map((item) => ({
    id: item.id,
    title: item.text,
    completed: item.isDone,
    groupId,
    createdAt: new Date(item.createdAt).getTime(),
    remoteId: item.id,
    remoteVersion: 0,
  }));
}

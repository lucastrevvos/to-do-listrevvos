import type { ListType } from "@/src/types/group";

export function getListTypeLabel(type: ListType, isShared: boolean) {
  if (isShared) return "Compartilhada";

  switch (type) {
    case "shopping":
      return "Compras";
    case "routine":
      return "Rotina";
    default:
      return "Tarefas";
  }
}

export function getMetaDescription(type: ListType, isShared: boolean) {
  if (isShared) {
    return "Lista colaborativa para uso em grupo.";
  }

  switch (type) {
    case "shopping":
      return "Lista ideal para compras e itens recorrentes.";
    case "routine":
      return "Lista reiniciavel para habitos e rotinas.";
    default:
      return "Lista pessoal para organizar suas tarefas.";
  }
}

export function getInputPlaceholder(type: ListType) {
  switch (type) {
    case "shopping":
      return "Adicionar item de compra";
    case "routine":
      return "Adicionar habito";
    default:
      return "Adicionar tarefa";
  }
}

export function getEmptyText(type: ListType) {
  switch (type) {
    case "shopping":
      return "Adicione o primeiro item de compra.";
    case "routine":
      return "Adicione o primeiro habito da rotina.";
    default:
      return "Adicione a primeira tarefa.";
  }
}

type DisplayTask = {
  completed: boolean;
  createdAt?: number;
  id?: string;
  title?: string;
};

function getStableText(item: DisplayTask) {
  return `${item.title ?? ""}:${item.id ?? ""}`;
}

export function sortTasksForDisplay<T extends DisplayTask>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    const aCreatedAt =
      typeof a.createdAt === "number" && Number.isFinite(a.createdAt)
        ? a.createdAt
        : null;
    const bCreatedAt =
      typeof b.createdAt === "number" && Number.isFinite(b.createdAt)
        ? b.createdAt
        : null;

    if (aCreatedAt !== null && bCreatedAt !== null) {
      const byCreatedAt = aCreatedAt - bCreatedAt;
      if (byCreatedAt !== 0) return byCreatedAt;
    }

    if (aCreatedAt !== null) return -1;
    if (bCreatedAt !== null) return 1;

    return getStableText(a).localeCompare(getStableText(b));
  });
}

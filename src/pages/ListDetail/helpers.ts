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

export function sortTasksByCompleted<T extends { completed: boolean }>(
  items: T[],
) {
  const pending = items.filter((item) => !item.completed);
  const done = items.filter((item) => item.completed);
  return [...pending, ...done];
}

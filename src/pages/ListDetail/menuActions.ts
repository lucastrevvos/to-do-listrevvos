import type { AlertButton } from "react-native";

export type ListRole = "OWNER" | "EDITOR" | null;

type BuildMenuActionsParams = {
  isShared: boolean;
  role: ListRole;
  completedCount: number;
  onShare: () => void;
  onUncheckAll: () => void;
  onLeave: () => void;
  onDelete: () => void;
  onMoreOptions: () => void;
};

type MenuActionGroups = {
  primary: AlertButton[];
  more: AlertButton[];
};

export function buildListMenuActions({
  isShared,
  role,
  completedCount,
  onShare,
  onUncheckAll,
  onLeave,
  onDelete,
  onMoreOptions,
}: BuildMenuActionsParams): MenuActionGroups {
  const primary: AlertButton[] = [];
  const more: AlertButton[] = [];

  if (isShared) {
    primary.push({
      text: "Compartilhar",
      onPress: onShare,
    });
  }

  if (completedCount > 0) {
    primary.push({
      text: "Desmarcar todas",
      onPress: onUncheckAll,
    });
  }

  if (isShared && role === "EDITOR") {
    more.push({
      text: "Sair da lista",
      style: "destructive",
      onPress: onLeave,
    });
  }

  if (isShared && role === "OWNER") {
    more.push({
      text: "Excluir lista",
      style: "destructive",
      onPress: onDelete,
    });
  }

  if (more.length > 0) {
    primary.push({
      text: "Mais opções",
      onPress: onMoreOptions,
    });
  }

  return { primary, more };
}

export function withCancel(actions: AlertButton[]): AlertButton[] {
  return [...actions, { text: "Cancelar", style: "cancel" }];
}

import { AppHeader } from "@/src/components/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import {
  ActionButton,
  Badge,
  BadgeText,
  HeaderArea,
  HeaderDetails,
  ListMeta,
  MetaRow,
} from "../styles";
import { ListProgressSummary } from "./ListProgressSummary";

type Props = {
  title: string;
  badgeLabel: string;
  description: string;
  isShared: boolean;
  total: number;
  completed: number;
  pending: number;
  progress: number;
  showMenu: boolean;
  onBack: () => void;
  onOpenMenu: () => void;
};

export function ListDetailHeader({
  title,
  badgeLabel,
  description,
  isShared,
  total,
  completed,
  pending,
  progress,
  showMenu,
  onBack,
  onOpenMenu,
}: Props) {
  return (
    <HeaderArea>
      <AppHeader
        title={title}
        showBackButton
        onBackPress={onBack}
        rightAction={
          showMenu ? (
            <ActionButton onPress={onOpenMenu}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#FFF" />
            </ActionButton>
          ) : null
        }
      />

      <HeaderDetails>
        <MetaRow>
          <Badge shared={isShared}>
            <BadgeText>{badgeLabel}</BadgeText>
          </Badge>

          <ListMeta numberOfLines={1}>{description}</ListMeta>
        </MetaRow>

        <ListProgressSummary
          total={total}
          completed={completed}
          pending={pending}
          progress={progress}
        />
      </HeaderDetails>
    </HeaderArea>
  );
}

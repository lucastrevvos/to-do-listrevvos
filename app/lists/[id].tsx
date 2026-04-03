import { ListDetail } from "@/src/pages/ListDetail";
import { useLocalSearchParams } from "expo-router";

export default function ListDetailRoute() {
  const { id, scope } = useLocalSearchParams<{
    id: string;
    scope: "local" | "shared";
  }>();

  return <ListDetail id={String(id ?? "")} scope={(scope as "local" | "shared") ?? "local"} />;
}
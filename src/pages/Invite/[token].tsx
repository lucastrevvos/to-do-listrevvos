import { Invite } from "@/src/pages/Invite";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function InviteRoute() {
  const { token } = useLocalSearchParams<{ token: string }>();
  return <Invite token={String(token ?? "")} />;
}
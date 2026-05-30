import { todoApi } from "@/src/services/todoApi";
import type { ListType } from "@/src/types/group";
import { AppError } from "@/src/utils/AppError";

type AiSuggestionsPayload = {
  title: string;
  type: ListType;
  existingItems: string[];
  locale: "pt-BR";
};

type AiSuggestionsResponse = {
  suggestions?: string[];
};

const AI_SUGGESTIONS_ENABLED =
  process.env.EXPO_PUBLIC_AI_SUGGESTIONS_ENABLED === "true";

const AI_SUGGESTIONS_ENDPOINT =
  process.env.EXPO_PUBLIC_AI_SUGGESTIONS_ENDPOINT ?? "";

export function isAiSuggestionsEnabled() {
  return AI_SUGGESTIONS_ENABLED && AI_SUGGESTIONS_ENDPOINT.length > 0;
}

function normalizeSuggestion(value: unknown) {
  if (typeof value !== "string") return null;

  const text = value.trim();
  return text.length > 0 ? text : null;
}

export async function requestAiListSuggestions(
  payload: AiSuggestionsPayload,
): Promise<string[]> {
  if (!isAiSuggestionsEnabled()) {
    throw new AppError("Sugestões por IA ainda não estão habilitadas.");
  }

  const { data } = await todoApi.post<AiSuggestionsResponse | string[]>(
    AI_SUGGESTIONS_ENDPOINT,
    payload,
  );

  const rawSuggestions = Array.isArray(data) ? data : data.suggestions ?? [];

  return rawSuggestions
    .map(normalizeSuggestion)
    .filter((suggestion): suggestion is string => Boolean(suggestion))
    .slice(0, 7);
}

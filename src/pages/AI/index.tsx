import { AppHeader } from "@/src/components/AppHeader";
import { isAiSuggestionsEnabled } from "@/src/services/aiSuggestions";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Badge,
  BadgeText,
  Card,
  CardDescription,
  CardTitle,
  Container,
  ExampleChip,
  ExampleText,
  ExamplesGrid,
  FooterText,
  HeroCard,
  HeroMark,
  HeroText,
  HeroTitle,
  PrimaryButton,
  PrimaryButtonText,
  RoadmapItem,
  RoadmapText,
  SectionTitle,
  StatusBadge,
  StatusText,
} from "./styles";

const flowMark = require("../../../assets/images/flow-mark.png");

const examples = ["Viagem", "Compras da semana", "Rotina de treino"];

const roadmapItems = [
  "Organizar lista por prioridade",
  "Sugerir rotina com base em hábitos",
  "Identificar itens duplicados",
  "Resumir pendências",
];

export function AIPage() {
  const router = useRouter();
  const suggestionsEnabled = isAiSuggestionsEnabled();

  return (
    <Container>
      <AppHeader
        title="Inteligência Trevvos"
        subtitle="Recursos inteligentes para organizar suas listas com mais clareza."
      />

      <HeroCard>
        <HeroMark
          source={flowMark}
          accessible={false}
          accessibilityIgnoresInvertColors
        />

        <Badge>
          <BadgeText>IA no Flow</BadgeText>
        </Badge>

        <HeroTitle>Sugestões úteis, sempre sob seu controle</HeroTitle>
        <HeroText>
          O Trevvos Flow já está preparado para sugerir itens e ajudar você a
          começar ou completar listas de tarefas, compras e rotinas.
        </HeroText>
      </HeroCard>

      <Card>
        <StatusBadge available={suggestionsEnabled}>
          <Ionicons
            name={suggestionsEnabled ? "checkmark-circle" : "time-outline"}
            size={14}
            color={suggestionsEnabled ? "#06201B" : "#F2F2F2"}
          />
          <StatusText available={suggestionsEnabled}>
            {suggestionsEnabled ? "Disponível agora" : "Em preparação"}
          </StatusText>
        </StatusBadge>

        <CardTitle>Sugestões inteligentes de itens</CardTitle>
        <CardDescription>
          O Trevvos Flow pode sugerir itens com base no nome da lista, no tipo
          da lista e no que você já adicionou.
        </CardDescription>
        <CardDescription>
          Você revisa tudo antes de adicionar. Nada é inserido automaticamente.
        </CardDescription>

        {suggestionsEnabled ? (
          <>
            <CardDescription>
              Instrução: abra uma lista e toque em Sugerir itens.
            </CardDescription>

            <ExamplesGrid>
              {examples.map((example) => (
                <ExampleChip key={example}>
                  <ExampleText>{example}</ExampleText>
                </ExampleChip>
              ))}
            </ExamplesGrid>

            <PrimaryButton onPress={() => router.push("/")}>
              <PrimaryButtonText>Ir para listas</PrimaryButtonText>
              <Ionicons name="arrow-forward" size={16} color="#061B20" />
            </PrimaryButton>
          </>
        ) : (
          <CardDescription>
            Este recurso já está preparado e será ativado quando a IA estiver
            configurada no ambiente.
          </CardDescription>
        )}
      </Card>

      <SectionTitle>Próximos recursos</SectionTitle>

      <Card>
        <CardDescription>
          Ideias futuras para a área de inteligência do Trevvos Flow:
        </CardDescription>

        {roadmapItems.map((item) => (
          <RoadmapItem key={item}>
            <Ionicons name="sparkles-outline" size={15} color="#31D8C7" />
            <RoadmapText>{item}</RoadmapText>
          </RoadmapItem>
        ))}
      </Card>

      <FooterText>A IA aparece quando o ambiente estiver configurado.</FooterText>
    </Container>
  );
}

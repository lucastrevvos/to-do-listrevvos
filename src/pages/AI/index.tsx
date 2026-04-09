import { AppHeader } from "@/src/components/AppHeader";
import React from "react";
import {
  Badge,
  BadgeText,
  Card,
  CardDescription,
  CardTitle,
  Container,
  FeatureCard,
  FeatureDescription,
  FeatureTitle,
  FooterText,
  HeroCard,
  HeroLabel,
  HeroText,
  HeroTitle,
  PremiumCard,
  PremiumDescription,
  PremiumTitle,
  SectionTitle,
} from "./styles";

export function AIPage() {
  return (
    <Container>
      <AppHeader
        title="IA"
        subtitle="Os recursos inteligentes chegarão na v3 do TodoList Trevvos"
      />

      <HeroCard>
        <Badge>
          <BadgeText>Premium</BadgeText>
        </Badge>

        <HeroLabel>Próxima evolução do app</HeroLabel>
        <HeroTitle>
          IA para transformar listas em algo realmente inteligente
        </HeroTitle>
        <HeroText>
          A versão atual foca em listas, colaboração e organização. Na v3, o
          TodoList Trevvos vai ganhar recursos premium com IA para gerar,
          melhorar e sugerir listas automaticamente.
        </HeroText>
      </HeroCard>

      <SectionTitle>O que virá na v3</SectionTitle>

      <FeatureCard>
        <FeatureTitle>✨ Gerar lista por objetivo</FeatureTitle>
        <FeatureDescription>
          Exemplo: “manhã saudável”, “checklist de viagem”, “lista de compras
          para uma semana” ou “planejamento para churrasco”.
        </FeatureDescription>
      </FeatureCard>

      <FeatureCard>
        <FeatureTitle>🧠 Transformar texto em lista</FeatureTitle>
        <FeatureDescription>
          Escreva algo solto e a IA organiza em itens claros e prontos para uso.
        </FeatureDescription>
      </FeatureCard>

      <FeatureCard>
        <FeatureTitle>🛒 Sugerir itens faltando</FeatureTitle>
        <FeatureDescription>
          A IA poderá completar listas com base no contexto e no tipo da lista:
          compras, tarefas ou rotinas.
        </FeatureDescription>
      </FeatureCard>

      <FeatureCard>
        <FeatureTitle>🔁 Rotinas inteligentes</FeatureTitle>
        <FeatureDescription>
          Listas de rotina poderão ser sugeridas e ajustadas para objetivos como
          foco, saúde, organização e hábitos diários.
        </FeatureDescription>
      </FeatureCard>

      <SectionTitle>Plano premium</SectionTitle>

      <PremiumCard>
        <PremiumTitle>Recursos premium com IA</PremiumTitle>
        <PremiumDescription>
          A IA será liberada como parte da evolução premium do app, trazendo
          geração de listas, organização avançada e sugestões inteligentes.
        </PremiumDescription>
      </PremiumCard>

      <Card>
        <CardTitle>Estado atual</CardTitle>
        <CardDescription>
          Nesta v2, o foco está em consolidar a base do produto: listas locais,
          compartilhadas, tipos de lista e experiência de uso.
        </CardDescription>
      </Card>

      <FooterText>TodoList Trevvos • IA prevista para a v3</FooterText>
    </Container>
  );
}

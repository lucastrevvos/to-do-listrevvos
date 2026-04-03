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
      <HeroCard>
        <Badge>
          <BadgeText>Premium</BadgeText>
        </Badge>

        <HeroLabel>Assistente Trevvos</HeroLabel>
        <HeroTitle>IA para transformar listas em algo inteligente</HeroTitle>
        <HeroText>
          Em breve, o Trevvos vai gerar listas, sugerir itens, organizar
          compras e ajudar você a planejar tarefas com inteligência.
        </HeroText>
      </HeroCard>

      <SectionTitle>O que vem aí</SectionTitle>

      <FeatureCard>
        <FeatureTitle>✨ Gerar lista com IA</FeatureTitle>
        <FeatureDescription>
          Crie listas a partir de comandos como: “lista de compras para 1 semana”
          ou “checklist de viagem para praia”.
        </FeatureDescription>
      </FeatureCard>

      <FeatureCard>
        <FeatureTitle>🧠 Sugerir itens automaticamente</FeatureTitle>
        <FeatureDescription>
          A IA poderá sugerir itens com base no contexto da lista e no seu
          histórico de uso.
        </FeatureDescription>
      </FeatureCard>

      <FeatureCard>
        <FeatureTitle>🛒 Organizar listas por contexto</FeatureTitle>
        <FeatureDescription>
          Exemplo: separar uma lista de compras por hortifruti, padaria,
          limpeza e mercado.
        </FeatureDescription>
      </FeatureCard>

      <SectionTitle>Premium</SectionTitle>

      <PremiumCard>
        <PremiumTitle>Recursos premium com IA</PremiumTitle>
        <PremiumDescription>
          A versão premium vai liberar assistente inteligente, automações,
          organização avançada e sugestões personalizadas.
        </PremiumDescription>
      </PremiumCard>

      <Card>
        <CardTitle>Estado atual</CardTitle>
        <CardDescription>
          O núcleo colaborativo já está funcionando. A próxima evolução será
          colocar a inteligência em cima das listas.
        </CardDescription>
      </Card>

      <FooterText>Em breve disponível dentro do Trevvos.</FooterText>
    </Container>
  );
}
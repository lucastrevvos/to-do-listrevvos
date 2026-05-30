# TASK: Fase 1 da melhoria da tela de detalhe da lista

## Objetivo
Compactar e reorganizar a tela de detalhe da lista para aumentar o espaço útil dos itens, melhorar hierarquia visual e manter o fluxo atual de adicionar, concluir, remover, compartilhar e revisar itens.

## Escopo permitido
- Ajustar layout e densidade de `src/pages/ListDetail/index.tsx`.
- Ajustar estilos em `src/pages/ListDetail/styles.ts`.
- Ajustar `src/components/Tasks` e `src/components/ListEmpty` apenas se necessário para densidade e consistência.
- Manter suporte a listas locais e compartilhadas.
- Manter tratamento por tipo de lista: tarefa, compras e rotina.

## Escopo proibido
- Não alterar notificações.
- Não alterar storage, migrations ou modelos de domínio.
- Não alterar APIs, serviços compartilhados ou contratos remotos.
- Não alterar deep links, package, bundle id ou scheme.
- Não alterar regras de role/permissão.
- Não trocar a navegação ou rotas existentes.

## Regras técnicas
- Fazer refactor incremental, sem criar arquitetura pesada.
- Priorizar menos altura no topo e mais espaço para itens.
- Preservar os handlers atuais de criar, concluir, remover, refresh, compartilhar, sair/excluir e desmarcar todas.
- Evitar novas bibliotecas.
- Usar styled-components conforme padrão atual.
- Não esconder ações destrutivas sem uma alternativa clara.

## Critérios de aceite
- Header da lista fica mais compacto e sem repetição de título.
- Contadores/progresso ocupam menos espaço e continuam legíveis.
- Input de novo item continua acessível e fácil de tocar.
- Lista renderiza mais itens na primeira dobra.
- Estados loading e vazio continuam funcionando.
- Fluxos local e compartilhado continuam funcionando.
- Menu de ações continua disponível quando aplicável.
- `npm run lint` passa sem errors.
- `npx tsc --noEmit` passa sem erros.

## Arquivos prováveis
- `src/pages/ListDetail/index.tsx`
- `src/pages/ListDetail/styles.ts`
- `src/components/Tasks/index.tsx`
- `src/components/Tasks/styles.ts`
- `src/components/ListEmpty/index.tsx`
- `src/components/ListEmpty/styles.ts`

## Testes
- `npm run lint`
- `npx tsc --noEmit`
- Validação visual em device/emulador para lista local com muitos itens, lista vazia, lista compartilhada e telas pequenas.

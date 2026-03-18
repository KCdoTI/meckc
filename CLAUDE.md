# CLAUDE.md — Guia de Desenvolvimento: Mente em Construção

## Visão Geral do Projeto

Plataforma educacional para a eletiva "Mente em Construção" do Professor KC. Permite que estudantes desenvolvam ideias de projetos digitais com mentoria de IA (Google Gemini).

**Stack:** React 19 + TypeScript + Vite + Tailwind CSS 4 + @google/genai

---

## Estrutura de Arquivos

```
src/
  App.tsx                  # Componente principal, roteamento e estado global
  main.tsx                 # Entry point React
  types.ts                 # Interface Idea (modelo de dados principal)
  index.css                # Estilos globais, Tailwind, fontes
  components/
    GeminiAssistant.tsx    # Widget flutuante de chat com IA (canto inferior direito)
    IdeaWizard.tsx         # Formulário multi-etapas para criação de ideias (4 steps)
    IdeaCard.tsx           # Card de exibição de cada projeto
  services/
    gemini.ts              # Integração com a API do Gemini (3 funções)
    pdfService.ts          # Exportação de projetos como PDF (jsPDF + html2canvas)
```

---

## Integração com Gemini AI

### Variável de Ambiente
- **No Vercel:** a variável está cadastrada como `Gemini_API_Key` (esta capitalização específica)
- **Localmente (dev):** usar `.env` com `Gemini_API_Key=sua_chave` OU `GEMINI_API_KEY=sua_chave`

### Como a chave é injetada
O `vite.config.ts` usa `define` para expor a variável ao bundle client-side:
```ts
'process.env.GEMINI_API_KEY': JSON.stringify(env.Gemini_API_Key || env.GEMINI_API_KEY),
```
Isso garante compatibilidade tanto com o nome do Vercel (`Gemini_API_Key`) quanto com o padrão alternativo.

### Funções disponíveis em `src/services/gemini.ts`
| Função | Modelo | Uso |
|---|---|---|
| `getRealTimeFeedback()` | gemini-3.1-pro-preview (ThinkingLevel.HIGH) | Feedback socrático em tempo real nos campos do wizard |
| `generateIdeaSuggestions()` | gemini-3-flash-preview | Sugestões de melhoria para uma ideia existente |
| `brainstormProblem()` | gemini-3-flash-preview | Lista 3 problemas reais de adolescentes por tema |

> **Aviso de segurança:** por ser uma aplicação 100% client-side, a API key fica embarcada no bundle de produção e pode ser vista no código-fonte do browser. Para uso acadêmico/educacional controlado isso é aceitável, mas nunca compartilhe a chave publicamente ou use em produção aberta.

---

## Deploy no Vercel

### Configuração atual
- **`vercel.json`** criado com rewrite SPA: todas as rotas redirecionam para `index.html`
- Vercel auto-detecta Vite; build command: `vite build`; output dir: `dist`

### Passos para deploy
1. Importar o repositório no Vercel
2. Garantir que a variável de ambiente `Gemini_API_Key` esteja configurada em **Settings > Environment Variables**
3. Deploy automático a cada push na branch principal

### Variáveis de Ambiente necessárias no Vercel
| Nome | Descrição |
|---|---|
| `Gemini_API_Key` | Chave da API do Google Gemini |

---

## Modelo de Dados

```typescript
interface Idea {
  id: string;              // ID único aleatório
  name: string;            // Nome do projeto
  problem: string;         // Problema que resolve
  targetAudience: string;  // Público-alvo
  solution: string;        // Descrição da solução
  howItWorks: string;      // Como funciona (mecânica)
  whyUseful: string;       // Por que é útil
  differential: string;    // Diferencial competitivo
  expectedResult: string;  // Resultado esperado
  createdAt: number;       // Timestamp (ms)
}
```

Os projetos são persistidos em **localStorage** com a chave `mente_construcao_ideas`.

---

## Design System

- **Estética:** Neo-brutalist (bordas 2px, sombras duras, alto contraste)
- **Cor principal:** Verde (escala customizada do Tailwind)
- **Fontes:** Space Grotesk (títulos), Inter (corpo), JetBrains Mono (código)
- **Classes utilitárias customizadas:**
  - `.brutalist-card` — card branco com borda e sombra
  - `.brutalist-button` — botão com efeito de sombra

---

## Histórico de Alterações

### 2026-03-17 — Configuração para Vercel
- **`vite.config.ts`:** `define` atualizado para ler `Gemini_API_Key` (nome da variável no Vercel) com fallback para `GEMINI_API_KEY`
- **`vercel.json`:** Criado com rewrite SPA para suportar roteamento client-side no Vercel

### 2026-03-17 — Correção da geração de PDF
- **Problema:** `jspdf` estava na versão `^4.2.1`, que possui breaking changes na API (setFont, text com arrays, save). O `pdfService.ts` usa a API da v2.
- **Solução:** Downgrade para `^2.5.1` em `package.json`. Rodar `npm install` para aplicar.
- **Arquivo alterado:** `package.json`

# PRD — Quiz SQL Web App

## Visão Geral

Aplicação web interativa onde usuários testam e aprimoram seu conhecimento em SQL. O quiz cobre desde conceitos básicos de banco de dados até tópicos avançados, com perguntas no formato Verdadeiro ou Falso. O usuário faz login, responde 10 perguntas, recebe feedback imediato com explicação a cada resposta e tem seu score final salvo em um ranking público.

---

## Objetivos de Negócio

- Oferecer uma ferramenta gratuita de autoavaliação para quem está aprendendo ou praticando SQL
- Engajar usuários com ranking público competitivo, incentivando repetição e melhora
- Cobrir todos os níveis de conhecimento: iniciante, intermediário e avançado
- Ser leve, acessível e sem fricção — login simples, quiz direto ao ponto

---

## Público-alvo

- Estudantes de tecnologia e análise de dados
- Desenvolvedores iniciantes e intermediários
- Analistas e engenheiros de dados que querem revisar conceitos
- Profissionais se preparando para entrevistas técnicas

---

## Funcionalidades

### 1. Autenticação
- Login e cadastro via e-mail/senha usando Supabase Auth
- Opção de login com GitHub (OAuth) via Supabase
- Sessão persistida no navegador
- Usuário não autenticado pode ver o ranking, mas não jogar

### 2. Quiz
- 10 perguntas por sessão, sorteadas aleatoriamente do banco de perguntas
- Formato: **Verdadeiro ou Falso**
- Distribuição de dificuldade por sessão:
  - 3 perguntas nível Iniciante (beginner)
  - 3 perguntas nível Básico (basic)
  - 2 perguntas nível Intermediário (intermediate)
  - 2 perguntas nível Avançado (advanced)
- Cada pergunta exibida uma por vez, sem possibilidade de voltar
- Após o usuário responder: feedback imediato (✅ correto / ❌ errado) + explicação textual da resposta
- Botão "Próxima" para avançar após ver o feedback

### 3. Pontuação
- 10 pontos por resposta correta
- Score máximo por sessão: 100 pontos
- Score salvo no Supabase ao final de cada sessão (tabela `scores`)
- Histórico de todas as partidas do usuário salvo

### 4. Ranking Público
- Tabela com os melhores scores de todos os usuários
- Exibe: posição, e-mail do usuário, melhor score e data
- Atualizado após cada partida
- Visível para todos (autenticados ou não)

### 5. Banco de Perguntas
- Mínimo de 50 perguntas cadastradas via seed SQL
- Cada pergunta contém:
  - `statement` — afirmação a ser julgada
  - `answer` — true ou false
  - `explanation` — explicação curta (1-3 linhas)
  - `level` — beginner | basic | intermediate | advanced
  - `topic` — ex: SELECT, JOIN, índice, transação, etc.

---

## Exemplos de Perguntas

### Beginner
- "Um banco de dados relacional organiza dados em tabelas com linhas e colunas." → true
- "O comando SELECT é usado para deletar registros de uma tabela." → false
- "SQL significa Structured Query Language." → true

### Basic
- "A cláusula WHERE filtra os resultados antes de GROUP BY." → true
- "O valor NULL é igual a zero em comparações SQL." → false
- "O comando DISTINCT remove duplicatas do resultado." → true

### Intermediate
- "Um LEFT JOIN retorna todos os registros da tabela da esquerda, mesmo sem correspondência na direita." → true
- "A cláusula HAVING filtra grupos antes da execução do GROUP BY." → false
- "Subqueries sempre são menos eficientes que JOINs." → false

### Advanced
- "Uma CTE (Common Table Expression) é sempre mais performática que uma subquery." → false
- "O isolamento SERIALIZABLE garante que transações concorrentes produzam o mesmo resultado que se fossem executadas em série." → true
- "Índices sempre melhoram a performance de todas as queries." → false

---

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilo | Tailwind CSS |
| Backend/Auth | Supabase (Auth + PostgreSQL + RLS) |
| Deploy | Vercel |
| Repositório | GitHub — https://github.com/EdsonMoreiraAds/quizzsql |

---

## Credenciais e Configuração do Supabase

### Variáveis de Ambiente (já configuradas na Vercel e necessárias no .env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<chave-publica-do-supabase>
SUPABASE_SECRET_KEY=<chave-secreta-do-supabase>
```

### Criar o arquivo .env.local na raiz do projeto com os valores reais obtidos no painel Supabase > Settings > API Keys.

---

## Estrutura de Banco de Dados (já criado no Supabase)

### Tabela `questions` (já criada)
```sql
create table questions (
  id uuid primary key default gen_random_uuid(),
  statement text not null,
  answer boolean not null,
  explanation text not null,
  level text check (level in ('beginner', 'basic', 'intermediate', 'advanced')) not null,
  topic text not null,
  created_at timestamptz default now()
);
```

### Tabela `scores` (já criada)
```sql
create table scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  score integer not null check (score between 0 and 100),
  total_questions integer default 10,
  played_at timestamptz default now()
);
```

### RLS já habilitado com as políticas:
- questions: leitura pública
- scores: leitura pública, inserção apenas pelo próprio usuário

---

## Estrutura de Arquivos do Projeto

```
D:\quizzsql\
├── app/
│   ├── layout.tsx              # Layout raiz com Tailwind + provider de sessão Supabase
│   ├── page.tsx                # Home: apresentação + link para jogar + ranking preview
│   ├── login/
│   │   └── page.tsx            # Tela de login/cadastro com Supabase Auth
│   ├── quiz/
│   │   └── page.tsx            # Tela principal do quiz (10 perguntas)
│   ├── result/
│   │   └── page.tsx            # Tela de resultado final + score + CTA
│   └── ranking/
│       └── page.tsx            # Ranking público completo
├── components/
│   ├── QuestionCard.tsx        # Card de pergunta com botões Verdadeiro/Falso
│   ├── FeedbackCard.tsx        # Feedback pós-resposta com explicação
│   ├── ProgressBar.tsx         # Barra de progresso (pergunta X de 10)
│   ├── ScoreBoard.tsx          # Tabela de ranking
│   └── Navbar.tsx              # Navegação com estado de autenticação
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Supabase client (browser)
│   │   └── server.ts           # Supabase client (server-side)
│   └── quiz.ts                 # Lógica de sorteio de perguntas por nível
├── types/
│   └── index.ts                # Tipos TypeScript: Question, Score, RankingEntry
├── .env.local                  # Variáveis de ambiente locais
└── supabase/
    └── seed.sql                # 50+ perguntas para popular o banco
```

---

## Fluxo do Usuário

```
Home → Login/Cadastro → Quiz (10 perguntas)
         ↓ cada pergunta
      Resposta V/F → Feedback imediato + Explicação → Próxima
         ↓ após 10 perguntas
      Tela de Resultado (score X/100) → Score salvo no Supabase
         ↓
      Ver Ranking | Jogar Novamente | Voltar para Home
```

---

## Design e UX

- Visual escuro (dark mode) com accent em verde — remetendo a terminal/banco de dados
- Fonte monospace para as afirmações das perguntas
- Animação suave de transição entre perguntas
- Mobile-first — responsivo para celular
- Cores de feedback: verde para correto, vermelho para errado
- Barra de progresso visível durante o quiz

---

## Seed — Popular o banco com 50 perguntas

Criar arquivo `supabase/seed.sql` com INSERT de 50+ perguntas cobrindo todos os níveis e executar no SQL Editor do Supabase após o desenvolvimento.

---

## Critérios de Aceite

- [ ] Usuário consegue criar conta e fazer login
- [ ] Quiz carrega 10 perguntas aleatórias com distribuição correta de níveis
- [ ] Cada resposta exibe feedback imediato com explicação
- [ ] Score é calculado e salvo no Supabase ao final da partida
- [ ] Ranking público exibe os melhores scores
- [ ] Funciona em dispositivos móveis
- [ ] Deploy funcionando na Vercel
- [ ] Banco tem no mínimo 50 perguntas cadastradas

---

## Instruções para o Claude Code

1. Leia este PRD completamente
2. Crie o arquivo `.env.local` com as variáveis do Supabase
3. Instale as dependências necessárias: `npm install @supabase/supabase-js @supabase/ssr`
4. Construa toda a aplicação conforme a estrutura de arquivos acima
5. Crie o seed com 50 perguntas em `supabase/seed.sql`
6. Após construir, faça commit e push para o GitHub — a Vercel vai fazer o deploy automaticamente

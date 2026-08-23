# 🚀 LeadFlow AI

**Plataforma inteligente para organização, análise e acompanhamento de leads comerciais.**

O **LeadFlow AI** nasceu para reduzir o trabalho manual envolvido na prospecção de clientes para serviços digitais.

A aplicação centraliza o processo de importação de leads, organização dos contatos, análise de presença digital com Inteligência Artificial, geração de abordagens comerciais e acompanhamento de follow-ups.

Em vez de trabalhar com planilhas dispersas e analisar cada empresa manualmente, o LeadFlow AI transforma os dados coletados em um fluxo organizado de prospecção.

---

## 🎯 Problema

A prospecção de clientes normalmente envolve várias tarefas repetitivas:

* pesquisar empresas;
* copiar informações para planilhas;
* organizar telefone, Instagram e site;
* verificar a presença digital de cada negócio;
* identificar oportunidades comerciais;
* criar uma abordagem personalizada;
* entrar em contato;
* lembrar de realizar follow-ups;
* acompanhar respostas, reuniões e propostas.

Além de consumir tempo, esse processo dificulta manter consistência quando o número de leads aumenta.

O **LeadFlow AI** foi desenvolvido para centralizar e simplificar esse fluxo.

---

## 💡 Solução

O sistema transforma dados brutos de prospecção em um pipeline organizado:

```text
Pesquisa de empresas
        ↓
CSV / XLSX
        ↓
Importação
        ↓
Normalização dos dados
        ↓
Lead cadastrado
        ↓
Análise com IA
        ↓
Diagnóstico comercial
        ↓
Mensagem personalizada
        ↓
WhatsApp / Instagram
        ↓
Contato manual
        ↓
Follow-up
        ↓
Resposta
        ↓
Reunião / Proposta / Fechamento
```

A IA funciona como **assistente de análise**, enquanto as decisões e contatos permanecem sob controle do usuário.

---

# ✨ Principais funcionalidades

## 📥 Importação de leads

O sistema permite importar leads através de:

* `.xlsx`
* `.csv`

Durante a importação é possível revisar e mapear as colunas antes de salvar os registros.

Entre os dados suportados estão:

* nome do negócio;
* telefone;
* Instagram;
* site;
* avaliação;
* número de avaliações;
* segmento;
* cidade;
* potencial comercial;
* status.

A aplicação também realiza normalização e identificação de possíveis duplicidades.

---

## 🧹 Organização dos dados

Dados vindos de ferramentas de scraping ou planilhas nem sempre possuem uma estrutura consistente.

O LeadFlow AI permite revisar o mapeamento antes da importação:

```text
Coluna da planilha
        ↓
Campo correspondente
        ↓
Normalização
        ↓
Validação
        ↓
Importação
```

Registros inválidos podem ser ignorados e campos opcionais inconsistentes são tratados antes da persistência.

---

## 🤖 Análise de leads com IA

Cada lead pode ser analisado individualmente utilizando a API da OpenAI.

Quando existe um site, o LeadFlow AI tenta coletar sinais públicos da página inicial, como:

* título;
* descrição;
* headings;
* CTAs;
* informações de contato;
* formulários;
* sinais de agendamento;
* presença de chatbot.

O HTML completo não é enviado ao modelo.

A IA recebe apenas um resumo controlado dessas informações.

---

## 🧠 Diagnóstico comercial

A análise pode produzir informações como:

```text
Potencial de venda
Website score
Principal oportunidade
Evidências encontradas
Solução sugerida
Serviço recomendado
Mensagem de abordagem
Mensagem de follow-up
Nível de confiança
```

Entre os serviços que podem ser recomendados estão:

* Landing Page;
* Site Institucional;
* Chatbot;
* Sistema de Agendamento;
* Sistema Personalizado;
* Revisão de Presença Digital.

A análise é uma sugestão e pode ser revisada antes de alterar os dados do lead.

---

## 💬 Prospecção

Depois da análise, a aplicação disponibiliza uma área específica para prospecção.

A mensagem utilizada pode vir de:

```text
1. Análise mais recente da IA
2. Mensagem personalizada salva
3. Template local
```

O usuário pode editar a mensagem antes do contato sem realizar uma nova chamada à IA.

---

## 📱 WhatsApp

Quando existe um telefone válido, o LeadFlow AI:

* normaliza o número;
* adiciona o código brasileiro quando necessário;
* prepara a mensagem;
* gera o link do WhatsApp;
* abre a conversa com o texto preenchido.

O envio permanece **manual**.

```text
Mensagem
   ↓
Abrir WhatsApp
   ↓
Revisar
   ↓
Enviar manualmente
```

A aplicação não realiza disparos automáticos ou em massa.

---

## 📸 Instagram

Quando existe um perfil cadastrado, o sistema permite:

```text
Copiar mensagem
      ↓
Abrir Instagram
      ↓
Colar
      ↓
Enviar manualmente
```

O LeadFlow AI não realiza scraping do Instagram, login automatizado ou envio automático de mensagens.

---

# 📅 Follow-ups

Após realizar um contato, o usuário pode registrar:

* data do contato;
* status;
* resposta;
* observações;
* próxima data de follow-up.

A aplicação identifica:

* follow-ups de hoje;
* atrasados;
* próximos;
* leads sem follow-up.

Isso reduz a possibilidade de oportunidades comerciais serem esquecidas.

---

# 🔄 Pipeline comercial

Os leads podem percorrer diferentes etapas:

```text
NEW
 ↓
ANALYZED
 ↓
CONTACTED
 ↓
RESPONDED
 ↓
FOLLOW_UP
 ↓
MEETING
 ↓
PROPOSAL
 ↓
CLOSED
```

Também existe:

```text
LOST
```

para oportunidades encerradas.

---

# 📊 Dashboard

O dashboard apresenta uma visão geral da prospecção.

Entre as métricas disponíveis estão:

* total de leads;
* novos leads;
* leads de alto potencial;
* contatados;
* respondidos;
* reuniões;
* propostas;
* fechados;
* follow-ups de hoje;
* follow-ups atrasados;
* leads sem contato;
* taxa de resposta.

Também são exibidos leads recentes e próximos follow-ups.

---

# 🔍 Busca e filtros

A listagem de leads permite consultar oportunidades utilizando:

* busca por nome;
* status;
* potencial comercial;
* situação do follow-up.

A interface utiliza tabela no desktop e apresentação adaptada para dispositivos móveis.

---

# 🔐 Autenticação

O MVP foi desenvolvido inicialmente como uma ferramenta pessoal.

Por isso, utiliza autenticação de **administrador único**.

Não existem:

* cadastro público;
* múltiplos usuários;
* recuperação de senha;
* compartilhamento de leads entre contas.

As rotas internas são protegidas por sessão.

---

# 🛡️ Segurança na análise de sites

URLs fornecidas por leads são consideradas dados não confiáveis.

A coleta do site possui proteções como:

* somente HTTP/HTTPS;
* bloqueio de localhost;
* bloqueio de IPs privados e reservados;
* bloqueio de link-local;
* bloqueio de endpoints de metadata;
* validação de DNS;
* validação após redirecionamentos;
* limite de redirecionamentos;
* timeout;
* limite de tamanho da resposta;
* somente conteúdo HTML.

A aplicação não desabilita TLS para acessar sites incompatíveis.

---

# 💰 Controle de uso da OpenAI

Uma das preocupações do projeto é evitar chamadas desnecessárias à API.

A análise:

* ocorre somente quando solicitada pelo usuário;
* não é executada automaticamente durante a importação;
* não ocorre em lote;
* reutiliza análises concluídas;
* exige confirmação para reanálise.

Operações como:

* copiar mensagem;
* editar mensagem;
* abrir WhatsApp;
* abrir Instagram;
* registrar contato;
* definir follow-up;
* registrar resposta;
* atualizar status;

**não realizam chamadas à OpenAI.**

---

# 🛠️ Tecnologias

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS 4
* React Hook Form
* Lucide React

### Backend

* Next.js App Router
* Server Components
* Server Actions
* Zod

### Banco de dados

* PostgreSQL
* Neon
* Prisma ORM 7

### Inteligência Artificial

* OpenAI API
* Structured Outputs
* validação das respostas com Zod

### Autenticação

* sessão server-side;
* cookie `httpOnly`;
* administrador único.

---

# 🏗️ Arquitetura

```text
                    ┌─────────────────┐
                    │    Next.js      │
                    │   App Router    │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
       Server Components              Client Components
              │                             │
              └──────────────┬──────────────┘
                             │
                       Server Actions
                             │
                ┌────────────┴────────────┐
                │                         │
           Prisma ORM                OpenAI API
                │
          PostgreSQL / Neon
```

---

# 📂 Estrutura principal

```text
app/
├── dashboard/
├── leads/
│   ├── import/
│   ├── new/
│   └── [id]/
└── login/

components/
├── dashboard/
├── leads/
│   ├── analysis/
│   └── prospecting/
└── ui/

lib/
├── actions/
├── auth/
├── openai/
├── templates/
├── utils/
└── validations/

prisma/
├── migrations/
├── schema.prisma
└── seed.ts

types/
```

---

# ⚙️ Instalação

## Requisitos

* Node.js 20.19+
* npm
* PostgreSQL/Neon
* chave da OpenAI

Clone o projeto:

```bash
git clone SEU_REPOSITORIO
cd leadflow-ai
```

Instale as dependências:

```bash
npm install
```

---

# 🔑 Variáveis de ambiente

Crie:

```text
.env
```

a partir do:

```text
.env.example
```

Configure:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

OPENAI_API_KEY="sua_chave"
OPENAI_MODEL="modelo_compativel"

ADMIN_EMAIL="seu-email"
ADMIN_PASSWORD_HASH="hash_bcrypt"
AUTH_SECRET="segredo_aleatorio"
```

Nunca utilize `NEXT_PUBLIC_` para a chave da OpenAI ou credenciais do banco.

Nunca envie o `.env` para o repositório.

---

# 🗄️ Prisma

Gere o Prisma Client:

```bash
npx prisma generate
```

Em desenvolvimento, aplique as migrations:

```bash
npx prisma migrate dev
```

Opcionalmente execute o seed:

```bash
npx prisma db seed
```

---

# ▶️ Executando

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

---

# 🧪 Qualidade

O projeto possui verificações para TypeScript, lint, testes e build.

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Também é possível validar o Prisma:

```bash
npx prisma format
npx prisma validate
npx prisma generate
```

---

# 🗺️ Principais rotas

```text
/login
/dashboard
/leads
/leads/import
/leads/new
/leads/[id]
/leads/[id]/edit
```

---

# 🚧 Limitações do MVP

A versão atual prioriza simplicidade, controle de custos e revisão humana.

Por isso, não possui:

* envio automático de WhatsApp;
* envio automático de Instagram;
* disparo de mensagens em massa;
* análise automática do Instagram;
* crawling completo de sites;
* processamento de IA em massa;
* integração direta com Google Sheets;
* busca automática via Google Places;
* múltiplos usuários;
* filas e workers em background.

Esses recursos foram deliberadamente mantidos fora do MVP.

---

# 🔮 Possíveis evoluções

Algumas possibilidades futuras:

```text
Google Places
        ↓
Busca automática de empresas
        ↓
Enriquecimento
        ↓
Análise inteligente
        ↓
Ranking de oportunidades
```

Outras evoluções possíveis:

* pipeline Kanban;
* análise de conversão por segmento;
* histórico completo de interações;
* integração oficial com WhatsApp Business;
* automação de follow-ups;
* múltiplos usuários;
* organizações/workspaces;
* scoring baseado nos resultados reais;
* integração com Google Sheets;
* relatórios comerciais.

A implementação dessas funcionalidades dependerá da validação do MVP em uso real.

---

# 📌 Status

**MVP funcional.**

O foco atual é utilizar a aplicação em prospecções reais, medir os resultados e identificar quais funcionalidades geram valor antes de ampliar o produto.

---

# 👩‍💻 Desenvolvimento

Projeto desenvolvido como uma solução prática para automatizar e organizar um problema real de prospecção comercial, combinando desenvolvimento Full Stack, Inteligência Artificial e automação de processos.

O LeadFlow AI também funciona como estudo aplicado de:

* arquitetura Full Stack com Next.js;
* integração de LLMs em aplicações reais;
* Structured Outputs;
* segurança em coleta server-side de páginas públicas;
* modelagem de pipeline comercial;
* PostgreSQL serverless;
* controle de custos de APIs de IA;
* validação e revisão humana de conteúdo gerado por IA.

---

## LeadFlow AI

**Da lista de empresas ao acompanhamento comercial em um único fluxo.**

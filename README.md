# LeadFlow AI

Sistema pessoal para organizar a prospecção de clientes de serviços digitais. A Sprint 1 entrega uma base funcional e local para cadastrar, consultar, atualizar, filtrar e excluir leads.

## Tecnologias

- Next.js 16 com App Router, React 19 e TypeScript
- Tailwind CSS 4
- Prisma 7 com SQLite
- Zod e React Hook Form
- Lucide React

## Funcionalidades da Sprint 1

- Dashboard com nove métricas calculadas do banco
- Cinco leads mais recentes e cinco próximos follow-ups
- Listagem responsiva (tabela no desktop e cards no celular)
- Busca por nome e filtros server-side por status e potencial
- Cadastro, detalhes, edição e exclusão com confirmação acessível
- Validação Zod no navegador e no servidor
- Feedback de sucesso/erro, loading, lista vazia e página 404
- Sidebar responsiva com indicação da rota atual
- Seed com 12 clínicas veterinárias claramente fictícias

## Estrutura principal

```text
app/                 rotas, layouts, loading e páginas de erro
components/          layout, dashboard, leads e componentes de UI
lib/actions/         Server Actions do CRUD
lib/validations/     schema Zod reutilizável
lib/utils/           labels e formatadores
prisma/              schema, migrations e seed
types/               tipos compartilhados
```

## Instalação e execução

Requer Node.js 20.19 ou superior e npm.

```bash
npm install
```

Copie `.env.example` para `.env` e mantenha:

```env
DATABASE_URL="file:./dev.db"
```

Prepare e popule o banco:

```bash
npx prisma migrate dev
npx prisma db seed
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3000`. A rota inicial redireciona para o dashboard.

## Rotas

- `/dashboard` — métricas, leads recentes e follow-ups
- `/leads` — busca, filtros e listagem
- `/leads/new` — cadastro
- `/leads/[id]` — detalhes
- `/leads/[id]/edit` — edição

## Qualidade

```bash
npm run lint
npm run typecheck
npm run build
```

## Próximas sprints

Ficaram intencionalmente fora desta sprint: importação CSV, análise automática de sites, OpenAI, integrações com WhatsApp e Instagram, autenticação, multiusuário, gráficos avançados, Docker e banco externo.

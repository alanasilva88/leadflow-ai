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

## Sprint 2 — Importação inteligente

O LeadFlow AI importa planilhas `.xlsx` e `.csv` pela rota `/leads/import`. O arquivo é lido localmente no navegador, não fica armazenado e somente os registros normalizados são enviados ao servidor após a confirmação.

### Como importar

1. No Google Planilhas, use **Arquivo → Fazer download → Microsoft Excel (.xlsx)**. No Instant Data Scraper, use a opção de exportar **CSV**.
2. Abra **Importar leads** na navegação ou **Importar planilha** em `/leads`.
3. Escolha o arquivo, a aba (quando houver várias), confira a prévia e revise o mapeamento sugerido.
4. Mapeie obrigatoriamente **Nome do negócio**, valide o resumo e confirme.

São aceitos arquivos de até **5 MB**, com no máximo **500 registros**, **50 colunas** e células de até **1.000 caracteres**. Cabeçalhos comuns em português e inglês são reconhecidos para nome, telefone, Instagram, site, nota, avaliações, segmento, cidade, potencial e status. O mapeamento é apenas uma sugestão e pode ser alterado.

Dados opcionais inválidos são convertidos em nulo com aviso. Linhas sem nome válido são ignoradas. Duplicados são detectados por telefone normalizado, site, Instagram ou nome exato normalizado combinado com cidade; duplicados no arquivo ou no banco são ignorados, nunca atualizados.

Arquivos fictícios estão em `examples/leads-example.csv` e `examples/leads-example.xlsx`. Para regenerar o XLSX com duas abas:

```bash
npm run examples:generate
```

### Limitações atuais

Esta versão não integra diretamente com Google Sheets, não usa IA, não analisa sites, não atualiza/mescla leads existentes e não mantém os arquivos ou mapeamentos. Autenticação, filas, importações massivas, WhatsApp, Instagram e análise automática ficam para outras sprints.

# LeadFlow AI

Sistema pessoal para organizar a prospecção de clientes de serviços digitais. A Sprint 1 entrega uma base funcional e local para cadastrar, consultar, atualizar, filtrar e excluir leads.

## Tecnologias

- Next.js 16 com App Router, React 19 e TypeScript
- Tailwind CSS 4
- Prisma 7 com PostgreSQL/Neon
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
DATABASE_URL="postgresql://usuario:senha@host-pooler.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://usuario:senha@host.neon.tech/neondb?sslmode=require"
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

# LeadFlow AI

Aplicação Next.js para cadastro, importação e análise assistida de leads.

## Sprint 3 — análise inteligente

A página de detalhes de cada lead agora permite iniciar manualmente uma análise com a OpenAI. A aplicação tenta ler somente a página inicial pública do site, envia um resumo limitado dos sinais encontrados, recebe uma saída estruturada, valida novamente com Zod e mostra uma prévia editável. Nada é aplicado ao cadastro do lead antes da confirmação.

### Configuração

Copie `.env.example` para `.env` e configure:

```env
OPENAI_API_KEY=sua_chave
OPENAI_MODEL=um_modelo_compativel_com_structured_outputs
```

Nunca use `NEXT_PUBLIC_` na chave, envie o `.env` ao GitHub ou coloque uma chave real em código/testes. `.env` e `.env.local` são ignorados pelo Git. A API da OpenAI pode ter cobrança por uso.

Instale, migre e inicie:

```bash
npm install
npx prisma migrate dev
npm run dev
```

Abra `http://localhost:3000/leads`, escolha um lead e clique em **Analisar com IA**. O resultado pode ser editado; os checkboxes de aplicação ao lead começam desmarcados. Uma análise concluída é reutilizada por padrão. **Analisar novamente** exige confirmação, faz nova chamada e preserva o histórico.

### Coleta do site e segurança

A coleta usa HTTP server-side, apenas na home, com timeout curto, resposta HTML limitada a 500 KB e no máximo três redirecionamentos. São extraídos título, descrição, headings, CTAs e sinais simples de contato, formulário, agendamento e chatbot; HTML bruto não é enviado nem salvo.

URLs são tratadas como não confiáveis. Apenas HTTP/HTTPS e portas 80/443 são aceitos; credenciais, localhost, IPs privados/reservados, link-local e metadata são bloqueados. O DNS é resolvido e validado novamente em cada redirecionamento. TLS não é desativado. Sites indisponíveis, grandes, não HTML ou que bloqueiem leitura geram um aviso, e a análise continua sem o site.

### Controle de consumo e revisão

- Uma chamada ocorre somente por clique; não há análise automática ou em lote.
- Resultados salvos são reutilizados e reanálises pedem confirmação.
- Apenas dados necessários e textos limitados são enviados.
- Copiar, editar e salvar não chama a OpenAI.
- O modelo e a data são registrados; erros são seguros e não incluem chave, prompt, HTML ou resposta integral.

A análise é uma sugestão e deve ser revisada. A aplicação não garante precisão comercial nem promete resultados.

### Verificações

```bash
npx prisma format
npx prisma validate
npx prisma generate
npm run typecheck
npm run lint
npm run test
npm run build
```

Para testar manualmente, use `/leads`, `/leads/[id]` e `/dashboard`, incluindo leads sem site, com site válido/indisponível e URL localhost. Teste também chave ausente, modelo inválido, reutilização, reanálise e salvamento com/sem aplicação dos campos.

### Limites e Sprint 4

Não há crawling de múltiplas páginas, navegador automatizado, análise de redes sociais, processamento em massa ou background, nem envio automático de WhatsApp/Instagram.

## Sprint 4 — Prospecção e acompanhamento

Na página do lead, a seção **Prospecção** reutiliza a mensagem da análise mais recente, a mensagem personalizada do lead ou um modelo local determinístico. É possível editar localmente, copiar, abrir o WhatsApp com o texto preenchido ou copiar e abrir o perfil do Instagram. O envio é sempre manual e abrir um canal não registra contato automaticamente.

Depois do envio manual, use **Registrar contato** para atualizar a data, o status e definir um follow-up. A resposta recebida pode ser registrada depois; respostas positivas levam a `RESPONDED`, negativas a `LOST`, reuniões a `MEETING`, propostas a `PROPOSAL` e negócios fechados a `CLOSED`. “Entrar em contato depois” exige uma nova data.

A listagem permite filtrar follow-ups de hoje, atrasados, próximos ou ausentes. O dashboard mostra follow-ups de hoje/atrasados, leads sem contato, contatados, respondidos e taxa de resposta. A taxa é calculada como respostas diferentes de “não respondeu” divididas pelos leads contatados, com proteção contra divisão por zero.

Nenhuma operação desta sprint chama a OpenAI. Não existe envio em massa, WhatsApp Business API, Instagram API, confirmação de entrega/leitura ou automação de mensagens.

## Login do administrador

O sistema continua pessoal e usa um único administrador configurado no servidor. Não existe cadastro público, recuperação de senha, modelo `User` ou isolamento de leads por usuário.

```env
ADMIN_EMAIL=seu-email@example.com
ADMIN_PASSWORD_HASH=hash_bcrypt
AUTH_SECRET=segredo_aleatorio_com_32_ou_mais_caracteres
```

Gere os valores sem versionar a senha:

```bash
node -e "require('bcryptjs').hash(process.argv[1], 12).then(console.log)" "SUA_SENHA_FORTE"
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

A sessão dura 12 horas e usa cookie `httpOnly`, `sameSite=lax` e `secure` em produção. A tela pública é `/login`; as demais rotas exigem sessão válida.

## Busca automática de empresas adiada

A integração com Google Places foi pausada neste MVP para evitar a dependência de um novo serviço faturado. A aplicação não realiza Text Search, Place Details nem enriquecimento automático e não exige `GOOGLE_PLACES_API_KEY` para iniciar, testar ou gerar o build.

Use `/leads/new` para cadastro manual ou `/leads/import` para arquivos CSV/XLSX. O código de acesso à Google Places API não faz parte desta versão. Os campos genéricos de origem, endereço, pontuação e deduplicação foram preservados, assim como a migration existente, para não comprometer os dados e permitir uma retomada futura planejada.

### Pontuação preservada

O cálculo genérico abaixo permanece no projeto, mas não executa buscas nem enriquecimento automático nesta versão:

- sem site: +3;
- telefone: +1;
- mais de 30 avaliações: +1;
- mais de 100 avaliações: +1 adicional;
- nota a partir de 4: +1;
- operacional: +1.

Pontuações 0–3 são baixas, 4–6 médias e 7+ altas. Fechados permanentemente não são importados. Se a OpenAI falhar, o lead permanece salvo e a tentativa pode ser refeita na página do lead.

## Verificações

```bash
npx prisma migrate dev
npx prisma generate
npm run typecheck
npm run lint
npm run test
npm run build
```

Fluxo do MVP:

```text
Importar
→ analisar
→ revisar mensagem
→ abrir canal
→ enviar manualmente
→ registrar contato
→ acompanhar follow-up
```

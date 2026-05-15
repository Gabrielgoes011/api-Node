# Gerenciador de Fundos Imobiliários (FIIs)

Aplicação fullstack para controle e acompanhamento de carteira de Fundos de Investimento Imobiliário (FIIs). Permite gerenciar ativos, registrar operações de compra/venda, acompanhar rendimentos recebidos e visualizar a performance da carteira.

> **Status:** Em desenvolvimento — arquitetura sendo migrada para o padrão `Controller → Service → Repository`.

---

## Estrutura do Projeto

```
api-Node/
├── api-nodeback/   # API REST — Node.js + Express + PostgreSQL
└── api-nodefront/  # SPA — React + Vite + Tailwind CSS
```

---

## Backend (`api-nodeback`)

### Tecnologias

| Pacote | Versão | Uso |
|---|---|---|
| Node.js (ESM) | — | Runtime |
| Express | ^5.1.0 | Framework HTTP |
| pg (node-postgres) | ^8.20.0 | Conexão com PostgreSQL |
| jsonwebtoken | ^9.0.3 | Autenticação JWT |
| multer | ^2.1.1 | Upload de arquivos |
| @aws-sdk/client-s3 | ^3.x | Armazenamento S3 (AWS) |
| dotenv | ^17.x | Variáveis de ambiente |
| uuid | ^13.x | Geração de IDs únicos |
| nodemon | ^3.x | Hot-reload em desenvolvimento |

### Arquitetura

O backend está em migração progressiva para a separação de responsabilidades em três camadas:

```
Routes  →  Controller  →  Service  →  Repository  →  Banco de Dados
```

- **Routes** — define os endpoints HTTP e aplica middlewares (ex: `verificaJWT`)
- **Controller** — recebe a requisição, chama o Service e devolve a resposta HTTP
- **Service** — contém as regras de negócio e validações (ex: verificar se ticker já existe)
- **Repository** — executa diretamente as queries SQL no PostgreSQL

> Módulos ainda não migrados (ex: `operacoes`, `rendimentos`) têm a lógica diretamente no controller. A migração é incremental.

### Banco de Dados

PostgreSQL hospedado no [Neon](https://neon.tech) com conexão via `Pool` e SSL habilitado.

O arquivo `src/config/configDb.js` expõe a função `openDb()` que retorna o pool compartilhado — **nunca feche o pool dentro das rotas**.

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz de `api-nodeback/` com as seguintes chaves:

```env
DATABASE_URL=postgresql://usuario:senha@host/banco?sslmode=require
JWT_SECRET=sua_chave_secreta_aqui
AWS_REGION=us-east-1
AWS_ACCESS_KEY=sua_access_key
AWS_SECRET_KEY=sua_secret_key
```

### Endpoints

Todas as rotas (exceto `/auth/login`) exigem o header:
```
Authorization: Bearer <token>
```

#### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/login` | Autentica o usuário e retorna o JWT |

#### Usuários
| Método | Rota | Descrição |
|---|---|---|
| GET | `/users` | Lista todos os usuários |
| GET | `/users/dash/count` | Conta total de usuários |
| POST | `/cadUsers` | Cadastra novo usuário |
| PUT | `/users/update/:id` | Atualiza dados do usuário |
| PUT | `/inativaUser/:id` | Inativa ou reativa usuário |
| DELETE | `/users/delete/:id` | Remove usuário |

#### Seguimentos (Segmentos)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/seguimentos` | Lista todos os seguimentos |
| GET | `/seguimentos/contar` | Conta seguimentos cadastrados |
| POST | `/seguimentos` | Cadastra novo seguimento |
| PUT | `/seguimentos/update` | Atualiza seguimento |
| DELETE | `/seguimentos/delete/:id` | Remove seguimento |

#### Meus Fundos (Ativos)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/meusFundos` | Lista todos os fundos cadastrados |
| GET | `/meusFundos/contar` | Conta total de fundos |
| POST | `/meusFundos/cadastrar` | Cadastra novo fundo (ticker único) |

#### Operações
| Método | Rota | Descrição |
|---|---|---|
| GET | `/ativosDropList` | Lista ativos para dropdown |
| POST | `/operacoes` | Lista operações filtradas por mês/ano |
| POST | `/lancarOperacao` | Registra nova operação (compra/venda) |
| POST | `/excluirOperacao` | Remove uma operação pelo ID |
| POST | `/carregaDadosGraficoOperacoes` | Dados para gráfico de operações por ano |

#### Rendimentos
| Método | Rota | Descrição |
|---|---|---|
| POST | `/rendimentos` | Lista rendimentos filtrados por mês/ano |
| POST | `/carregarGraficoDashboard` | Dados para gráfico do dashboard por ano |
| POST | `/carregarComparacaoAnual` | Comparativo de rendimentos entre anos |
| GET | `/carregarDadosModalNovoRendimento` | Ativos disponíveis para lançar rendimento |

### Como Executar

```bash
# Instalar dependências
cd api-nodeback
npm install

# Desenvolvimento (com hot-reload)
npm run dev

# Produção
npm start
```

O servidor sobe em `http://localhost:3000`.

---

## Frontend (`api-nodefront`)

### Tecnologias

| Pacote | Versão | Uso |
|---|---|---|
| React | ^19.x | UI |
| Vite | ^8.x | Bundler / Dev server |
| React Router DOM | ^7.x | Roteamento SPA |
| Tailwind CSS | ^3.x | Estilização utilitária |
| Axios | ^1.x | Requisições HTTP |
| React Toastify | ^11.x | Notificações |
| React Bootstrap | ^2.x | Componentes de UI |
| React Icons | ^5.x | Ícones |

### Páginas

| Página | Rota | Descrição |
|---|---|---|
| Login | `/login` | Autenticação do usuário |
| Dashboard | `/dashboard` | Visão geral da carteira |
| Meus Fundos | `/cadastros/meusFundos` | CRUD de fundos imobiliários |
| Seguimentos | `/cadastros/seguimentos` | CRUD de segmentos |
| Usuários | `/cadastros/usuarios` | Gerenciamento de usuários |
| Operações | `/operacoes` | Registro e histórico de operações |
| Rendimentos | `/rendimentos` | Lançamento e histórico de rendimentos |
| Controle de Ativos | `/controleAtivos` | Acompanhamento da carteira |
| Precificação | `/precificacao` | Análise de preços |
| Relatórios | `/relatorios` | Relatórios gerenciais |
| Configurações | `/configuracoes` | Preferências da aplicação |

### Estrutura de Componentes

```
src/
├── components/
│   ├── Charts/          # AreaChart, BarChart (recharts)
│   ├── DataCard/        # Cards de métricas
│   ├── Layout/          # Shell da aplicação (sidebar + topbar)
│   ├── Sidebar/         # Menu lateral de navegação
│   ├── TopBar/          # Barra superior
│   ├── TableAcoes/      # Tabela reutilizável com ações (editar/excluir)
│   ├── ModalFormulario/ # Modal genérico de formulários
│   ├── ModalDeConfirmacao/ # Modal de confirmação de ações destrutivas
│   └── SkeletonTable/   # Skeleton loader para tabelas
├── hooks/               # Custom hooks por domínio
├── services/            # Funções de chamada à API (axios)
├── pages/               # Páginas organizadas por domínio
├── config/
│   └── api.js           # Instância do axios com baseURL e interceptor 401
└── utils/
    ├── dateUtils.jsx
    └── responseUtils.jsx
```

### Autenticação no Frontend

O token JWT é armazenado no `localStorage`. Um interceptor no Axios dispara o evento `unauthorized` quando a API retorna `401`, forçando o logout automático sem refresh de página.

### Modos de Build

```bash
# Instalar dependências
cd api-nodefront
npm install

# Desenvolvimento
npm run dev

# Demo (modo demonstração)
npm run demo

# Build de produção
npm run build
```

---

## Backlog de Pendências (Funções Existentes)

Problemas e melhorias identificadas diretamente no código atual.

---

### 🔐 Login (`login.controller.js`)

- [ ] **Senha em texto puro** — a comparação de senha usa texto puro. Implementar hash com `bcrypt` (`bcrypt.compare`). O comentário no código já indica: *"troque por bcrypt quando implementar hash"*

---

### 👤 Usuários (`usuario.controller.js` · `validaUser.js`)

- [ ] **Tabela errada no `atualizarUser`** — a query de UPDATE referencia `dbo."tabUser"` (nome antigo do SQLite) em vez da tabela correta `usuarios` do PostgreSQL. A função está quebrando em produção para edições de usuário
- [ ] **Tabela errada no `validaUser.js`** — a função `validaEmailExistente` também aponta para `dbo."tabUser"`. Precisa apontar para `usuarios`
- [ ] **Senha padrão hardcoded** — ao cadastrar um novo usuário, a senha é inserida como `'Padrão123'` fixo no código. Implementar geração de senha temporária ou receber a senha pelo body do cadastro
- [ ] **Validações de senha comentadas** — as validações de confirmação de senha, tamanho mínimo (8 chars) e letra maiúscula estão comentadas no `cadastrarUser`. Reativar após implementar o `bcrypt`
- [ ] **CPF sem validação real** — o cadastro só valida se o CPF tem 11 dígitos. Não há validação dos dígitos verificadores

---

### 🏷️ Seguimentos (`seguimentos.controller.js`)

- [ ] **Delete sem verificação de vínculos** — `deleteSeguimento` exclui o seguimento sem verificar se existem ativos (`ativos`) cadastrados com aquele seguimento. Pode causar erro de integridade referencial no banco
- [ ] **Mensagem de erro errada no `contarSeguimentos`** — o `catch` retorna `'Erro ao contar usuários.'` em vez de `'Erro ao contar seguimentos.'`
- [ ] **Log de alterações pendente** — o próprio código tem o comentário: *"implementar log de atualização de seguimento depois de implementar tabela de logs"*

---

### 📦 Meus Fundos (`meusFundos.controller.js`)

- [ ] **`contarFundosAtivos` fora da arquitetura** — esta função ainda acessa o banco diretamente no controller, enquanto as demais funções do mesmo módulo já usam Service → Repository. Migrar para completar o padrão
- [ ] **Sem edição de fundo** — não existe rota/função para atualizar os dados de um fundo cadastrado (nome, CNPJ, seguimento)
- [ ] **Sem exclusão de fundo** — não existe rota/função para remover um fundo da carteira

---

### 📊 Operações (`operacoes.controller.js`)

- [ ] **Módulo sem migração** — nenhuma função do módulo foi migrada para Controller → Service → Repository. Todo acesso ao banco está direto no controller
- [ ] **`lancarOperacao` sem validação de tipo** — o campo `tipo` é inserido sem validar se o valor é `'Compra'` ou `'Venda'`. Qualquer string é aceita pelo banco
- [ ] **`excluirOperacao` sem controle de propriedade** — qualquer usuário autenticado pode excluir qualquer operação pelo ID. Não há verificação se a operação pertence ao usuário que fez a requisição

---

### 💰 Rendimentos (`rendimentos.controller.js`)

- [ ] **Módulo sem migração** — nenhuma função foi migrada para Controller → Service → Repository
- [ ] **Sem função de lançar rendimento** — existe a rota/modal para carregar os dados (`carregarDadosModalNovoRendimento`), mas não existe a função `POST` para de fato salvar um novo rendimento no banco
- [ ] **Sem edição ou exclusão de rendimento** — não é possível corrigir ou remover um rendimento lançado incorretamente

---

### 🛠️ Utilitários (`httpResponse.js`)

- [ ] **`httpResponse.js` não utilizado** — o arquivo com funções padronizadas de resposta HTTP foi criado mas não está sendo usado em nenhum controller. Adotar gradualmente para padronizar as respostas da API

---

## Roadmap Geral

- [ ] Migrar todos os controllers para a arquitetura `Controller → Service → Repository`
- [ ] Implementar hash de senhas com `bcrypt` no login
- [ ] Finalizar páginas de Rendimentos, Controle de Ativos e Precificação
- [ ] Tornar a aplicação responsiva para uso em smartphones e tablets
- [ ] Completar integração com AWS S3 (upload de documentos/comprovantes)
- [ ] Criar relatórios exportáveis (PDF/Excel)
- [ ] Adicionar suporte a múltiplos usuários com controle de acesso por perfil

---

## Banco de Dados

O script de criação das tabelas está em `api-nodeback/db/script.sql`.

Tabelas principais:
- `usuarios` — dados cadastrais dos usuários
- `credenciaisUsuario` — senhas (relacionada a `usuarios`)
- `seguimentos` — segmentos/categorias de fundos (ex: Lajes Corporativas, Logística)
- `ativos` — fundos cadastrados (ticker, nome, CNPJ, seguimento)
- `operacoes` — compras e vendas de cotas
- `rendimentos` — proventos recebidos por ativo

# 📖 Documentação Completa - FIITrack

Bem-vindo ao guia de desenvolvimento da aplicação FIITrack! Este documento fornece uma visão geral da documentação disponível para frontend e backend.

---

## 📚 Documentos Principais

### **Frontend (React + Vite)**

📄 **[GUIA_DESENVOLVIMENTO.md](api-nodefront/GUIA_DESENVOLVIMENTO.md)**

Documentação completa do frontend com:
- ✅ Utilitários (dateUtils, responseUtils)
- ✅ Configuração de API (axios, interceptadores)
- ✅ Hooks personalizados (useUsuarios, useSeguimentos, etc)
- ✅ Serviços (Services para CRUD)
- ✅ Componentes principais (GridDados, DataCard, Modais)
- ✅ Padrões e boas práticas
- ✅ Exemplos práticos completos
- ✅ Checklist para criar novas features

**Principais Tópicos:**
- Como formatar datas
- Como fazer requisições HTTP
- Como usar modais e tabelas
- Como criar um novo hook
- Como estruturar uma página completa

---

### **Backend (Node.js + Express + PostgreSQL)**

📄 **[GUIA_DESENVOLVIMENTO.md](api-nodeback/GUIA_DESENVOLVIMENTO.md)**

Documentação completa do backend com:
- ✅ Arquitetura MVC + Services + Repositories
- ✅ Utilitários (httpResponse, dateUtils, validaUser)
- ✅ Middlewares (autenticação JWT)
- ✅ Padrão de rotas (GET, POST, PUT, DELETE)
- ✅ Controllers (coordenação de requisições)
- ✅ Services (lógica de negócio)
- ✅ Repositories (acesso a banco de dados)
- ✅ Boas práticas
- ✅ Exemplos práticos de endpoints
- ✅ Checklist para novo endpoint

**Principais Tópicos:**
- Como padronizar respostas HTTP
- Como criar um novo endpoint
- Como validar dados
- Como estruturar controllers, services, repositories
- Como usar banco de dados com segurança

---

## 🗂️ Estrutura do Projeto

```
api-Node/
├── api-nodefront/                # Frontend React
│   ├── src/
│   │   ├── components/           # Componentes reutilizáveis
│   │   ├── pages/                # Páginas da aplicação
│   │   ├── hooks/                # Custom React Hooks
│   │   ├── services/             # Serviços de API
│   │   ├── utils/                # Utilitários (datas, respostas, etc)
│   │   └── config/               # Configurações (API client)
│   └── GUIA_DESENVOLVIMENTO.md   # 📖 Documentação Frontend
│
├── api-nodeback/                 # Backend Node.js
│   ├── src/
│   │   ├── controllers/          # Controllers (MVC)
│   │   ├── services/             # Lógica de negócio
│   │   ├── repositories/         # Acesso a banco de dados
│   │   ├── routes/               # Definição de rotas
│   │   ├── middleware/           # Middlewares (auth, etc)
│   │   ├── utils/                # Utilitários
│   │   └── config/               # Configurações (DB, env, etc)
│   └── GUIA_DESENVOLVIMENTO.md   # 📖 Documentação Backend
│
└── Readme.md                      # Este arquivo
```

---

## 🚀 Quick Start

### Primeiro Acesso?

1. **Leia o Backend primeiro:**
   - Entenda a arquitetura
   - Veja como os endpoints funcionam
   - Aprenda o padrão de resposta

2. **Depois o Frontend:**
   - Veja como chamar a API
   - Entenda os hooks
   - Saiba como renderizar dados

### Preciso Criar Algo Novo?

1. **Nova feature no backend:**
   - Siga o [Checklist para Novo Endpoint](api-nodeback/GUIA_DESENVOLVIMENTO.md#-checklist-para-novo-endpoint)
   - Use os exemplos práticos como referência

2. **Nova feature no frontend:**
   - Siga o [Checklist para Nova Feature](api-nodefront/GUIA_DESENVOLVIMENTO.md#-checklist-para-criar-nova-feature)
   - Copie a estrutura de um hook existente

---

## 📋 Referência Rápida

### **Como fazer algo comum?**

| Preciso... | Frontend | Backend |
|-----------|----------|---------|
| Formatar data | `formatarDataBR()` [link](api-nodefront/GUIA_DESENVOLVIMENTO.md#formatardatabr) | Query SQL com DATE_FORMAT |
| Chamar API | `api.get()` [link](api-nodefront/GUIA_DESENVOLVIMENTO.md#configuração-config-api) | Controller → Service → Repository |
| Exibir notificação | `toastSuccess()` [link](api-nodefront/GUIA_DESENVOLVIMENTO.md#funções-helper-toast) | Status HTTP apropriado |
| Validar dados | Antes de enviar | No controller |
| Usar autenticação | Token via `localStorage` | Middleware `verificaJWT` |
| Exibir tabela | `GridDados` [link](api-nodefront/GUIA_DESENVOLVIMENTO.md#griddados---tabela-universal) | Retornar array de dados |
| Modal | `ModalFormulario` [link](api-nodefront/GUIA_DESENVOLVIMENTO.md#modalformulario---modal-de-formulário) | - |

---

## 🎯 Exemplos por Caso de Uso

### **Caso: Listar Todos os Usuários**

#### Backend

1. **Route** (`routes/usuarios.routes.js`):
   ```javascript
   router.get('/usuarios', verificaJWT, listarUsuarios);
   ```

2. **Controller** (`controllers/usuario.controller.js`):
   ```javascript
   export async function listarUsuarios(req, res) {
     try {
       const resultado = await usuariosService.listarTodos();
       return apiResponse.success(res, 'Listados!', resultado.rows);
     } catch (error) {
       return apiResponse.error(res, error.message);
     }
   }
   ```

3. **Service** (`services/usuarios.services.js`):
   ```javascript
   export async function listarTodos() {
     const query = 'SELECT * FROM usuarios ORDER BY nome';
     return await usuariosRepository.executar(query);
   }
   ```

#### Frontend

1. **Hook** (`hooks/useUsuarios.jsx`):
   ```javascript
   const { users, loading, getUsers } = useUsuarios();
   useEffect(() => getUsers(), []);
   ```

2. **Componente** (`pages/usuarios.jsx`):
   ```javascript
   <GridDados
     coluna={colunasUsuarios}
     data={users}
   />
   ```

---

### **Caso: Criar um Novo Usuário**

#### Backend

1. **Route**: `POST /usuario/cadastrar`
2. **Controller**: Validar → Chamar service → `apiResponse.success(..., 201)`
3. **Service**: Hash senha → Insert no DB
4. **Repository**: Executar query parametrizada

#### Frontend

1. **Hook**: Método `handleAddUser` que chama service
2. **Componente**: `ModalFormulario` que chama hook
3. **Feedback**: `toastSuccess` ao sucesso ou `handleError` ao falhar

---

## 🔗 Links Importantes

### Frontend
- [Guia Completo Frontend](api-nodefront/GUIA_DESENVOLVIMENTO.md)
- [Utilitários (dateUtils, responseUtils)](api-nodefront/GUIA_DESENVOLVIMENTO.md#-utilitários-utils)
- [Hooks Personalizados](api-nodefront/GUIA_DESENVOLVIMENTO.md#-hooks-personalizados)
- [Componente GridDados](api-nodefront/GUIA_DESENVOLVIMENTO.md#griddados---tabela-universal)

### Backend
- [Guia Completo Backend](api-nodeback/GUIA_DESENVOLVIMENTO.md)
- [httpResponse - Padronização](api-nodeback/GUIA_DESENVOLVIMENTO.md#httpresponsejs---padronização-de-respostas-http)
- [Estrutura de Controller](api-nodeback/GUIA_DESENVOLVIMENTO.md#-controllers)
- [Estrutura de Service](api-nodeback/GUIA_DESENVOLVIMENTO.md#-services)
- [Exemplos de Endpoints](api-nodeback/GUIA_DESENVOLVIMENTO.md#-exemplos-práticos)

---

## 💡 Dicas Importantes

### Antes de Começar

- [ ] Leia o guia do seu lado (frontend ou backend)
- [ ] Estude um exemplo similar já existente
- [ ] Siga o padrão de pastas e nomenclatura
- [ ] Use os utilitários fornecidos (não reinvente a roda)

### Ao Implementar

- [ ] Sempre use try/catch
- [ ] Valide dados antes de processar
- [ ] Retorne respostas padronizadas
- [ ] Trate erros de forma consistente
- [ ] Deixe o código legível para outros

### Ao Finalizar

- [ ] Teste o fluxo completo (criar, ler, atualizar, deletar)
- [ ] Verifique as mensagens de erro
- [ ] Teste sem internet (simulação offline)
- [ ] Documente se algo diferente

---

## 🐛 Troubleshooting

### Problema: "Token undefined"
**Solução:** Verifique se o token está em `localStorage`. Use middleware `verificaJWT` nas rotas protegidas.

### Problema: "Email já existe"
**Solução:** Verifique se existe validação de duplicata no controller. Use status `409 Conflict`.

### Problema: "Erro ao carregar dados"
**Solução:** Verifique se o hook está chamando `useEffect`. Use `console.log` para debugar.

### Problema: "CORS error"
**Solução:** Verifique se `cors()` está habilitado no `app.js` do backend.

---

## 📞 Suporte Rápido

Precisa de algo rapidinho? Procure por:

| Tópico | Localização |
|--------|------------|
| Formatar data | `src/utils/dateUtils.jsx` (front) |
| Padrão de resposta HTTP | `src/utils/httpResponse.js` (back) |
| Como chamar API | `src/config/api.js` (front) |
| Middleware de auth | `src/middleware/auth/verificaJWT.js` (back) |
| Exemplo de hook completo | `src/hooks/useUsuarios.jsx` (front) |
| Exemplo de endpoint | `Exemplos Práticos` no guia (back) |

---

## 📝 Histórico de Atualizações

| Data | Versão | Mudanças |
|------|--------|---------|
| 09/06/2026 | 1.0 | Documentação inicial criada |

---

**Desenvolvido com 💚 para facilitar o desenvolvimento da aplicação FIITrack**

Última atualização: 09/06/2026

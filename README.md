# API de Gerenciamento de Usuários

API RESTful para realizar um CRUD (Criar, Ler, Atualizar, Deletar) completo de usuários. Este projeto foi construído com **Node.js**, **Express** e **SQLite**, e serve como um excelente exemplo de uma aplicação backend com persistência de dados, validações de entrada, e operações seguras com o banco de dados.

## ✨ Funcionalidades

*   **Cadastro Seguro de Usuários:** Rota `POST` para criar novos usuários usando **transações** no banco de dados, garantindo que os dados só sejam salvos se todas as operações forem bem-sucedidas.
*   **Listagem de Usuários:** Rota `GET` para visualizar todos os usuários cadastrados.
*   **Busca por ID:** Rota `GET` para encontrar um usuário específico pelo seu `id`.
*   **Atualização de Usuários:** Rota `PUT` para atualizar as informações de um usuário existente.
*   **Login Básico:** Rota `POST` para autenticar um usuário com base em seu e-mail e senha.
*   **Dashboard:** Rota `GET` para contar o número total de usuários cadastrados.
*   **Validações Robustas:**
    *   Verificação de campos obrigatórios.
    *   Exigência de nome e sobrenome.
    *   Validação de formato de e-mail.
    *   Validação de tamanho do CPF.
    *   Validação de complexidade e confirmação de senha.
    *   Verificação de duplicidade para e-mail e CPF no banco de dados.
*   **Código Organizado:** A lógica de negócio está sendo separada do arquivo principal de rotas, sendo movida para `controllers` para melhor organização e manutenibilidade.

## Pré-requisitos

Antes de começar, você vai precisar ter as seguintes ferramentas instaladas em sua máquina:
*   [Node.js](https://nodejs.org/en/) (a versão LTS é recomendada)
*   [npm](https://www.npmjs.com/) (geralmente instalado junto com o Node.js)
*   Opcional: Um cliente de banco de dados SQLite como o DB Browser for SQLite para visualizar o banco de dados.

## Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento.

1.  **Clone o repositório** (ou simplesmente descompacte os arquivos em uma pasta de sua preferência).

2.  **Navegue até a pasta do projeto** pelo seu terminal:
    ```bash
    cd caminho/para/api-Node
    ```

3.  **Instale as dependências** do projeto usando o npm. Este comando irá ler o arquivo `package.json` e baixar tudo o que é necessário.

    ```bash
    npm install
    ```

## 🛠️ Tecnologias e Dependências

Este projeto utiliza as seguintes dependências:

*   `express`: Framework web para criar o servidor e gerenciar as rotas da API.
*   `sqlite`: Biblioteca que fornece uma API moderna (baseada em Promises) para interagir com o banco de dados SQLite.
*   `sqlite3`: O driver que permite ao Node.js se comunicar com o arquivo do banco de dados.
*   `nodemon`: Ferramenta de desenvolvimento que reinicia o servidor automaticamente a cada alteração no código.

## 🚀 Como Rodar a Aplicação

Após a instalação das dependências, você pode iniciar o servidor.

> **Importante:** O servidor não cria a tabela do banco de dados automaticamente. Antes de iniciar, você precisa executar o script `script.sql` no arquivo `database.db` que será criado na raiz do projeto. Você pode fazer isso usando um cliente de banco de dados (como o DB Browser for SQLite) ou via linha de comando do SQLite.

1.  **Inicie o servidor em modo de desenvolvimento:**

Use o script `dev` definido no `package.json`, que utiliza o `nodemon` para iniciar a aplicação em modo de desenvolvimento:

```bash
npm run dev
```

Ao executar o comando, você verá a seguinte mensagem no console, indicando que o servidor está no ar e pronto para receber requisições:

```
🚀 - Servidor iniciado na porta 3000
```

## Rotas da API (Endpoints)

A API possui as seguintes rotas disponíveis:

### `GET /`
*   **Descrição:** Rota raiz que retorna uma mensagem de boas-vindas.
*   **Resposta de Sucesso (200):**
    ```json
    {
        "status": 200,
        "mensagem": "Bem vindos a Minha primeira Api!",
        "Versão": "1.0"
    }
    ```

### `GET /users`
*   **Descrição:** Retorna uma lista com todos os usuários cadastrados.
*   **Resposta de Sucesso (200):**
    ```json
    [
        { "id": 2, "nome": "Jane Doe", "idade": 30, "email": "jane@example.com" },
        { "id": 1, "nome": "John Doe", "idade": 25, "email": "john@example.com" }
    ]
    ```

### `GET /users/dash/count`
*   **Descrição:** Retorna a contagem total de usuários no banco de dados.
*   **Resposta de Sucesso (200):** `{"totalUsers": 15}`

### `GET /users/:id`
*   **Descrição:** Busca e retorna um usuário específico com base no `id` fornecido na URL.
*   **Resposta de Sucesso (200):** `{"id": 1, "nome": "John Doe", "idade": 25, "email": "john@example.com"}`
*   **Resposta de Erro (404):** `Usuário não encontrado !`

### `POST /cadUsers`
*   **Descrição:** Cria um novo usuário. Realiza múltiplas validações e usa uma transação para garantir a integridade dos dados.
*   **Corpo da Requisição (Exemplo):**
    ```json
    {
        "nome": "Fulano de Tal",
        "idade": 28,
        "email": "fulano.tal@example.com",
        "cpf": "12345678901",
        "senha": "SenhaForte123",
        "confirmaSenha": "SenhaForte123"
    }
    ```
*   **Resposta de Sucesso (201):** `{"message": "Usuário cadastrado com sucesso!"}`

### `POST /login`
*   **Descrição:** Autentica um usuário com base no e-mail e senha.
*   **Corpo da Requisição (Exemplo):** `{"email": "fulano.tal@example.com", "senha": "SenhaForte123"}`
*   **Resposta de Sucesso (200):** `{"message": "Login realizado com sucesso!", "user": {"id": 3, "nome": "Fulano de Tal", "email": "fulano.tal@example.com"}}`

### `PUT /users/update/:id`
*   **Descrição:** Atualiza os dados de um usuário existente.
*   **Corpo da Requisição (Exemplo):**
    ```json
    {
        "nome": "Fulano de Tal Silva",
        "idade": 29,
        "email": "fulano.silva@example.com"
    }
    ```
*   **Resposta de Sucesso (200):** `{"message": "Usuário atualizado com sucesso!"}`
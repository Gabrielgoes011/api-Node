--cria o banco
CREATE DATABASE IF NOT EXISTS UserDB;
USE UserDB;

--Cria a primeira tabela chamada "TabUser"
CREATE TABLE TabUser(  
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(255) NOT NULL,
    idade INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL
);

--Cria a segunda tabela chamada "TabUserCred"
CREATE TABLE TabUserCred(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    password VARCHAR(255) NOT NULL,
    idUser INTEGER UNIQUE NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT 1,
    dt_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,   -- Quando o registro foi criado
    dt_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Quando o registro foi atualizado
    adminSistem BOOLEAN NOT NULL DEFAULT 0,
    adminLocal BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (idUser) REFERENCES TabUser(id)
)   
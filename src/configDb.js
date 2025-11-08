//importa as bibliotecas sqlite 
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

//cria uma conexão com o banco de dados SQLite
export async function openDb () {
    return open({
        filename: 'db/database.db', //caminho do arquivo do banco de dados
        driver: sqlite3.Database //driver do banco de dados
    });
}
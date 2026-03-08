import { openDb } from "../../configDb.js"

//exporta a função de validação do usuário
export async function validaEmailExistente(email, db) {
  //verifica se o email já existe no banco de dados
  try {
    const existeEmail = await db.get(`
        SELECT id
        FROM TabUser
        WHERE email = ? `, [email]
    );
    return existeEmail; //retorna o resultado da consulta
  }
  catch (error) {
    console.error('Erro ao buscar email:', error);
    throw error; // Lança o erro para ser tratado em outro lugar, se necessário
  }
}

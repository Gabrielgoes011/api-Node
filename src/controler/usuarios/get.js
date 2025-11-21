import { openDb } from "../../configDb.js"


//exporta a função 
export async function listarUsuarios() {
  const db = await openDb(); //db.all busca todas as linhas
  return db.all(`        
        SELECT id, nome, idade, email
        FROM TabUser 
        ORDER BY id DESC `
  )
}

//exporta função de contagem - contar usuarios - dashboard
export async function contarUsuarios() {
  const db = await openDb(); // db.get busca apenas a primeira linha, ideal para COUNT
  return db.get(`
        SELECT COUNT(id) AS totalUsers
        FROM TabUser
    `);
}

//exporta a função buscaUserId  - //busca usuario pelo id
export async function buscaUserId(id, db) {

  try {
    const userId = await db.get(
      `SELECT id, nome
       FROM TabUser
       WHERE id = ? `, [id]
    );

    // Se db.get não encontrar nada, ele retorna 'undefined'.
    // A função simplesmente repassa esse 'undefined', quserá tratado na função que a chamou.
    return userId //retorna o id existente para usar na função

  } catch (error) {
    console.error('Erro ao buscar o usuário pelo ID:', error);
    throw error; // Lança o erro para ser tratado em outro lugar, se necessário
  }
}


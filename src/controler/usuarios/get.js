import { openDb } from "../../configDb.js"


//exporta a função 
export async function listarUsuarios () {
    const db = await openDb(); //db.all busca todas as linhas
    return db.all(`        
        SELECT id, nome, idade, email
        FROM TabUser 
        ORDER BY id DESC `
      )
    }

//exporta função de contagem
  export async function contarUsuarios () {
    const db = await openDb(); // db.get busca apenas a primeira linha, ideal para COUNT
    return db.get(`
        SELECT COUNT(id) AS totalUsers
        FROM TabUser
    `);
  }

//exporta a função buscaUserId  - //busca usuario pelo id
 export async function buscaUserId (id) {
  try {
      const db = await openDb(); //abre a conexão com o banco de dados
      const userId = await db.get(
           `SELECT id, nome
           FROM TabUser
           WHERE id = ? `, [id]
           ); 
        
          return userId //retorna o id existente para usar na função
        }  
          
      //caso ocorra um erro, captura e retorna erro 500
        catch (error) {
        console.error('Erro ao buscar o usuário pelo ID:', error);
        return res.status(500).send('Erro interno do servidor');
    }  
  }
    

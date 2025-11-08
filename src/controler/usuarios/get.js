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


 export async function buscaUserId (req, res, id) {
  try {
      const db = await openDb(); //abre a conexão com o banco de dados
      const userID = await db.get(
           `SELECT id
           FROM TabUser
           WHERE id = ? `, [id]
           ); //busca o usuario pelo id

      //se não econtrar o usuário
      if (!userID) {
         return res.status(404).send('Usuário não encontrado !');
       }
    } catch (error) {
        console.error('Erro ao buscar o usuário pelo ID:', error);
        return res.status(500).send('Erro interno do servidor');
    }  
  }
    

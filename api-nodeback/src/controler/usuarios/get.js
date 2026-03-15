import { openDb } from "../../config/configDb.js"


//#region função listarUsuarios - lista usuarios (ativos/inativos)
export async function listarUsuarios(req, res) {
  const db = await openDb();

  try {
    const parametro = req.query.status || 'on'; // Pega o parâmetro de status da query string, ou usa 'on' como padrão
    const blvalor = parametro === 'on' ? true : false; // Converte o parâmetro para booleano

    const resultado = await db.query(`        
        SELECT id, nome, cpf, idade, email, ativo
        FROM dbo."tabUser"
        WHERE ativo = $1 
        ORDER BY id DESC `, [blvalor]
    );

    // Se nenhum usuário for encontrado, responde com array vazio
    if (resultado.rows.length === 0) {
      return res.status(200).json([]);
    }

    // Responde com os usuários em formato JSON
    res.status(200).json(resultado.rows);

    // Se ocorrer um erro, responde com status 500 e a mensagem de erro
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários.' });
  }
}
//#endregion


//#region função de contagem - contar usuarios - dashboard
export async function contarUsuarios(req, res) {
  const db = await openDb();

  try {
    const resultado = await db.query(`
        SELECT COUNT(id) AS totalUsers
        FROM TabUser
    `);

    // No Postgres o count pode vir minúsculo (totalusers) dependendo do driver, 
    // mas como usamos AS totalUsers (sem aspas), o pg respeita ou minúsculo.
    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error('Erro ao contar usuários:', error);
    res.status(500).json({ error: 'Erro ao contar usuários.' });
  }
}
//#endregion


//#region função buscaUserId  - busca usuario pelo id
export async function buscaUserId(id, db) {

  try {
    // db.get não existe no pg, usamos db.query
    const resultado = await db.query(
      `SELECT id, nome
       FROM TabUser
       WHERE id = $1 `, [id]
    );

    return resultado.rows[0]; // Retorna o primeiro usuário encontrado ou undefined

  } catch (error) {
    console.error('Erro ao buscar o usuário pelo ID:', error);
    throw error; // Lança o erro para ser tratado em outro lugar, se necessário
  }
}

//#endregion
import { openDb } from '../../config/configDb.js';
import { validaEmailExistente } from '../validacoes/validaUser.js';
import { success, error, custom, serverError } from '../../utils/httpResponse.js';


//#region PUT - atualizar usuario
export async function atualizarUser(req, res) {

  const { nome, idade, email, status } = req.body; // Pega os dados do corpo da requisição
  const id = req.params.id;
  const db = await openDb(); // Abre a conexão com o banco de dados no início

  //verifica se todos os campos foram preenchidos
  if (nome === undefined || idade === undefined || email === undefined) {
    return res.status(400).json({ status: 400, message: 'Insira todos os campos obrigatórios !' });
  };

  //verifca se tem nome e sobrenome 
  if (!nome.trim().includes(' ')) {
    return res.status(400).json({ status: 400, message: 'Insira o nome e sobrenome!' });
  }

  //verifica se o email é válido
  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ status: 400, message: 'Email inválido !' });
  }

  //verifica se o email já existe no banco de dados
  if (email) {
    const existeEmail = await validaEmailExistente(email, db);
    //se o email existir e for diferente do id do usuário que está sendo atualizado, retorna erro de email já cadastrado
    if (existeEmail && existeEmail.id != id) {
      return res.status(400).json({ status: 400, message: 'Email já cadastrado !' });
    }
  }

  try {
    // Converte status 'on'/'off' para booleano
    const ativo = status === 'on' ? true : (status === 'off' ? false : undefined);

    // Se status foi fornecido, inclui na atualização
    let sql, params;
    if (ativo !== undefined) {
      sql = `
        UPDATE dbo."tabUser"
        SET nome = $1,
            idade = $2,
            email = $3,
            ativo = $4
        WHERE id = $5 
      `;
      params = [nome, idade, email, ativo, id];
    } else {
      sql = `
        UPDATE dbo."tabUser"
        SET nome = $1,
            idade = $2,
            email = $3
        WHERE id = $4 
      `;
      params = [nome, idade, email, id];
    }

    //roda a query de atualização
    await db.query(sql, params);
    return res.status(200).json({ status: 200, message: 'Usuário atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error);
    return res.status(500).json({ status: 500, message: 'Erro ao atualizar o usuário.' });
  }
}

//#endregion



//#region - Inativa ou Reativa User

export async function inativaReativaUser(req, res) {
  const { id } = req.params;
  const db = await openDb();

  try {
    // Busca o usuário para verificar existência e status atual
    const resultado = await db.query(`
      SELECT id, ativo 
      FROM dbo."tabUser"
      WHERE id = $1 `, [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ status: 404, message: 'Usuário não encontrado!' });
    }

    const usuario = resultado.rows[0];
    // Inverte o status atual (se true vira false, se false vira true)
    const novoStatus = !usuario.ativo;
    const msg = novoStatus ? 'Usuário reativado com sucesso!' : 'Usuário inativado com sucesso!';

    // Executa o update
    const update = await db.query(
      `UPDATE dbo."tabUser"
       SET ativo = $1
       WHERE id = $2`, [novoStatus, id]
    );

    if (update.rowCount === 0) {
      return res.status(400).json({ status: 400, message: 'Não foi possível atualizar o status.' });
    }

    return res.status(200).json({
      status: 200,
      message: msg,
      ativo: novoStatus
    });

  } catch (error) {
    console.error('Erro ao alterar status do usuário:', error);
    return res.status(500).json({ status: 500, message: 'Erro interno ao processar solicitação.' });
  }
}
//#endregion
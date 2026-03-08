import { openDb } from '../../configDb.js';
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

  if (email) {//verifica se o email já existe no banco de dados
    const existeEmail = await validaEmailExistente(email, db);
    if (existeEmail && existeEmail.id != id) {//se o email existir e for diferente do id do usuário que está ///sendo atualizado
      return req.res.status(400).json({ status: 400, message: 'Email já cadastrado !' });
    }
  }

  try {
    const db = await openDb(); //abre a conexão com o banco de dados

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



//#region - Inativa User

export async function inativaUser(req, res) {

  const { id } = req.params //pega o id da url da req
  const { valorAtivo } = req.body //pega o valor do body da req

  // Garante que qualquer valor "truthy" vire 1, senão 0
  const statusFinal = Number(Boolean(valorAtivo));

  if (statusFinal !== 0 && statusFinal !== 1) {
    return res.status(400).json({ status: 400, message: 'Status inválido!' });
  }

  // abre a conexão com banco
  const db = await openDb()

  try {
    const sql = await db.run(
      `UPDATE TabUser
       SET Ativo = ?
       WHERE id = ?`, [statusFinal, id]
    );

    if (sql.changes === 0) { // Verifica se algum registro foi atualizado
      return res.status(404).json({ status: 404, message: 'Usuário não encontrado.' });
    }

    return res.status(200).json(
      {
        status: 200,
        message: 'Usuário atualizado com sucesso!'
      }
    );
  } catch (error) {
    console.error('Erro ao inativar o usuário:', error);
    return res.status(400).json({ status: 400, message: 'Erro ao inativar o usuário.' });
  }
}
//#end region
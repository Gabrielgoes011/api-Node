import { openDb } from "../../config/configDb.js";
import { validaEmailExistente } from '../../utils/validaUser.js';
import apiResponse from '../../utils/httpResponse.js';
import {
  listarUsuariosService,
  cadastrarUserService
} from "../../services/cadastros/usuarios.services.js";


// Função para converter data de DD/MM/AAAA para YYYY-MM-DD
function converterDataParaPostgres(dataString) {
  if (!dataString) return null;
  const partes = dataString.split('/');
  if (partes.length !== 3) return null;
  const [dia, mes, ano] = partes;
  return `${ano}-${mes}-${dia}`;
}
//#region função buscaUserId - busca usuario pelo id
export async function buscaUserId(id, db) {
  try {
    const resultado = await db.query(
      `SELECT id, nome
       FROM usuarios
       WHERE id = $1 `, [id]
    );
    return resultado.rows[0];
  } catch (error) {
    console.error('Erro ao buscar o usuário pelo ID:', error);
    throw error;
  }
}
//#endregion

//#region função listarUsuarios - lista usuarios (ativos/inativos)
export async function listarUsuarios(req, res) {
  try {

    //verifica se o valor do parâmetro "status" é válido
    const parametro = req.query.status;

    //Chama a função do service para listar os usuários
    const usuarios = await listarUsuariosService(parametro);

    // Retorna os resultados da consulta em formato JSON
    apiResponse.success(res,
      'Usuários listados com sucesso!', usuarios, 200, true
    );
  } catch (error) {

    apiResponse.error(res,
      error.message || 'Erro ao listar usuários', 500);
  }
}
//#endregion

//#region função de contagem - contar usuarios - dashboard
export async function contarUsuarios(req, res) {
  const db = await openDb();
  try {
    const resultadoAtivo = await db.query(`
        SELECT COUNT(id) AS totalUsers
        FROM usuarios
        WHERE ativo = true
    `);

    const resultadoInativo = await db.query(`
        SELECT COUNT(id) AS totalUsers
        FROM usuarios
        WHERE ativo = false

    `);
    const resultadoTotal = await db.query(`
        SELECT COUNT(id) AS totalUsers
        FROM usuarios
    `);

    // Retorna a contagem de usuários ativos, inativos e total
    res.status(200).json({
      ativos: resultadoAtivo.rows[0].totalusers,
      inativos: resultadoInativo.rows[0].totalusers,
      total: resultadoTotal.rows[0].totalusers
    });
  } catch (error) {
    console.error('Erro ao contar usuários:', error);
    res.status(500).json({ error: 'Erro ao contar usuários.' });
  }
}
//#endregion

//#region Função para cadastrar usuarios
export async function cadastrarUser(req, res) {
  //recebe os dados do corpo da requisição
  const dados = req.body;
  //chama a função do serviço para cadastrar o usuário
  try {
    const cadastrarUser = await cadastrarUserService(dados);
    // Retorna os resultados da consulta em formato JSON
    apiResponse.success(res,
      'Usuário cadastrado com sucesso!', cadastrarUser, 201, true
    );
  } catch (error) {
    // Log do erro para depuração
    console.error('Erro ao cadastrar usuário:', error);
    // Retorna a mensagem detalhada do erro
    return apiResponse.error(res, error.message);
  }
}
//#endregion

//#region PUT - atualizar usuario
export async function atualizarUser(req, res) {
  const { nome, dataNascimento, email, status } = req.body;
  const id = req.params.id;
  const db = await openDb();

  if (nome === undefined || dataNascimento === undefined || email === undefined) {
    return res.status(400).json({ status: 400, message: 'Insira todos os campos obrigatórios !' });
  }
  if (!nome.trim().includes(' ')) {
    return res.status(400).json({ status: 400, message: 'Insira o nome e sobrenome!' });
  }
  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ status: 400, message: 'Email inválido !' });
  }

  // Validação da data de nascimento
  const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dataRegex.test(dataNascimento)) {
    return res.status(400).json({ status: 400, message: 'Data de nascimento deve estar no formato DD/MM/AAAA !' });
  }

  if (email) {
    const existeEmail = await validaEmailExistente(email, db);
    if (existeEmail && existeEmail.id != id) {
      return res.status(400).json({ status: 400, message: 'Email já cadastrado !' });
    }
  }

  try {
    const ativo = status === 'on' ? true : (status === 'off' ? false : undefined);
    const dataNascimentoPostgres = converterDataParaPostgres(dataNascimento);

    let sql, params;
    if (ativo !== undefined) {
      sql = `
        UPDATE dbo."tabUser"
        SET nome = $1,
            dataNascimento = $2,
            email = $3,
            ativo = $4
        WHERE id = $5
      `;
      params = [nome, dataNascimentoPostgres, email, ativo, id];
    } else {
      sql = `
        UPDATE dbo."tabUser"
        SET nome = $1,
            dataNascimento = $2,
            email = $3
        WHERE id = $4
      `;
      params = [nome, dataNascimentoPostgres, email, id];
    }

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
    const resultado = await db.query(`
      SELECT id, ativo 
      FROM usuarios
      WHERE id = $1 `, [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ status: 404, message: 'Usuário não encontrado!' });
    }

    const usuario = resultado.rows[0];
    const novoStatus = !usuario.ativo;
    const msg = novoStatus ? 'Usuário reativado com sucesso!' : 'Usuário inativado com sucesso!';

    const update = await db.query(
      `UPDATE usuarios
       SET ativo = $1
       WHERE id = $2`, [novoStatus, id]
    );

    if (update.rowCount === 0) {
      return res.status(400).json({ status: 400, message: 'Não foi possível atualizar o status.' });
    }

    return res.status(200).json({ status: 200, message: msg, ativo: novoStatus });
  } catch (error) {
    console.error('Erro ao alterar status do usuário:', error);
    return res.status(500).json({ status: 500, message: 'Erro interno ao processar solicitação.' });
  }
}
//#endregion

//#region DELETE - deletar usuario
export async function deleteUser(req, res) {
  const idUser = req.params.id;
  const db = await openDb();

  try {
    const existeUser = await buscaUserId(idUser, db);

    if (!existeUser) {
      return res.status(404).json({ error: 'Usuário não encontrado !' });
    }

    await db.query('BEGIN');

    await db.query(`
      DELETE 
      FROM "credenciaisUsuario"
      WHERE "idUser" = $1 `, [idUser]
    );

    await db.query(`
      DELETE 
      FROM usuarios
      WHERE id = $1 `, [idUser]
    );

    await db.query('COMMIT');

    return res.json({
      statusCode: 'Sucesso (200)',
      usuario: `${existeUser.nome}`,
      message: 'O usuario foi deletado com sucesso !'
    });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Erro ao deletar o usuário:', error);
    return res.status(400).json({ error: 'Erro ao deletar o usuário.' });
  }
}
//#endregion


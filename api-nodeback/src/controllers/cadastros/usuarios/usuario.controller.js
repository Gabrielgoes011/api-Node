import { openDb } from "../../../config/configDb.js";
import { validaEmailExistente } from '../../../utils/validacoes/validaUser.js';

// ─────────────────────────────────────────────
// FUNÇÕES AUXILIARES
// ─────────────────────────────────────────────

// Função para converter data de DD/MM/AAAA para YYYY-MM-DD
function converterDataParaPostgres(dataString) {
  if (!dataString) return null;
  const partes = dataString.split('/');
  if (partes.length !== 3) return null;
  const [dia, mes, ano] = partes;
  return `${ano}-${mes}-${dia}`;
}

// ─────────────────────────────────────────────
// FUNÇÕES AUXILIARES
// ─────────────────────────────────────────────

//#region função buscaUserId - busca usuario pelo id
export async function buscaUserId(id, db) {
  try {
    const resultado = await db.query(
      `SELECT id, nome
       FROM TabUser
       WHERE id = $1 `, [id]
    );
    return resultado.rows[0];
  } catch (error) {
    console.error('Erro ao buscar o usuário pelo ID:', error);
    throw error;
  }
}
//#endregion

// ─────────────────────────────────────────────
// GET
// ─────────────────────────────────────────────

//#region função listarUsuarios - lista usuarios (ativos/inativos)
export async function listarUsuarios(req, res) {
  const db = await openDb();
  try {
    const parametro = req.query.status || 'on';
    const blvalor = parametro === 'on' ? true : false;
    const resultado = await db.query(`        
        SELECT id, nome, cpf, email, ativo,
        EXTRACT(YEAR FROM AGE("dataNascimento")) AS idade
        FROM usuarios   
        WHERE ativo = $1 
        ORDER BY id DESC `, [blvalor]
    );
    if (resultado.rows.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários.' });
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

// ─────────────────────────────────────────────
// POST
// ─────────────────────────────────────────────

//#region Função para cadastrar usuarios
export async function cadastrarUser(req, res) {
  const user = req.body;
  const db = await openDb();

  if (!user.nome || !user.dataNascimento || !user.email || !user.cpf) {
    return res.status(400).json({ error: 'Insira todos os campos obrigatorios !' });
  }
  if (!user.nome.trim().includes(' ')) {
    return res.status(400).json({ error: 'Insira o nome e sobrenome!' });
  }
  if (user.cpf.length != 11) {
    return res.status(400).json({ error: 'CPF deve conter 11 digitos !' });
  }
  if (!user.email.includes('@') || !user.email.includes('.')) {
    return res.status(400).json({ error: 'Email inválido !' });
  }

  const existeEmail = await db.query(`
      SELECT id 
      FROM usuarios
      WHERE email = $1 `, [user.email]
  );
  if (existeEmail.rows.length > 0) {
    return res.status(400).json({ error: 'Email ja cadastrado!' });
  }

  const existeCpf = await db.query(`
      SELECT id
      FROM usuarios
      WHERE cpf = $1 `, [user.cpf]
  );
  if (existeCpf.rows.length > 0) {
    return res.status(400).json({ error: 'CPF já cadastrado !' });
  }

  //if (user.senha !== user.confirmaSenha) {
  //  return res.status(400).json({ error: 'As senhas não coincidem !' });
  //}
  //if (user.senha.length < 8) {
  //  return res.status(400).json({ error: 'A senha deve ter no mínimo 8 caracteres !' });
  //}
  //if (!/[A-Z]/.test(user.senha)) {
  //  return res.status(400).json({ error: 'A senha deve conter pelo menos uma letra maiúscula !' });
  //}

  // Converte DD/MM/AAAA → AAAA-MM-DD (padrão PostgreSQL)
  const [dia, mes, ano] = user.dataNascimento.split('/');
  const dataFormatada = `${ano}-${mes}-${dia}`;


  try {
    const senhaPura = user.senha;
    await db.query('BEGIN TRANSACTION');

    const insertUser = await db.query(`
        INSERT INTO usuarios
           (nome, "dataNascimento", email, cpf)
        VALUES 
          ($1, $2, LOWER($3), $4)
        RETURNING id`,
      [user.nome, dataFormatada, user.email, user.cpf]
    );

    //novoUserId é o id do usuário recém-criado, que é necessário para inserir a senha na tabela TabUserCred
    const newUserId = insertUser.rows[0].id;

    // Insere a senha padrão na tabela credenciaisUsuario associada ao novo usuário
    await db.query(`
        INSERT INTO "credenciaisUsuario"
          ( "password", "idUser")
        VALUES 
          ('Padrão123', $1)`,
      [newUserId]
    );
    await db.query('COMMIT');
    return res.status(201).json({ message: 'Usuário cadastrado com sucesso! ' });

  } catch (error) {

    await db.query('ROLLBACK');
    console.error('Erro ao inserir o usuário:', error);

    return res.status(500).json({ error: 'Erro ao inserir o usuário.', errorDetails: error.message });
  }
}
//#endregion

// ─────────────────────────────────────────────
// PUT
// ─────────────────────────────────────────────

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
      FROM dbo."tabUser"
      WHERE id = $1 `, [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ status: 404, message: 'Usuário não encontrado!' });
    }

    const usuario = resultado.rows[0];
    const novoStatus = !usuario.ativo;
    const msg = novoStatus ? 'Usuário reativado com sucesso!' : 'Usuário inativado com sucesso!';

    const update = await db.query(
      `UPDATE dbo."tabUser"
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

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

//#region DELETE - deletar usuario
export async function deleteUser(req, res) {
  const idUser = req.params.id;
  const db = await openDb();

  try {
    const existeUser = await buscaUserId(idUser, db);

    if (!existeUser) {
      return res.status(404).json({ error: 'Usuário não encontrado !' });
    }

    await db.run('BEGIN');

    await db.run(`
      DELETE 
      FROM TabUserCred
      WHERE idUser = ? `, [idUser]
    );

    await db.run(`
      DELETE 
      FROM TabUser
      WHERE id = ? `, [idUser]
    );

    await db.run('COMMIT');

    return res.json({
      statusCode: 'Sucesso (200)',
      usuario: `${existeUser.nome}`,
      message: 'O usuario foi deletado com sucesso !'
    });
  } catch (error) {
    await db.run('ROLLBACK');
    console.error('Erro ao deletar o usuário:', error);
    return res.status(400).json({ error: 'Erro ao deletar o usuário.' });
  } finally {
    db.close();
  }
}
//#endregion

//#region função login - login de usuário
export async function login(req, res) {
  const { email, senha } = req.body; //pega o email e senha do corpo da requisição
  const db = await openDb(); //abre a conexão com o banco de dados
  try {
    //verifica se o email e senha foram fornecidos
    if (!email || !senha) {
      return res.status(400).send('Email e senha são obrigatórios !');
    }
    //busca o usuário pelo email
    const user = await db.get(`
        SELECT id, nome, email
        FROM TabUser
        WHERE email = ? ` ,
      [email]
    );
    //se o usuário não for encontrado
    if (!user) {
      return res.status(404).send('Usuário não encontrado !');
    }
    //busca a senha do usuário na tabela TabUserCred
    const userCred = await db.get(`
        SELECT b.password
        FROM TabUser a INNER JOIN TabUserCred b 
        ON b.idUser = a.id
        WHERE a.email =  ? ` ,
      [email]
    );
    //verifica se a senha está correta
    if (userCred.password !== senha) {
      console.log(senha, userCred.password)
      return res.status(401).send('Senha incorreta !');
    }
    //se tudo estiver correto, responde com os dados do usuário
    res.status(200).json({
      message: 'Login realizado com sucesso !', user: user
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  } finally {
    db.close();
  }
}
//#endregion
import jwt from 'jsonwebtoken';
import { openDb } from '../../config/configDb.js';

//#region Login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validação básica dos campos
    if (!email || !password) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    const db = await openDb();

    // Busca o usuário e suas credenciais pelo e-mail
    const result = await db.query(
      `SELECT 
        a.id, a.email, b."password"
       FROM usuarios a INNER JOIN "credenciaisUsuario" b 
       ON a."idUser" = b.id
       WHERE a.email = $1`,
      [email]
    );

    // Usuário não encontrado
    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const usuario = result.rows[0];

    // Verifica se o usuário está ativo
    if (!usuario.ativo) {
      return res.status(403).json({ erro: 'Usuário inativo. Entre em contato com o administrador.' });
    }

    // Compara a senha (texto puro — troque por bcrypt quando implementar hash)
    if (password !== usuario.password) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    // Gera o token JWT com os dados do usuário
    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Retorna o token e os dados públicos do usuário
    return res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });

  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao realizar login.', detalhes: error.message });
  }
}
//#endregion

export { login };

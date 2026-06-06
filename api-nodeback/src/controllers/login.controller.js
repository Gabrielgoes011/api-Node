import jwt from 'jsonwebtoken';
import { openDb } from '../config/configDb.js';
import { autenticarUsuario } from '../services/login.services.js';

//#region => Lógica para login
export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    
    // Valida campos
    if (!email || !password) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }
    
    // Chama service para autenticar
    const resultado = await autenticarUsuario(email, password);
    
    // Retorna resposta HTTP com token e dados do usuário
    return res.status(200).json({
      message: 'Login bem-sucedido!',
      token: resultado.token,
      usuario: resultado.usuario
    });

  } catch (error) {
    // Em caso de erro, captura e retorna resposta adequada
    return res.status(401).json({ 
      erro: error.message 
    });
  }
}
//#endregion

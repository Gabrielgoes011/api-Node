import { openDb } from '../../configDb.js';
import { validaEmailExistente } from '../validacoes/validaUser.js';


//Função update - atualizar usuario
export async function atualizarUser(req, res) {

  const { nome, idade, email } = req.body; // Pega os dados do corpo da requisição
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
    const sql = `
      UPDATE TabUser
      SET nome = ? ,
          idade = ? ,
          email = ? 
      WHERE id = ? 
  `;
    //roda a query de atualização
    await db.run(sql, [nome, idade, email, id]);
    return res.status(400).json({ status: 200, message: 'Usuário atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error);
    return res.status(400).json({ status: 500, message: 'Erro ao atualizar o usuário.' });
  }
}
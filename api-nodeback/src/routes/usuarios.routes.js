import express from 'express';
import verificaJWT from '../middleware/auth/verificaJWT.js';
const router = express.Router();

// Importa o controller de usuários
import {
  contarUsuarios,
  listarUsuarios,
  cadastrarUser,
  atualizarUser,
  inativaReativaUser,
  deleteUser
} from '../controllers/cadastros/usuario.controller.js';

// Rotas para usuários
router.get('/users', verificaJWT, listarUsuarios);


router.get('/users/dash/count', verificaJWT, contarUsuarios);

// Rota para cadastrar usuário
router.post('/usuario/cadastrar', verificaJWT, cadastrarUser);
//body: { nome, email, password, cpf  }

router.put('/inativaUser/:id', verificaJWT, inativaReativaUser);
router.put('/users/update/:id', verificaJWT, atualizarUser);
router.delete('/users/delete/:id', verificaJWT, deleteUser);


export default router;
import express from 'express';
const router = express.Router();

// Importa o controller de usuários
import {
  contarUsuarios,
  listarUsuarios,
  cadastrarUser,
  atualizarUser,
  inativaReativaUser,
  deleteUser,
  login
} from '../controllers/cadastros/usuarios/usuario.controller.js';

// Rotas para usuários
router.get('/users', listarUsuarios);
router.get('/users/dash/count', contarUsuarios);
router.post('/cadUsers', cadastrarUser);
router.put('/inativaUser/:id', inativaReativaUser);
router.put('/users/update/:id', atualizarUser);
router.delete('/users/delete/:id', deleteUser);
router.post('/login', login);

export default router;
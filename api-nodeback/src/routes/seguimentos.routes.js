import express from 'express';
import verificaJWT from '../middleware/auth/verificaJWT.js';
const router = express.Router();

import {
  listarSeguimentos,
  contarSeguimentos,
  cadastrarSeguimento,
  deleteSeguimento,
  updateSeguimento
} from '../controllers/cadastros/seguimentos/seguimentos.controller.js';

router.get('/seguimentos', verificaJWT, listarSeguimentos);
router.get('/seguimentos/contar', verificaJWT, contarSeguimentos);
router.post('/seguimentos', verificaJWT, cadastrarSeguimento);
router.delete('/seguimentos/delete/:id', verificaJWT, deleteSeguimento);
router.put('/seguimentos/update', verificaJWT, updateSeguimento);
//router.put('/seguimentos/inativaReativa/:id', inativaReativaSeguimento);

export default router;

//#endregion
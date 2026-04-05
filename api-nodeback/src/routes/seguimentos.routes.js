import express from 'express';
const router = express.Router();

import {
  listarSeguimentos,
  contarSeguimentos,
  cadastrarSeguimento,
  deleteSeguimento
} from '../controllers/cadastros/seguimentos/seguimentos.controller.js';

router.get('/seguimentos', listarSeguimentos);
router.get('/seguimentos/contar', contarSeguimentos);
router.post('/seguimentos', cadastrarSeguimento);
router.delete('/seguimentos/delete/:id', deleteSeguimento);
//router.put('/seguimentos/update/:id', atualizarSeguimento);
//router.put('/seguimentos/inativaReativa/:id', inativaReativaSeguimento);

export default router;

//#endregion
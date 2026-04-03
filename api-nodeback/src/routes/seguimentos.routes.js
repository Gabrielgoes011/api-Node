import express from 'express';
const router = express.Router();

import {
  listarSeguimentos,
  contarSeguimentos,
  cadastrarSeguimento,
  atualizarSeguimento,
  inativaReativaSeguimento,
  deleteSeguimento
} from '../controllers/cadastros/seguimentos/seguimento.controller.js';

router.get('/seguimentos', contarSeguimentos);
//router.post('/seguimentos', cadastrarSeguimento);
//router.put('/seguimentos/update/:id', atualizarSeguimento);
//router.put('/seguimentos/inativaReativa/:id', inativaReativaSeguimento);
//router.delete('/seguimentos/delete/:id', deleteSeguimento);

export default router;

//#endregion
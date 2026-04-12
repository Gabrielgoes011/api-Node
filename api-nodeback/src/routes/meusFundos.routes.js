import express from 'express';
const router = express.Router();

import {
  cadastrarFundos,
  listarFundos

} from '../controllers/cadastros/meusFundos/meusFundos.controller.js';

// Rotas para meus fundos
router.get('/meusFundos', listarFundos);
router.post('/meusFundos', cadastrarFundos);

export default router;

//#endregion
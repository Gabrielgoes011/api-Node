import express from 'express';
const router = express.Router();

import {
  cadastrarFundos,
  listarFundos,
  contarFundosAtivos

} from '../controllers/cadastros/meusFundos/meusFundos.controller.js';

// Rotas para meus fundos
router.get('/meusFundos', listarFundos);
router.get('/meusFundos/contar', contarFundosAtivos);
router.post('/meusFundos', cadastrarFundos);


export default router;

//#endregion
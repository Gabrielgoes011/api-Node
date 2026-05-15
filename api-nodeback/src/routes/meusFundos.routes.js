const router = express.Router();
import express from 'express';
import verificaJWT from '../middleware/auth/verificaJWT.js';

import {
  cadastrarFundos,
  listarFundos,
  contarFundosAtivos
} from '../controllers/cadastros/meusFundos.controller.js';

// Rotas para meus fundos
router.get('/meusFundos', verificaJWT, listarFundos);
router.get('/meusFundos/contar', verificaJWT, contarFundosAtivos);
router.post('/meusFundos/cadastrar', verificaJWT, cadastrarFundos);


export default router;

//#endregion
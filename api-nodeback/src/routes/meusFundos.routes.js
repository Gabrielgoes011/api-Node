const router = express.Router();
import express from 'express';
import verificaJWT from '../middleware/auth/verificaJWT.js';

import {
  cadastrarFundos,
  listarFundos,
  contarFundosAtivos,
  deletarFundo
} from '../controllers/cadastros/meusFundos.controller.js';

// Rotas para meus fundos
router.get('/meusFundos', verificaJWT, listarFundos);
//header: id do usuario logado para listar apenas os fundos cadastrados por ele

router.get('/meusFundos/contar', verificaJWT, contarFundosAtivos);
//header: id do usuario logado para contar apenas os fundos cadastrados por ele

router.post('/meusFundos/cadastrar', verificaJWT, cadastrarFundos);
//header: id do usuario logado para cadastrar o fundo associado a ele

router.delete('/meusFundos/deletar/:id', verificaJWT, deletarFundo);
//header: id do fundo a ser deletado


export default router;

//#endregion
import express from 'express';
const router = express.Router();

import {
  listarOperacoes,
  lancarOperacao,
  carregaAtivosDropList
} from '../controllers/operacoes/operacoes.contoller.js';

router.post('/operacoes', listarOperacoes);
//body: { mes, ano }

router.post('/lancarOperacao', lancarOperacao);
//body: { idAtivo, dataOperacao, tipo, quantidade, preco }

router.get('/ativosDropList', carregaAtivosDropList);

export default router;

//#endregion
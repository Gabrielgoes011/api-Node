import express from 'express';
const router = express.Router();

import {
  listarOperacoes,
  lancarOperacao,
  carregaAtivosDropList,
  carregaDadosGraficoOperacoes
} from '../controllers/operacoes/operacoes.contoller.js';


router.get('/ativosDropList', carregaAtivosDropList);
//body: {} - sem parâmetros, apenas para carregar a lista de ativos para o dropdown list no frontend

router.post('/operacoes', listarOperacoes);
//body: { mes, ano }

router.post('/lancarOperacao', lancarOperacao);
//body: { idAtivo, dataOperacao, tipo, quantidade, preco }

router.post('/carregaDadosGraficoOperacoes', carregaDadosGraficoOperacoes);
//body: { ano }

export default router;

//#endregion
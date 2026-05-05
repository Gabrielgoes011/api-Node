import express from 'express';
import verificaJWT from '../middleware/auth/verificaJWT.js';
const router = express.Router();

import {
  listarOperacoes,
  lancarOperacao,
  carregaAtivosDropList,
  carregaDadosGraficoOperacoes,
  excluirOperacao
} from '../controllers/operacoes/operacoes.controller.js';


router.get('/ativosDropList', verificaJWT, carregaAtivosDropList);
//body: {} - sem parâmetros, apenas para carregar a lista de ativos para o dropdown list no frontend

router.post('/operacoes', verificaJWT, listarOperacoes);
//body: { mes, ano }

router.post('/lancarOperacao', verificaJWT, lancarOperacao);
//body: { idAtivo, dataOperacao, tipo, quantidade, preco }

router.post('/excluirOperacao', verificaJWT, excluirOperacao);
// body: { id }

router.post('/carregaDadosGraficoOperacoes', verificaJWT, carregaDadosGraficoOperacoes);
//body: { ano }

export default router;

//#endregion
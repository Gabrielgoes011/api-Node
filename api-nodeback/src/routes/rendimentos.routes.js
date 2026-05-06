import express from 'express';
import verificaJWT from '../middleware/auth/verificaJWT.js';
const router = express.Router();

import {
  listarRendimentos,
  carregarGraficoDashboard,
  carregarComparacaoAnual,
  carregarDadosModalNovoRendimento
} from '../controllers/rendimentos/rendimentos.controller.js';


router.post('/rendimentos', verificaJWT, listarRendimentos);
//body: { mes, ano }

router.post('/carregarGraficoDashboard', verificaJWT, carregarGraficoDashboard);
//body: { ano }

router.post('/carregarComparacaoAnual', verificaJWT, carregarComparacaoAnual);
//body: { anos: ['2023','2024','2025','2026'] }

router.get('/carregarDadosModalNovoRendimento', verificaJWT, carregarDadosModalNovoRendimento);
// sem body — retorna [{ id, ticker, nomeSeguimento }]


export default router;

//#endregion
import express from 'express';
import verificaJWT from '../middleware/auth/verificaJWT.js';
const router = express.Router();

import {
  listarRendimentos
} from '../controllers/rendimentos/rendimentos.controller.js';


router.post('/rendimentos', verificaJWT, listarRendimentos);
//body: { mes, ano }

export default router;

//#endregion
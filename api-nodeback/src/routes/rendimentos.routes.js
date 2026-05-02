import express from 'express';
const router = express.Router();

import {
  listarRendimentos
} from '../controllers/rendimentos/rendimentos.contoller.js';


router.post('/rendimentos', listarRendimentos);
//body: { mes, ano }

export default router;

//#endregion
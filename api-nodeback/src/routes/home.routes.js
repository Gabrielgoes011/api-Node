const router = express.Router();
import express from 'express';
import verificaJWT from '../middleware/auth/verificaJWT.js';

import {
    cardsHomeController
} from '../controllers/home.controller.js';

// Rota para carregar os dados do card
router.get('/home/cards', verificaJWT, cardsHomeController);
//header: id do usuario logado para listar apenas os dados associados a ele 

export default router;

//#endregion
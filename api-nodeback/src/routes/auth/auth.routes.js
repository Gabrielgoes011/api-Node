import express from 'express';
const router = express.Router();

import { login } from '../../controllers/login.controller.js';

//rota de login
router.post('/auth/login', login);
//header 

export default router;

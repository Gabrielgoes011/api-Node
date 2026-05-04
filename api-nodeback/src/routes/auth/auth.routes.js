import express from 'express';
const router = express.Router();

import { login } from '../../controllers/login/login.controller.js';

router.post('/auth/login', login);

export default router;

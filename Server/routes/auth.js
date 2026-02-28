import express from 'express';
const router = express.Router();
import { login } from '../controllers/authController.js';
import { loginValidators } from '../utils/validators.js';

router.post('/login', loginValidators, login);

export default router;

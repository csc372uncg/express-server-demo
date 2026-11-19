import { Router } from 'express';
import {
  getCurrentUserController,
  loginController,
  logoutController,
  signupController
} from '../controllers/auth.js';

const router = Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/me', getCurrentUserController);

export default router;

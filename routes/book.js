import { Router } from 'express';
import {
  createBookController,
  getAllBooksController,
  getBookByIdController,
  getBooksByTypeController,
  getBooksByAuthorController,
  updateBookController,
  deleteBookController
} from '../controllers/book.js';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

router.post('/', requireAuth, createBookController);
router.get('/', getAllBooksController);
router.get('/:id', getBookByIdController);
router.get('/type/:type', getBooksByTypeController);
router.get('/author/:author', getBooksByAuthorController);
router.put('/:id', requireAuth, updateBookController);
router.delete('/:id', requireAuth, deleteBookController);

export default router;
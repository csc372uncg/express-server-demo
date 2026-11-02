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

const router = Router();

router.post('/', createBookController);
router.get('/', getAllBooksController);
router.get('/:id', getBookByIdController);
router.get('/type/:type', getBooksByTypeController);
router.get('/author/:author', getBooksByAuthorController);
router.put('/:id', updateBookController);
router.delete('/:id', deleteBookController);

export default router;
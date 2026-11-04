import { createBook, getAllBooks, getBookById, getBooksByType, getBooksByAuthor, getBooksByTypeAndAuthor, updateBook, deleteBook } from '../models/book.js';

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function createBookController(req, res, next) {
  try {
    const { title, author, read, type } = req.body;
    if (!title || !author || !read || !type) {
      return next(createHttpError(400, 'All fields are required'));
    }
    const book = await createBook(title, author, read, type);
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
}

async function getAllBooksController(req, res, next) {
  try {
    const { type, author } = req.query;
    const normalizedType = typeof type === 'string' ? type.trim() : '';
    const normalizedAuthor = typeof author === 'string' ? author.trim() : '';
    const hasType = normalizedType !== '';
    const hasAuthor = normalizedAuthor !== '';
    if (hasType && hasAuthor) {
      const books = await getBooksByTypeAndAuthor(normalizedType, normalizedAuthor);
      res.status(200).json(books);
    } else if (hasType) {
      const books = await getBooksByType(normalizedType);
      res.status(200).json(books);
    } else if (hasAuthor) {
      const books = await getBooksByAuthor(normalizedAuthor);
      res.status(200).json(books);
    } else {
      let books = await getAllBooks();
      res.status(200).json(books);
    }
  } catch (error) {
    next(error);
  }
}

async function getBookByIdController(req, res, next) {
  try {
    const { id } = req.params;
    const book = await getBookById(id);
    if (!book) {
      return next(createHttpError(404, 'Book not found'));
    }
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
}

async function getBooksByTypeController(req, res, next) {
  try {
    const { type } = req.params;
    const books = await getBooksByType(type);
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
}

async function getBooksByAuthorController(req, res, next) {
  try {
    const { author } = req.params;
    const books = await getBooksByAuthor(author);
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
}

async function updateBookController(req, res, next) {
  try {
    const { id } = req.params;
    const { title, author, read, type } = req.body;
    const book = await updateBook(id, title, author, read, type);
    if (!book) {
      return next(createHttpError(404, 'Book not found'));
    }
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
}

async function deleteBookController(req, res, next) {
  try {
    const { id } = req.params;
    const book = await deleteBook(id);
    if (!book) {
      return next(createHttpError(404, 'Book not found'));
    }
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
}

export {
  createBookController,
  getAllBooksController,
  getBookByIdController,
  getBooksByTypeController,
  getBooksByAuthorController,
  updateBookController,
  deleteBookController
};

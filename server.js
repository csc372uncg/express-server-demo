import express from 'express';
import errorHandler from './middleware/errorHandler.js';
import logger from './middleware/logger.js';
import bookRouter from './routes/book.js';

const app = express();
app.use(logger);
app.use(express.json());

app.use('/api/books', bookRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
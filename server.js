import express from 'express';
import cors from 'cors';
import session from 'express-session';
import errorHandler from './middleware/errorHandler.js';
import logger from './middleware/logger.js';
import authRouter from './routes/auth.js';
import bookRouter from './routes/book.js';

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set');
}

const app = express();
app.use(logger);
app.use(express.json());
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

app.use(express.static('public'));
app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
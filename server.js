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
//Allow a Vite React client later!
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
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

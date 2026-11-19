import bcrypt from 'bcrypt';
import { createUser, getUserByUsername } from '../models/user.js';

const BCRYPT_ROUNDS = 12;

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateCredentials(username, password) {
  if (typeof username !== 'string' || typeof password !== 'string') {
    return 'Username and password are required';
  }

  const normalizedUsername = username.trim();
  if (!/^[a-zA-Z0-9_]{3,30}$/.test(normalizedUsername)) {
    return 'Username must be 3-30 characters and contain only letters, numbers, or underscores';
  }
  if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return 'Password must be at least 8 characters and no more than 72 bytes';
  }
  return null;
}

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function establishSession(req, user) {
  await regenerateSession(req);
  req.session.user = { id: user.id, username: user.username };
  await saveSession(req);
}

async function signupController(req, res, next) {
  const { username, password } = req.body || {};
  const validationError = validateCredentials(username, password);
  if (validationError) {
    return next(createHttpError(400, validationError));
  }

  try {
    const normalizedUsername = username.trim();
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await createUser(normalizedUsername, passwordHash);
    await establishSession(req, user);
    res.status(201).json({ user: { id: user.id, username: user.username } });
  } catch (error) {
    if (error.code === '23505') {
      return next(createHttpError(409, 'Username is already taken'));
    }
    next(error);
  }
}

async function loginController(req, res, next) {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    return next(createHttpError(400, 'Username and password are required'));
  }
  if (Buffer.byteLength(password, 'utf8') > 72) {
    return next(createHttpError(400, 'Password must be no more than 72 bytes'));
  }

  try {
    const user = await getUserByUsername(username.trim());
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return next(createHttpError(401, 'Invalid username or password'));
    }

    await establishSession(req, user);
    res.status(200).json({ user: { id: user.id, username: user.username } });
  } catch (error) {
    next(error);
  }
}

function logoutController(req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }
    res.clearCookie('connect.sid');
    res.status(204).end();
  });
}

function getCurrentUserController(req, res) {
  res.status(200).json({ user: req.session.user || null });
}

export {
  getCurrentUserController,
  loginController,
  logoutController,
  signupController
};

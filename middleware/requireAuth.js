function requireAuth(req, res, next) {
  if (!req.session.user) {
    res.status(401).json({ error: 'You must be logged in to perform this action' });
    return;
  }
  next();
}

export default requireAuth;

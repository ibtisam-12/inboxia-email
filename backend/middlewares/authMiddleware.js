// middlewares/authMiddleware.js
export default (req, res, next) => {
  const accessToken = req.headers['authorization']?.replace('Bearer ', '');
  if (!accessToken) {
    return res.status(401).json({ error: 'Missing access token' });
  }
  // Optionally, you can attach the token to req for use in controllers
  req.accessToken = accessToken;
  req.refreshToken = req.headers['x-refresh-token'];
  next();
};
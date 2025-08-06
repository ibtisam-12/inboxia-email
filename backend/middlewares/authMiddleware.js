// middlewares/authMiddleware.js
export default (req, res, next) => {
  const accessToken = req.headers['authorization']?.replace('Bearer ', '');
  if (!accessToken) {
    return res.status(401).json({ error: 'Missing access token' });
  }
  
  const refreshToken = req.headers['x-refresh-token'];
  if (!refreshToken) {
    return res.status(401).json({ error: 'Missing refresh token' });
  }
  
  // Attach the tokens to req for use in controllers
  req.accessToken = accessToken;
  req.refreshToken = refreshToken;
  next();
};

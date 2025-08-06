import express from 'express';
const router = express.Router();

router.post('/tokens', (req, res) => {
  const accessToken = req.headers['authorization']?.replace('Bearer ', '');
  const refreshToken = req.headers['x-refresh-token'];
  console.log('Received access token:', accessToken);
  console.log('Received refresh token:', refreshToken);
  res.json({ success: true });
});

export default router;
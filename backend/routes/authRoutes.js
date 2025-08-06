import express from 'express';
const router = express.Router();

router.post('/tokens', (req, res) => {
  // For demo/logging only; do not log tokens in production!
  res.json({ success: true });
});

export default router;
import { fetchAllLabels } from '../../services/gmailService.js';

export default async function getLabelsController(req, res, next) {
  try {
    const { accessToken, refreshToken } = req;
    
    if (!accessToken || !refreshToken) {
      return res.status(401).json({ error: 'Authentication tokens are missing' });
    }
    
    const labels = await fetchAllLabels(accessToken, refreshToken);
    
    res.status(200).json({
      message: 'Labels fetched successfully',
      labels: labels
    });
  } catch (err) {
    console.error('Error in getLabelsController:', err);
    next(err);
  }
} 
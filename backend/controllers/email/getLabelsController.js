import { fetchAllLabels } from '../../services/gmailService.js';

export default async function getLabelsController(req, res, next) {
  try {
    const { accessToken, refreshToken } = req;
    
    if (!accessToken || !refreshToken) {
      return res.status(401).json({ error: 'Authentication tokens are missing' });
    }
    
    // Get folders from database (tokens still required for consistency)
    const folders = await fetchAllLabels(accessToken, refreshToken);
    
    res.status(200).json({
      message: 'Folders fetched successfully from database',
      labels: folders
    });
  } catch (err) {
    console.error('Error in getLabelsController:', err);
    next(err);
  }
} 
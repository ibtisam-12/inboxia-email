import { fetchEmailsByFolder } from '../../services/gmailService.js';

export default async function getFolderEmailsController(req, res, next) {
  try {
    const { accessToken, refreshToken } = req;
    const { folderName } = req.query;
    
    if (!accessToken || !refreshToken) {
      return res.status(401).json({ error: 'Authentication tokens are missing' });
    }
    
    if (!folderName) {
      return res.status(400).json({ error: 'Folder name is required' });
    }
    
    const emails = await fetchEmailsByFolder(accessToken, refreshToken, folderName);
    
    res.status(200).json({
      message: `Emails fetched successfully from folder "${folderName}"`,
      emails: emails
    });
  } catch (err) {
    console.error('Error in getFolderEmailsController:', err);
    next(err);
  }
} 
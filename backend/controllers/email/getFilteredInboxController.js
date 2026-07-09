// controllers/email/getFilteredInboxController.js
import { fetchUnifiedInbox, fetchFullEmailsByIds, applyFiltersAndMoveToLabel } from '../../services/gmailService.js';

export async function getFilteredInbox(req, res) {
  try {
    const { accessToken, refreshToken } = req;
    const { keywords, folderName } = req.query;
    
    if (!accessToken || !refreshToken) {
      return res.status(401).json({ error: 'Authentication tokens are missing in req' });
    }
    
    if (!keywords || !folderName) {
      return res.status(400).json({ error: 'Keywords and folderName are required' });
    }
    
    const unifiedInboxEmails = await fetchUnifiedInbox(accessToken, refreshToken);
    
    if (!unifiedInboxEmails || unifiedInboxEmails.length === 0) {
      return res.status(200).json({ message: 'No emails to process', matchingEmails: [] });
    }
    
    const emailIds = unifiedInboxEmails.map(email => email.emailId);    
    const fullEmails = await fetchFullEmailsByIds(accessToken, refreshToken, emailIds);
    
    const fullEmailsMap = {};
    fullEmails.forEach(email => {
      if (email.emailId && !email.error) {
        fullEmailsMap[email.emailId] = email;
      }
    });
    
    const emailsWithFullData = unifiedInboxEmails.map(email => ({
      ...email,
      ...fullEmailsMap[email.emailId]
    })).filter(mergedEmail => mergedEmail.body || mergedEmail.headers);
    
    const filters = { keywords };
    const matchingEmails = await applyFiltersAndMoveToLabel(accessToken, refreshToken, emailsWithFullData, filters, folderName);
    
    res.status(200).json({
      message: 'Filters applied and matching emails processed',
      matchingEmails,
    });
  } catch (error) {
    console.error('Error in getFilteredInboxController:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
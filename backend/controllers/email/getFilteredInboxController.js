// controllers/email/getFilteredInboxController.js
import { fetchUnifiedInbox, fetchFullEmailsByIds, applyFiltersAndMoveToLabel } from '../../services/gmailService.js';

export async function getFilteredInbox(req, res) {
  try {
    const { accessToken, refreshToken } = req;  // Directly from req, as per your request
    const { keywords, folderName } = req.query;  // Get keywords as a comma-separated string
    
    console.log('Received request with query:', req.query);  // Logging for debugging
    
    if (!accessToken || !refreshToken) {
      console.log('Authentication tokens are missing in req');
      return res.status(401).json({ error: 'Authentication tokens are missing in req' });
    }
    
    if (!keywords || !folderName) {
      console.log('Keywords or folderName is missing');
      return res.status(400).json({ error: 'Keywords and folderName are required' });
    }
    
    // First get the unified inbox emails
    const unifiedInboxEmails = await fetchUnifiedInbox(accessToken, refreshToken);
    
    if (!unifiedInboxEmails || unifiedInboxEmails.length === 0) {
      console.log('No emails found in unified inbox');
      return res.status(200).json({ message: 'No emails to process', matchingEmails: [] });
    }
    
    // Extract email IDs from the unified inbox
    const emailIds = unifiedInboxEmails.map(email => email.emailId);
    
    // Fetch full email data for all emails
    const fullEmails = await fetchFullEmailsByIds(accessToken, refreshToken, emailIds);
    
    // Create a map for quick lookup of full email data
    const fullEmailsMap = {};
    fullEmails.forEach(email => {
      if (email.emailId && !email.error) {  // Skip emails with errors
        fullEmailsMap[email.emailId] = email;
      }
    });
    
    // Merge full email data with unified inbox data
    const emailsWithFullData = unifiedInboxEmails.map(email => ({
      ...email,
      ...fullEmailsMap[email.emailId]  // Only merge if full data exists
    })).filter(mergedEmail => mergedEmail.body || mergedEmail.headers);  // Filter out emails without full data
    
    const filters = { keywords };  // Pass keywords as part of filters
    
    const matchingEmails = await applyFiltersAndMoveToLabel(accessToken, refreshToken, emailsWithFullData, filters, folderName);
    
    res.status(200).json({
      message: 'Filters applied and matching emails moved to label',
      matchingEmails,  // Return the list of matching emails
    });
  } catch (error) {
    console.error('Error in getFilteredInboxController:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
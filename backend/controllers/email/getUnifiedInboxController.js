import { fetchUnifiedInbox } from '../../services/gmailService.js';
import EmailDTO from '../../dtos/email.dto.js';

export default async function getUnifiedInbox(req, res, next) {
  try {
    console.log('getUnifiedInbox controller called');
    const { accessToken, refreshToken } = req;
    console.log('Fetching unified inbox with tokens:', {
      accessToken: accessToken ? 'present' : 'missing',
      refreshToken: refreshToken ? 'present' : 'missing'
    });
    
    const emails = await fetchUnifiedInbox(accessToken, refreshToken);
    console.log(`Fetched ${emails.length} emails for unified inbox`);
    
    // Log some information about the emails
    const inboxCount = emails.filter(email => email.source === 'inbox').length;
    const spamCount = emails.filter(email => email.source === 'spam').length;
    console.log(`Email breakdown - Inbox: ${inboxCount}, Spam: ${spamCount}`);
    
    const emailDTOs = emails.map(email => new EmailDTO(email));
    res.json({ emails: emailDTOs });
  } catch (err) {
    console.error('Error in getUnifiedInbox controller:', err);
    next(err);
  }
}
import { fetchUnifiedInbox } from '../../services/gmailService.js';
import EmailDTO from '../../dtos/email.dto.js';

export default async function getUnifiedInbox(req, res, next) {
  try {
    const { accessToken, refreshToken } = req;
    const emails = await fetchUnifiedInbox(accessToken, refreshToken);
    const emailDTOs = emails.map(email => new EmailDTO(email));
    res.json({ emails: emailDTOs });
  } catch (err) {
    console.error('Error in getUnifiedInbox controller:', err);
    next(err);
  }
}
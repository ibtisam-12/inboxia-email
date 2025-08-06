import { fetchInbox } from '../../services/gmailService.js';
import EmailDTO from '../../dtos/email.dto.js';

export default async function getInbox(req, res, next) {
  try {
    const messages = await fetchInbox(req.accessToken, req.refreshToken);
    const emailDTOs = messages.map(msg => new EmailDTO(msg));
    res.json({ emails: emailDTOs });
  } catch (err) {
    next(err);
  }
}
import { sendEmail } from '../../services/gmailService.js';

export default async function sendEmailController(req, res, next) {
  const { to, subject, body } = req.body;
  try {
    await sendEmail(req.accessToken, req.refreshToken, { to, subject, body });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
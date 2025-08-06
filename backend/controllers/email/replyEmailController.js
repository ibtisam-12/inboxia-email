import { replyEmail } from '../../services/gmailService.js';

export default async function replyEmailController(req, res, next) {
  const { to, subject, body, threadId } = req.body;
  try {
    await replyEmail(req.accessToken, req.refreshToken, { to, subject, body, threadId });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
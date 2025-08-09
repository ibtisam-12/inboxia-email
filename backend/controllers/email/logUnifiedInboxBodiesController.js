import { fetchUnifiedInboxEmailIds, logFullEmailsByIds } from '../../services/gmailService.js';

export default async function logUnifiedInboxBodiesController(req, res, next) {
  try {
    const { accessToken, refreshToken } = req;
    const emailIds = await fetchUnifiedInboxEmailIds(accessToken, refreshToken);
    await logFullEmailsByIds(accessToken, refreshToken, emailIds);
    res.json({ message: 'All unified inbox email bodies and headers printed to backend console.', count: emailIds.length });
  } catch (err) {
    next(err);
  }
}
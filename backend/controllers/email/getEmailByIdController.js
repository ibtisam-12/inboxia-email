import { getEmailById } from '../../services/gmailService.js';

export default async function getEmailByIdController(req, res, next) {
  const emailId = req.params.id;
  try {
    const email = await getEmailById(req.accessToken, req.refreshToken, emailId);
    res.json(email);
  } catch (err) {
    next(err);
  }
}
import { getEmailById } from '../../services/gmailService.js';

export default async function getEmailByIdController(req, res, next) {
  const emailId = req.params.id;
  try {
    const email = await getEmailById(req.accessToken, req.refreshToken, emailId);

    // Log body and labels to backend console
    console.log('Fetched email:', {
      emailId: email.emailId,
      labels: email.headers && email.headers['X-LabelIds'] ? email.headers['X-LabelIds'] : 'Labels not included in headers',
      subject: email.subject,
      from: email.from,
      to: email.to,
      date: email.date,
      body: email.body ? email.body.substring(0, 200) : '(no body)' // log first 200 chars
    });

    res.json(email);
  } catch (err) {
    next(err);
  }
}
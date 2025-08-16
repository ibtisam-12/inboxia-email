import { fetchUnifiedInboxEmailIds, logFullEmailsByIds,fetchFullEmailsByIds } from '../../services/gmailService.js';

export default async function logUnifiedInboxBodiesController(req, res, next) {
  try {
    const { accessToken, refreshToken } = req; // Extract tokens from the request
    const emailIds = await fetchUnifiedInboxEmailIds(accessToken, refreshToken); // Fetch the list of email IDs
    const fullEmails = await fetchFullEmailsByIds(accessToken, refreshToken, emailIds); // Fetch the full email data using the IDs
    res.json(fullEmails); 
  } catch (err) {
    next(err); // Pass errors to error-handling middleware
  }
}
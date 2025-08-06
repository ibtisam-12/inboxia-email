import express from 'express';
import { getInbox, sendEmail, replyEmail, getEmailById } from '../controllers/emailController.js';

const router = express.Router();

router.get('/inbox', getInbox);
router.post('/send', sendEmail);
router.post('/reply', replyEmail);
router.get('/message/:id', getEmailById);

export default router;
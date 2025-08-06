import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import getInbox from '../controllers/email/getInboxController.js';
import sendEmail from '../controllers/email/sendEmailController.js';
import replyEmail from '../controllers/email/replyEmailController.js';
import getEmailById from '../controllers/email/getEmailByIdController.js';
import getUnifiedInbox from '../controllers/email/getUnifiedInboxController.js';

const router = express.Router();

router.get('/inbox', authMiddleware, getInbox);
router.post('/send', authMiddleware, sendEmail);
router.post('/reply', authMiddleware, replyEmail);
router.get('/message/:id', authMiddleware, getEmailById);
router.get('/unified-inbox', authMiddleware, getUnifiedInbox);
export default router;
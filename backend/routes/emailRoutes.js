import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import getInbox from '../controllers/email/getInboxController.js';
import sendEmail from '../controllers/email/sendEmailController.js';
import replyEmail from '../controllers/email/replyEmailController.js';
import getEmailById from '../controllers/email/getEmailByIdController.js';
import getUnifiedInbox from '../controllers/email/getUnifiedInboxController.js';
import logUnifiedInboxBodiesController from '../controllers/email/logUnifiedInboxBodiesController.js';
import { getFilteredInbox } from '../controllers/email/getFilteredInboxController.js';
import getLabelsController from '../controllers/email/getLabelsController.js';
import getFolderEmailsController from '../controllers/email/getFolderEmailsController.js';

const router = express.Router();

router.get('/inbox', authMiddleware, getInbox);
router.post('/send', authMiddleware, sendEmail);
router.post('/reply', authMiddleware, replyEmail);
router.get('/message/:id', authMiddleware, getEmailById);
router.get('/unified-inbox', authMiddleware, getUnifiedInbox);
router.get('/log-unified-inbox-bodies', authMiddleware, logUnifiedInboxBodiesController);
router.get('/filtered-inbox', authMiddleware, getFilteredInbox);
router.get('/labels', authMiddleware, getLabelsController);
router.get('/folder-emails', authMiddleware, getFolderEmailsController);

export default router;
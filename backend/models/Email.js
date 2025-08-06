import mongoose from 'mongoose';

// Email Schema
const emailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emailId: { type: String, required: true },  // Gmail unique email ID
  threadId: { type: String, required: true },  // Gmail thread ID for grouping emails
  from: { type: String, required: true },  // Sender's email
  to: { type: String, required: true },  // Recipient's email
  subject: { type: String, required: true },  // Subject of the email
  date: { type: Date, required: true },  // Date email was received or sent
  labels: { type: [String], default: [] },  // Labels applied to the email (e.g., 'work', 'important')
  isRead: { type: Boolean, default: false },  // Whether the email is read or unread
  snippet: { type: String, default: '' },  // Snippet of the email (preview)
  folder: { type: String, default: 'Inbox' },  // Folder where the email is stored
});

const Email = mongoose.model('Email', emailSchema);

export default Email;

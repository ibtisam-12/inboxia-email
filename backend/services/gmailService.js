// services/gmailService.js
import { google } from 'googleapis';
import { 
  saveProcessedEmail, 
  isEmailProcessed, 
  getEmailIdsFromFolder, 
  getAllFolders
} from './firebaseService.js';

function getGmailClient(accessToken, refreshToken) {
  // Validate that we have the required environment variables
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Missing Google OAuth2 credentials in environment variables');
  }
  
  // Validate that we have the required tokens
  if (!accessToken || !refreshToken) {
    throw new Error('Missing access token or refresh token');
  }
  
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oAuth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  });
  return google.gmail({ version: 'v1', auth: oAuth2Client });
}

export async function fetchInbox(accessToken, refreshToken) {
  try {
    const gmail = getGmailClient(accessToken, refreshToken);
    const { data } = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 51,
      q: 'in:inbox',
    });

    const messages = await Promise.all(
      (data.messages || []).map(async (msg) => {
        try {
          const msgData = await gmail.users.messages.get({ userId: 'me', id: msg.id, format: 'full' });
          const headers = {};
          (msgData.data.payload.headers || []).forEach(h => { headers[h.name] = h.value; });
          return {
            emailId: msgData.data.id,
            subject: headers.Subject || '',
            from: headers.From || '',
            to: headers.To || '',
            date: headers.Date || '',
            snippet: msgData.data.snippet || '',
            threadId: msgData.data.threadId,
          };
        } catch (error) {
          console.error(`Error fetching message ${msg.id}:`, error);
          return null;
        }
      })
    );
    
    // Filter out any null values from failed message fetches
    return messages.filter(message => message !== null);
  } catch (error) {
    console.error('Error fetching inbox:', error);
    throw error;
  }
}

export async function sendEmail(accessToken, refreshToken, { to, subject, body }) {
  try {
    const gmail = getGmailClient(accessToken, refreshToken);
    const message =
      `To: ${to}\r\n` +
      `Subject: ${subject}\r\n\r\n` +
      `${body}`;
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function replyEmail(accessToken, refreshToken, { to, subject, body, threadId }) {
  try {
    const gmail = getGmailClient(accessToken, refreshToken);
    const message =
      `To: ${to}\r\n` +
      `Subject: Re: ${subject}\r\n` +
      `In-Reply-To: ${threadId}\r\n` +
      `References: ${threadId}\r\n\r\n` +
      `${body}`;
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage, threadId },
    });
  } catch (error) {
    console.error('Error replying to email:', error);
    throw error;
  }
}

export async function getEmailById(accessToken, refreshToken, emailId) {
  try {
    const gmail = getGmailClient(accessToken, refreshToken);
    const { data } = await gmail.users.messages.get({
      userId: 'me',
      id: emailId,
      format: 'full'
    });

    const headers = {};
    (data.payload.headers || []).forEach(h => { headers[h.name] = h.value; });

    let body = '';
    if (data.payload.parts) {
      const part = data.payload.parts.find(p => p.mimeType === 'text/plain');
      if (part && part.body && part.body.data) {
        body = Buffer.from(part.body.data, 'base64').toString('utf-8');
      }
    } else if (data.payload.body && data.payload.body.data) {
      body = Buffer.from(data.payload.body.data, 'base64').toString('utf-8');
    }

    return {
      emailId: data.id,
      threadId: data.threadId,
      subject: headers.Subject || '',
      from: headers.From || '',
      to: headers.To || '',
      date: headers.Date || '',
      body: body,
      headers: headers
    };
  } catch (error) {
    console.error(`Error fetching email ${emailId}:`, error);
    throw error;
  }
}

async function fetchEmailsByLabel(accessToken, refreshToken, label) {
  try {
    const gmail = getGmailClient(accessToken, refreshToken);
    let query = label === 'spam' ? 'in:spam' : `in:${label}`;
    
    const { data } = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 51,
      q: query,
    });

    if (!data.messages) return [];

    const messages = await Promise.all(
      data.messages.map(async (msg) => {
        try {
          const msgData = await gmail.users.messages.get({ userId: 'me', id: msg.id, format: 'full' });
          const headers = {};
          (msgData.data.payload.headers || []).forEach(h => { headers[h.name] = h.value; });
          return {
            emailId: msgData.data.id,
            subject: headers.Subject || '',
            from: headers.From || '',
            to: headers.To || '',
            date: headers.Date || '',
            snippet: msgData.data.snippet || '',
            threadId: msgData.data.threadId,
            source: label
          };
        } catch (error) {
          console.error(`Error fetching message ${msg.id}:`, error);
          return null;
        }
      })
    );
    
    return messages.filter(message => message !== null);
  } catch (error) {
    console.error(`Error fetching emails for label ${label}:`, error);
    throw error;
  }
}

export async function fetchUnifiedInbox(accessToken, refreshToken) {
  try {
    const [inboxEmails, spamEmails] = await Promise.all([
      fetchEmailsByLabel(accessToken, refreshToken, 'inbox'),
      fetchEmailsByLabel(accessToken, refreshToken, 'spam')
    ]);
    
    // Merge and remove duplicates by emailId
    const allEmails = [...inboxEmails, ...spamEmails];
    const uniqueEmailsMap = new Map();
    allEmails.forEach(email => {
      if (!uniqueEmailsMap.has(email.emailId)) {
        uniqueEmailsMap.set(email.emailId, email);
      }
    });
    
    let result = Array.from(uniqueEmailsMap.values());
    
    // Sort emails by date (newest first)
    result = result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      // Handle invalid dates by putting them at the end
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;
      
      // Sort in descending order (newest first)
      return dateB - dateA;
    });
    
    result = result.slice(0, 50);
    
    return result;
  } catch (error) {
    console.error('Error fetching unified inbox:', error);
    throw error;
  }
}

export async function fetchUnifiedInboxEmailIds(accessToken, refreshToken) {
  const [inboxEmails, spamEmails] = await Promise.all([
    fetchEmailsByLabel(accessToken, refreshToken, 'inbox'),
    fetchEmailsByLabel(accessToken, refreshToken, 'spam')
  ]);
  const allEmails = [...inboxEmails, ...spamEmails];
  const uniqueEmailIds = Array.from(new Set(allEmails.map(email => email.emailId)));
  return uniqueEmailIds;
}

export async function fetchFullEmailsByIds(accessToken, refreshToken, emailIds) {
  const gmail = getGmailClient(accessToken, refreshToken);
  const emails = [];

  for (const id of emailIds) {
    try {
      const msgData = await gmail.users.messages.get({ userId: 'me', id, format: 'full' });
      const headers = {};
      (msgData.data.payload.headers || []).forEach(h => { headers[h.name] = h.value; });

      let body = '';
      if (msgData.data.payload.parts) {
        const part = msgData.data.payload.parts.find(p => p.mimeType === 'text/plain');
        if (part && part.body && part.body.data) {
          body = Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
      } else if (msgData.data.payload.body && msgData.data.payload.body.data) {
        body = Buffer.from(msgData.data.payload.body.data, 'base64').toString('utf-8');
      }

      emails.push({
        emailId: msgData.data.id,
        headers,
        body
      });
    } catch (error) {
      console.error(`Error fetching message ${id}:`, error);
      emails.push({ emailId: id, error: error.message });
    }
  }

  return emails;
}
function cleanString(str) {
  if (!str) return '';
  return str.replace(/[^\w\s]/gi, '').trim().toLowerCase();  // Remove punctuation and extra spaces
}

export function applyFilters(emails, filters) {
  if (!emails || emails.length === 0) {
    return [];
  }
  
  const { keywords } = filters;
  const keywordArray = Array.isArray(keywords) ? keywords : (keywords ? keywords.split(',') : []);
  const keywordArrayCleaned = keywordArray.map(keyword => cleanString(keyword));
  
  if (keywordArrayCleaned.length === 0 || keywordArrayCleaned.every(k => k === '')) {
    return [];
  }
  
  return emails.filter(email => {
    const bodyCleaned = cleanString(email.body || '');
    const headersString = Object.values(email.headers || {})
      .map(header => cleanString(header))
      .join(' ');
    
    for (const keyword of keywordArrayCleaned) {
      if (keyword && (bodyCleaned.includes(keyword) || headersString.includes(keyword))) {
        return true;
      }
    }
    
    return false;
  });
}

export async function applyFiltersAndMoveToLabel(accessToken, refreshToken, emails, filters, folderName) {
  try {
    // Filter out already processed emails
    const filteredEmails = await Promise.all(emails.map(async (email) => {
      const isProcessed = await isEmailProcessed(email.emailId, folderName);
      if (isProcessed) {
        return null;
      }
      return email;
    }));
    
    const emailsToProcess = filteredEmails.filter(email => email !== null);
    const matchingEmails = applyFilters(emailsToProcess, filters);
    
    for (const email of matchingEmails) {
      // Save processing record (this creates the folder automatically in database)
      // No Gmail label creation or email moving - pure database-only approach
      await saveProcessedEmail(email.emailId, folderName, filters);
    }
    
    return matchingEmails;
  } catch (error) {
    console.error('Error applying filters and organizing emails:', error);
    throw error;
  }
}

// Updated function to get folders from database instead of Gmail API
export async function fetchAllLabels(accessToken, refreshToken) {
  try {
    // Get folders from database instead of Gmail API
    const folders = await getAllFolders();
    
    return folders.map(folder => ({
      id: folder.name, // Use folder name as ID for database folders
      name: folder.name,
      messageListVisibility: 'show',
      labelListVisibility: 'labelShow',
      type: 'user',
      emailCount: folder.emailCount,
      createdAt: folder.createdAt
    }));
  } catch (error) {
    console.error('Error fetching folders from database:', error);
    throw error;
  }
}

// Updated function to get email IDs from database and fetch details from Gmail API
export async function fetchEmailsByFolder(accessToken, refreshToken, folderName) {
  try {
    // Get email IDs from processedEmails database
    const emailIds = await getEmailIdsFromFolder(folderName);
    
    if (emailIds.length === 0) {
      return [];
    }
    
    // Fetch full email details from Gmail API for each email ID
    const gmail = getGmailClient(accessToken, refreshToken);
    const emails = await Promise.all(
      emailIds.map(async (emailId) => {
        try {
          const emailDetails = await getEmailById(accessToken, refreshToken, emailId);
          return {
            ...emailDetails,
            labels: [folderName],
            addedAt: new Date().toISOString() // Since we don't store this in processedEmails
          };
        } catch (error) {
          console.error(`Error fetching email ${emailId} from Gmail API:`, error);
          // Return a minimal email object if Gmail API fails
          return {
            emailId: emailId,
            subject: 'Error loading email',
            from: 'Unknown',
            to: '',
            date: '',
            body: '',
            snippet: 'Failed to load email from Gmail API',
            threadId: '',
            labels: [folderName],
            addedAt: new Date().toISOString()
          };
        }
      })
    );
    
    return emails;
  } catch (error) {
    console.error(`Error fetching emails for folder ${folderName}:`, error);
    throw error;
  }
}

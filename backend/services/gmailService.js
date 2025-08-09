// services/gmailService.js
import { google } from 'googleapis';

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
    
    // Try different approaches for accessing spam emails
    let query;
    if (label === 'spam') {
      // Try multiple approaches for spam emails
      query = 'in:spam';
      console.log(`Fetching spam emails with query: ${query}`);
    } else {
      query = `in:${label}`;
      console.log(`Fetching emails with query: ${query}`);
    }
    
    const { data } = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 51,
      q: query,
    });

    console.log(`Found ${data.messages ? data.messages.length : 0} messages in ${label}`);
    
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
            source: label // "inbox" or "spam"
          };
        } catch (error) {
          console.error(`Error fetching message ${msg.id}:`, error);
          return null;
        }
      })
    );
    
    console.log(`Successfully fetched ${messages.filter(m => m !== null).length} messages from ${label}`);
    
    // Filter out any null values from failed message fetches
    return messages.filter(message => message !== null);
  } catch (error) {
    console.error(`Error fetching emails for label ${label}:`, error);
    throw error;
  }
}

export async function fetchUnifiedInbox(accessToken, refreshToken) {
  try {
    console.log('Fetching unified inbox');
    const [inboxEmails, spamEmails] = await Promise.all([
      fetchEmailsByLabel(accessToken, refreshToken, 'inbox'),
      fetchEmailsByLabel(accessToken, refreshToken, 'spam')  // Using lowercase 'spam'
    ]);

    console.log(`Fetched ${inboxEmails.length} inbox emails and ${spamEmails.length} spam emails`);
    
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
    
    // Limit to first 50 emails after sorting
    result = result.slice(0, 50);
    
    console.log(`Returning ${result.length} unique emails in unified inbox (sorted by date, limited to 50)`);
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

// For each email ID, fetch and log full body + headers
export async function logFullEmailsByIds(accessToken, refreshToken, emailIds) {
  const gmail = getGmailClient(accessToken, refreshToken);

  for (const id of emailIds) {
    try {
      const msgData = await gmail.users.messages.get({ userId: 'me', id, format: 'full' });
      const headers = {};
      (msgData.data.payload.headers || []).forEach(h => { headers[h.name] = h.value; });

      // Extract plain text body
      let body = '';
      if (msgData.data.payload.parts) {
        const part = msgData.data.payload.parts.find(p => p.mimeType === 'text/plain');
        if (part && part.body && part.body.data) {
          body = Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
      } else if (msgData.data.payload.body && msgData.data.payload.body.data) {
        body = Buffer.from(msgData.data.payload.body.data, 'base64').toString('utf-8');
      }

      // Log full body and headers
      console.log('Email:', {
        emailId: msgData.data.id,
        headers,
        body
      });
    } catch (error) {
      console.error(`Error fetching message ${id}:`, error);
    }
  }
}
// services/gmailService.js
import { google } from 'googleapis';

function getGmailClient(accessToken, refreshToken) {
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
  const gmail = getGmailClient(accessToken, refreshToken);
  const { data } = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 50,
    q: 'in:inbox',
  });

  const messages = await Promise.all(
    (data.messages || []).map(async (msg) => {
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
    })
  );
  return messages;
}

export async function sendEmail(accessToken, refreshToken, { to, subject, body }) {
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
}

export async function replyEmail(accessToken, refreshToken, { to, subject, body, threadId }) {
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
}

export async function getEmailById(accessToken, refreshToken, emailId) {
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
}
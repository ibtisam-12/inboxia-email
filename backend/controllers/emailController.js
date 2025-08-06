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

export const getInbox = async (req, res) => {
  const accessToken = req.headers['authorization']?.replace('Bearer ', '');
  const refreshToken = req.headers['x-refresh-token'];
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);

  if (!accessToken) return res.status(401).json({ error: 'Missing access token' });

  try {
    const gmail = getGmailClient(accessToken, refreshToken);
    const { data } = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 50,
      q: 'in:inbox',
    });

    // Fetch message details
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

    res.json({ emails: messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
};

export const sendEmail = async (req, res) => {
  const accessToken = req.headers['authorization']?.replace('Bearer ', '');
  const refreshToken = req.headers['x-refresh-token'];
  const { to, subject, body } = req.body;
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);

  if (!accessToken) return res.status(401).json({ error: 'Missing access token' });

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

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

export const replyEmail = async (req, res) => {
  const accessToken = req.headers['authorization']?.replace('Bearer ', '');
  const refreshToken = req.headers['x-refresh-token'];
  const { to, subject, body, threadId } = req.body;
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);

  if (!accessToken) return res.status(401).json({ error: 'Missing access token' });

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

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send reply' });
  }
};
export const getEmailById = async (req, res) => {
  const accessToken = req.headers['authorization']?.replace('Bearer ', '');
  const refreshToken = req.headers['x-refresh-token'];
  const emailId = req.params.id;
  if (!accessToken) return res.status(401).json({ error: 'Missing access token' });

  try {
    const gmail = getGmailClient(accessToken, refreshToken);
    const { data } = await gmail.users.messages.get({
      userId: 'me',
      id: emailId,
      format: 'full'
    });

    // Parse headers
    const headers = {};
    (data.payload.headers || []).forEach(h => { headers[h.name] = h.value; });

    // Get body (plain text or HTML)
    let body = '';
    if (data.payload.parts) {
      // Find the plain text part
      const part = data.payload.parts.find(p => p.mimeType === 'text/plain');
      if (part && part.body && part.body.data) {
        body = Buffer.from(part.body.data, 'base64').toString('utf-8');
      }
    } else if (data.payload.body && data.payload.body.data) {
      body = Buffer.from(data.payload.body.data, 'base64').toString('utf-8');
    }

    res.json({
      emailId: data.id,
      threadId: data.threadId,
      subject: headers.Subject || '',
      from: headers.From || '',
      to: headers.To || '',
      date: headers.Date || '',
      body: body,
      headers: headers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch email details' });
  }
};
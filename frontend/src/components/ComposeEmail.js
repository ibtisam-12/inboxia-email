import React, { useState } from 'react';
import { Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api';
import { setSendingEmail, setSendEmailError } from '../slices/emailSlice';

const ComposeEmail = () => {
  const dispatch = useDispatch();
  const { sendingEmail, sendEmailError } = useSelector(state => state.emails);
  const { accessToken, refreshToken } = useSelector(state => state.user);

  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSendEmail = async () => {
    if (!to.trim() || !subject.trim() || !body.trim()) return alert('Please fill in all fields');
    if (!accessToken || !refreshToken) return dispatch(setSendEmailError('Please login again to send emails.'));
    dispatch(setSendingEmail(true));
    try {
      await api.post('/email/send', { to, subject, body }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-refresh-token': refreshToken
        }
      });
      setTo(''); setSubject(''); setBody('');
      alert('Email sent successfully!');
    } catch {
      dispatch(setSendEmailError('Failed to send email.'));
    } finally {
      dispatch(setSendingEmail(false));
    }
  };

  return (
    <div>
      {sendEmailError && <Alert variant="danger">{sendEmailError}</Alert>}
      <Form>
        <Form.Group>
          <Form.Label>To *</Form.Label>
          <Form.Control type="email" value={to} onChange={e => setTo(e.target.value)} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Subject *</Form.Label>
          <Form.Control type="text" value={subject} onChange={e => setSubject(e.target.value)} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Message *</Form.Label>
          <Form.Control as="textarea" rows={6} value={body} onChange={e => setBody(e.target.value)} required />
        </Form.Group>
        <Button onClick={handleSendEmail} disabled={sendingEmail || !to.trim() || !subject.trim() || !body.trim()}>
          {sendingEmail ? <Spinner as="span" animation="border" size="sm" /> : 'Send Email'}
        </Button>
      </Form>
    </div>
  );
};

export default ComposeEmail;
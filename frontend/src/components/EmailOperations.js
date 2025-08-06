import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setEmails, setLoading, setError, setSendingEmail, setSendEmailError,
  setReplyingToEmail, setReplyError, clearErrors
} from '../slices/emailSlice';
import api from '../api';
import ComposeEmail from './ComposeEmail';
import Inbox from './Inbox';
import EmailModal from './EmailModal';
import ReplyModal from './ReplyModal';

const EmailOperations = ({ activeView }) => {
  const dispatch = useDispatch();
  const { emails, loading, error, sendingEmail, sendEmailError, replyingToEmail, replyError } = useSelector((state) => state.emails);
  const { accessToken, userDetails, refreshToken } = useSelector((state) => state.user);

  // Reply modal state
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingToEmailId, setReplyingToEmailId] = useState(null);
  const [selectedReplyEmail, setSelectedReplyEmail] = useState(null);
  const [replyBody, setReplyBody] = useState('');

  // Email view modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Fetch emails from backend
  const fetchEmails = useCallback(async () => {
    if (!accessToken) {
      dispatch(setError('Please login again to access Gmail.'));
      return;
    }
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const response = await api.get('/email/unified-inbox', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-refresh-token': refreshToken
        }
      });
      dispatch(setEmails(response.data.emails));
    } catch (error) {
      dispatch(setError('Failed to fetch emails.'));
    }
  }, [accessToken, refreshToken, dispatch]);

  useEffect(() => {
    if (activeView === 'inbox' && accessToken) {
      fetchEmails();
    }
  }, [activeView, accessToken, fetchEmails]);

  // Fetch full email details from backend and show modal
  const handleEmailClick = async (emailId) => {
    if (!accessToken) {
      dispatch(setError('Please login again to access Gmail.'));
      return;
    }
    try {
      const response = await api.get(`/email/message/${emailId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-refresh-token': refreshToken
        }
      });
      setSelectedEmail(response.data);
      setShowEmailModal(true);
    } catch (error) {
      dispatch(setError('Failed to fetch email details.'));
    }
  };

  // Reply to email via backend
  const handleSendReply = async () => {
    if (!replyBody.trim()) {
      alert('Please enter a reply message');
      return;
    }
    if (!accessToken) {
      dispatch(setReplyError('Please login again to send replies.'));
      return;
    }
    dispatch(setReplyingToEmail(true));
    dispatch(clearErrors());
    try {
      await api.post('/email/reply', {
        to: selectedReplyEmail.from,
        subject: selectedReplyEmail.subject,
        body: replyBody,
        threadId: selectedReplyEmail.threadId
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-refresh-token': refreshToken
        }
      });
      setShowReplyModal(false);
      setReplyBody('');
      setReplyingToEmailId(null);
      setSelectedReplyEmail(null);
      alert('Reply sent successfully!');
      fetchEmails();
    } catch (error) {
      dispatch(setReplyError('Failed to send reply. Please try again.'));
    } finally {
      dispatch(setReplyingToEmail(false));
    }
  };

  const handleShowReplyModal = (emailId) => {
    const email = emails.find(e => e.emailId === emailId);
    setReplyingToEmailId(emailId);
    setSelectedReplyEmail(email);
    setShowReplyModal(true);
  };

  const handleCloseReplyModal = () => {
    setShowReplyModal(false);
    setReplyBody('');
    setReplyingToEmailId(null);
    setSelectedReplyEmail(null);
  };

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setSelectedEmail(null);
  };

  const clearAllErrors = () => {
    dispatch(clearErrors());
  };

  return (
    <div style={{ height: '100%' }}>
      {activeView === 'compose'
        ? <ComposeEmail />
        : <Inbox
            emails={emails}
            loading={loading}
            error={error}
            fetchEmails={fetchEmails}
            handleEmailClick={handleEmailClick}
            handleShowReplyModal={handleShowReplyModal}
            replyingToEmail={replyingToEmail}
            clearAllErrors={clearAllErrors}
          />
      }

      <EmailModal
        show={showEmailModal}
        handleClose={handleCloseEmailModal}
        email={selectedEmail}
      />

      <ReplyModal
        show={showReplyModal}
        handleClose={handleCloseReplyModal}
        replyBody={replyBody}
        setReplyBody={setReplyBody}
        handleSendReply={handleSendReply}
        replyingToEmail={replyingToEmail}
        replyError={replyError}
      />
    </div>
  );
};

export default EmailOperations;
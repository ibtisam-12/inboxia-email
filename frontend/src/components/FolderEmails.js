import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Badge, Spinner, Alert, Button, ListGroup, Modal } from 'react-bootstrap';
import api from '../api';

const FolderEmails = ({ folderName, onBack }) => {
  const { accessToken, refreshToken } = useSelector((state) => state.user);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailDetails, setEmailDetails] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const fetchFolderEmails = async () => {
    if (!accessToken) {
      setError('Authentication required. Please log in.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/email/folder-emails', {
        params: {
          folderName: folderName,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-refresh-token': refreshToken,
        },
      });

      const data = response.data;
      if (data && data.emails) {
        setEmails(data.emails);
      } else {
        setEmails([]);
      }
    } catch (err) {
      console.error('Error fetching folder emails:', err);
      const message = err.response?.data?.error || err.message || 'Failed to fetch folder emails.';
      setError(message);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailDetails = async (emailId) => {
    if (!accessToken) {
      setError('Authentication required. Please log in.');
      return;
    }

    setEmailLoading(true);
    setError(null);

    try {
      const response = await api.get(`/email/message/${emailId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-refresh-token': refreshToken,
        },
      });

      const data = response.data;
      if (data) {
        setEmailDetails(data);
      } else {
        setError('Failed to load email details.');
      }
    } catch (err) {
      console.error('Error fetching email details:', err);
      const message = err.response?.data?.error || err.message || 'Failed to fetch email details.';
      setError(message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleEmailClick = async (email) => {
    setSelectedEmail(email);
    setShowEmailModal(true);
    setEmailDetails(null);
    await fetchEmailDetails(email.emailId);
  };

  const handleCloseModal = () => {
    setShowEmailModal(false);
    setSelectedEmail(null);
    setEmailDetails(null);
  };

  useEffect(() => {
    fetchFolderEmails();
  }, [folderName, accessToken]);

  const handleRefresh = () => {
    fetchFolderEmails();
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return dateString || 'Unknown date';
    }
  };

  if (loading) {
    return (
      <div className="text-center p-3">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading emails...</span>
        </Spinner>
        <p className="mt-2 text-muted">Loading emails from "{folderName}"...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={onBack}
            className="me-3"
          >
            ← Back to Folders
          </Button>
          <h5 className="mb-0 d-inline">📧 Emails in "{folderName}"</h5>
        </div>
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={handleRefresh}
          disabled={loading}
        >
          🔄 Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {emails.length === 0 && !error && (
        <Alert variant="info">
          <h6>📭 No Emails Found</h6>
          <p className="mb-0">
            No emails found in folder "{folderName}". This folder might be empty or the emails might be in a different location.
          </p>
        </Alert>
      )}

      {emails.length > 0 && (
        <div>
          <Alert variant="success" className="mb-3">
            <strong>✅ {emails.length} email(s) found in "{folderName}"</strong>
            <br />
            <small className="text-muted">These emails are stored in the database and were organized by your filters.</small>
          </Alert>
          
          <ListGroup>
            {emails.map((email) => (
              <ListGroup.Item 
                key={email.emailId} 
                className="email-item"
                style={{ cursor: 'pointer' }}
                onClick={() => handleEmailClick(email)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h6 className="mb-1 email-subject">
                      {email.subject || 'No Subject'}
                    </h6>
                    <p className="mb-1 text-muted">
                      <strong>From:</strong> {email.from || 'Unknown'}
                    </p>
                    <p className="mb-1 text-muted">
                      <strong>Date:</strong> {formatDate(email.date)}
                    </p>
                    {email.snippet && (
                      <p className="mb-0 text-muted small">
                        {email.snippet.substring(0, 150)}...
                      </p>
                    )}
                    {email.addedAt && (
                      <p className="mb-0 text-muted small">
                        <strong>Added to folder:</strong> {formatDate(email.addedAt)}
                      </p>
                    )}
                  </div>
                  <div className="ms-3">
                    <Badge bg="primary">In Database</Badge>
                    <div className="mt-1">
                      <small className="text-muted">👆 Click to view full email</small>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}

      {/* Email Details Modal */}
      <Modal show={showEmailModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {emailLoading ? 'Loading Email...' : (emailDetails?.subject || 'Email Details')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {emailLoading ? (
            <div className="text-center p-3">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading email details...</span>
              </Spinner>
              <p className="mt-2 text-muted">Loading email details...</p>
            </div>
          ) : emailDetails ? (
            <div>
              <div className="mb-3">
                <h6>From:</h6>
                <p className="text-muted">{emailDetails.from || 'Unknown'}</p>
              </div>
              
              <div className="mb-3">
                <h6>To:</h6>
                <p className="text-muted">{emailDetails.to || 'Unknown'}</p>
              </div>
              
              <div className="mb-3">
                <h6>Date:</h6>
                <p className="text-muted">{formatDate(emailDetails.date)}</p>
              </div>
              
              <div className="mb-3">
                <h6>Subject:</h6>
                <p className="text-muted">{emailDetails.subject || 'No Subject'}</p>
              </div>
              
              {emailDetails.body && (
                <div className="mb-3">
                  <h6>Body:</h6>
                  <div 
                    className="border p-3 bg-light"
                    style={{ 
                      maxHeight: '400px', 
                      overflowY: 'auto',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace',
                      fontSize: '14px'
                    }}
                  >
                    {emailDetails.body}
                  </div>
                </div>
              )}
              
              {emailDetails.snippet && (
                <div className="mb-3">
                  <h6>Snippet:</h6>
                  <p className="text-muted">{emailDetails.snippet}</p>
                </div>
              )}
            </div>
          ) : (
            <Alert variant="danger">
              Failed to load email details. Please try again.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FolderEmails; 
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Badge, Spinner, Alert, Button, ListGroup } from 'react-bootstrap';
import api from '../api';

const FolderEmails = ({ folderName, onBack }) => {
  const { accessToken, refreshToken } = useSelector((state) => state.user);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          </Alert>
          
          <ListGroup>
            {emails.map((email) => (
              <ListGroup.Item key={email.emailId} className="email-item">
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
                  </div>
                  <div className="ms-3">
                    <Badge bg="primary">In Folder</Badge>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </div>
  );
};

export default FolderEmails; 
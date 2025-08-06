import React from 'react';
import { ListGroup, Button, Spinner, Alert } from 'react-bootstrap';

const Inbox = ({
  emails,
  loading,
  error,
  fetchEmails,
  handleEmailClick,
  handleShowReplyModal,
  replyingToEmail,
  clearAllErrors
}) => (
  <div>
    {error && (
      <Alert variant="danger" dismissible onClose={clearAllErrors}>
        {error}
      </Alert>
    )}
    <Button onClick={fetchEmails} disabled={loading} className="mb-3">
      {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Refresh'}
    </Button>
    <ListGroup>
      {emails.map((email) => (
        <ListGroup.Item
          key={email.emailId}
          as="div"
          className="email-item"
          onClick={() => handleEmailClick(email.emailId)} // Pass emailId
          style={{
            cursor: 'pointer',
            borderLeft: '4px solid #007bff',
            transition: 'all 0.2s ease'
          }}
        >
          <div className="d-flex justify-content-between align-items-start">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h6 className="mb-1 text-truncate" style={{ fontWeight: 'bold' }}>
                  {email.subject || 'No Subject'}
                </h6>
                <small className="text-muted">
                  {email.date ? new Date(email.date).toLocaleDateString() : ''}
                </small>
              </div>
              <p className="mb-1 text-muted text-truncate">
                <strong>From:</strong> {email.from}
              </p>
              <p className="mb-0 text-muted text-truncate">
                {email.snippet}
              </p>
            </div>
            <div className="ms-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  handleShowReplyModal(email.emailId);
                }}
                disabled={replyingToEmail}
              >
                💬 Reply
              </Button>
            </div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  </div>
);

export default Inbox;
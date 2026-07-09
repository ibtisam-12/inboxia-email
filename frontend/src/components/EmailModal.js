import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

// Place linkify function at the top
function sanitize(text) {
  if (!text) return '';
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '');
}

function linkify(text) {
  if (!text) return '';
  return sanitize(text).replace(
    /(https?:\/\/[^\s]+)/g,
    url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  );
}

const EmailModal = ({ show, handleClose, email }) => (
  <Modal show={show} onHide={handleClose} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>📧 {email?.subject || 'No Subject'}</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
      {email && (
        <div>
          <div className="mb-3">
            <Row>
              <Col md={6}><strong>From:</strong> {email.from}</Col>
              <Col md={6} className="text-end"><strong>Date:</strong> {email.date ? new Date(email.date).toLocaleString() : ''}</Col>
            </Row>
            <div className="mt-2"><strong>To:</strong> {email.to}</div>
          </div>
          <hr />
          <div
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: '14px',
              lineHeight: '1.6',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
              maxWidth: '100%',
              overflowWrap: 'break-word',
            }}
            dangerouslySetInnerHTML={{ __html: linkify(email.body || 'Email content not available.') }}
          />
        </div>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>Close</Button>
    </Modal.Footer>
  </Modal>
);

export default EmailModal;
import React from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const ReplyModal = ({ show, handleClose, replyBody, setReplyBody, handleSendReply, replyingToEmail, replyError }) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>💬 Reply to Email</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {replyError && <Alert variant="danger">{replyError}</Alert>}
      <Form.Group>
        <Form.Label>Your Reply</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          placeholder="Type your reply here..."
          value={replyBody}
          onChange={e => setReplyBody(e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </Form.Group>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>Cancel</Button>
      <Button
        variant="primary"
        onClick={handleSendReply}
        disabled={replyingToEmail || !replyBody.trim()}
      >
        {replyingToEmail ? (
          <>
            <Spinner as="span" animation="border" size="sm" className="me-2" />
            Sending...
          </>
        ) : (
          '📧 Send Reply'
        )}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ReplyModal;
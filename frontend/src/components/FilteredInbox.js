import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, ListGroup, Spinner, Button, Form, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';  // Import the api object for consistency

const FilteredInbox = () => {
  const dispatch = useDispatch();  // Keeping for consistency, though not used here
  const navigate = useNavigate();
  const { accessToken, refreshToken } = useSelector((state) => state.user.userDetails);
  const [keywords, setKeywords] = useState('');
  const [folderName, setFolderName] = useState('');
  const [matchingEmails, setMatchingEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('FilteredInbox mounted. Tokens:', { accessToken, refreshToken });
    if (!accessToken || !refreshToken) {
      setError('Authentication tokens are missing. You will be redirected to login.');
      console.log('Redirecting to login due to missing tokens.');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [accessToken, refreshToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keywords.trim() || !folderName.trim()) {
      setError('Keywords and folder name are required.');
      return;
    }

    setLoading(true);
    setError(null);
    console.log('Fetching filtered emails with:', { keywords, folderName });

    try {
      const response = await api.get('/email/filtered-inbox', {
        params: {
          keywords,
          folderName,
          accessToken,
          refreshToken,
        },
      });

      const data = response.data;  // Axios returns data directly
      console.log('API Response received:', data);
      setMatchingEmails(data.matchingEmails || []);
    } catch (err) {
      console.error('Error fetching filtered emails:', err);
      setError(err.message || 'An error occurred. Please try again. Check your tokens or API endpoint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h3>Filtered Inbox</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Keywords (comma-separated, e.g., hiring,internship)</Form.Label>
          <Form.Control
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g., hiring,internship"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Folder Name (e.g., job)</Form.Label>
          <Form.Control
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="e.g., job"
          />
        </Form.Group>
        <Button type="submit" variant="primary">Apply Filters</Button>
      </Form>
      {loading && <Spinner animation="border" className="mt-3" />}
      {matchingEmails.length > 0 && (
        <ListGroup className="mt-3">
          {matchingEmails.map((email) => (
            <ListGroup.Item key={email.emailId}>
              <strong>Subject:</strong> {email.subject} <br />
              <strong>From:</strong> {email.from} <br />
              <strong>Date:</strong> {email.date}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      {matchingEmails.length === 0 && !loading && !error && <Alert variant="info" className="mt-3">No matching emails found.</Alert>}
    </Container>
  );
};

export default FilteredInbox;
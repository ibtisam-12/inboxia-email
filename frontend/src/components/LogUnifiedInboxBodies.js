import React, { useState } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import api from '../api';

const LogUnifiedInboxBodies = () => {
  const { accessToken, refreshToken } = useSelector(state => state.user);
  const [logging, setLogging] = useState(false);
  const [logError, setLogError] = useState(null);
  const [logSuccess, setLogSuccess] = useState(false);

  const handleLogUnifiedInboxBodies = async () => {
    if (!accessToken || !refreshToken) {
      setLogError('Please login again to use this feature.');
      return;
    }
     
    setLogging(true);
    setLogError(null);
    setLogSuccess(false);
    
    try {
      const response = await api.get('/email/log-unified-inbox-bodies', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-refresh-token': refreshToken
        }
      });
      
      setLogSuccess(true);
      console.log(response.data.message);
      alert(`Success: ${response.data.message}`);
    } catch (error) {
      setLogError('Failed to log unified inbox bodies.');
      console.error('Error logging unified inbox bodies:', error);
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="mt-3">
      {logError && <Alert variant="danger">{logError}</Alert>}
      {logSuccess && <Alert variant="success">Email bodies and headers logged to console!</Alert>}
      <Button 
        onClick={handleLogUnifiedInboxBodies} 
        disabled={logging}
        variant="info"
        size="sm"
      >
        {logging ? <Spinner as="span" animation="border" size="sm" /> : 'Log Unified Inbox Bodies'}
      </Button>
    </div>
  );
};

export default LogUnifiedInboxBodies;
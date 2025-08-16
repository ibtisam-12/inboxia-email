import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import FolderEmails from './FolderEmails';
import api from '../api';

const FolderList = () => {
  const { accessToken, refreshToken } = useSelector((state) => state.user);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const fetchFolders = async () => {
    if (!accessToken) {
      setError('Authentication required. Please log in.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/email/labels', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-refresh-token': refreshToken,
        },
      });

      const data = response.data;
      if (data && data.labels) {
        setFolders(data.labels);
      } else {
        setFolders([]);
      }
    } catch (err) {
      console.error('Error fetching folders:', err);
      const message = err.response?.data?.error || err.message || 'Failed to fetch folders.';
      setError(message);
      setFolders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [accessToken]);

  const handleRefresh = () => {
    fetchFolders();
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
  };

  // If a folder is selected, show the emails
  if (selectedFolder) {
    return (
      <FolderEmails 
        folderName={selectedFolder.name} 
        onBack={handleBackToFolders}
      />
    );
  }

  if (loading) {
    return (
      <div className="text-center p-3">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading folders...</span>
        </Spinner>
        <p className="mt-2 text-muted">Loading your folders...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">📁 Created Folders</h5>
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

      {folders.length === 0 && !error && (
        <Alert variant="info">
          <h6>📂 No Folders Created Yet</h6>
          <p className="mb-0">
            You haven't created any folders yet. Use the Filtered Inbox feature to create your first folder!
          </p>
        </Alert>
      )}

      {folders.length > 0 && (
        <div className="row g-3">
          {folders.map((folder) => (
            <div key={folder.id} className="col-md-6 col-lg-4">
              <Card 
                className="h-100 folder-card" 
                style={{ cursor: 'pointer' }}
                onClick={() => handleFolderClick(folder)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <Card.Title className="mb-2">
                        📁 {folder.name}
                      </Card.Title>
                      <div className="mb-2">
                        <Badge 
                          bg={folder.messageListVisibility === 'show' ? 'success' : 'secondary'}
                          className="me-2"
                        >
                          {folder.messageListVisibility === 'show' ? 'Visible' : 'Hidden'}
                        </Badge>
                        <Badge bg="info">
                          {folder.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="ms-2">
                      <span className="text-muted">👆 Click to view emails</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <small className="text-muted">
                      <strong>ID:</strong> {folder.id}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      {folders.length > 0 && (
        <div className="mt-3">
          <Alert variant="success">
            <strong>✅ {folders.length} folder(s) found!</strong>
            <br />
            Click on any folder to view the emails inside. These are your custom Gmail labels created through the Filtered Inbox feature.
          </Alert>
        </div>
      )}
    </div>
  );
};

export default FolderList; 
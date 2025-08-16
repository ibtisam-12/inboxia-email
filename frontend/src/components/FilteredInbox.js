// FilteredInbox.js
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const FilteredInbox = () => {
  const navigate = useNavigate();
  const { accessToken, refreshToken } = useSelector((state) => state.user);

  // Form state
  const [keywords, setKeywords] = useState('');
  const [folderName, setFolderName] = useState('');

  // State for filtered results
  const [matchingEmails, setMatchingEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch filtered emails and organize into folders
  const fetchFilteredEmails = useCallback(async () => {
    if (!accessToken) {
      setError('Authentication required. Please log in.');
      return;
    }

    if (!keywords.trim() || !folderName.trim()) {
      setError('Keywords and folder name are required.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.get('/email/filtered-inbox', {
        params: {
          keywords: keywords.trim(),
          folderName: folderName.trim(),
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-refresh-token': refreshToken,
        },
      });

      const data = response.data;
      
      if (data && data.matchingEmails) {
        setMatchingEmails(data.matchingEmails);
        
        if (data.matchingEmails.length > 0) {
          setSuccess(`✅ ${data.matchingEmails.length} email(s) found and moved to folder "${folderName}"`);
        } else {
          setSuccess(`ℹ️ No emails found matching your keywords. Folder "${folderName}" is ready for future matches.`);
        }
      } else {
        setMatchingEmails([]);
        setSuccess(`ℹ️ No emails found matching your keywords. Folder "${folderName}" is ready for future matches.`);
      }
    } catch (err) {
      console.error('Error fetching filtered emails:', err);
      const message = err.response?.data?.error || err.message || 'Failed to fetch filtered emails.';
      setError(message);
      setMatchingEmails([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, refreshToken, keywords, folderName]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchFilteredEmails();
  };

  // Clear form and results
  const handleClear = () => {
    setKeywords('');
    setFolderName('');
    setMatchingEmails([]);
    setError(null);
    setSuccess(null);
  };

  // Effect: Check authentication and clear errors on unmount
  useEffect(() => {
    if (!accessToken) {
      setError('You must be logged in to access filtered inbox.');
      setTimeout(() => navigate('/login'), 2000);
    }
    
    // Cleanup function
    return () => {
      setError(null);
      setSuccess(null);
      setMatchingEmails([]);
    };
  }, [accessToken, navigate]);

  return (
    <div style={{ height: '100%' }}>
      <h3>🔍 Filtered Inbox - Folder Management</h3>
      <p className="text-muted mb-3">
        Create custom folders (Gmail labels) and automatically organize emails based on keywords.
      </p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="keywords" className="form-label">
            <strong>Keywords (comma-separated)</strong>
          </label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g., hiring,internship,job,career"
            className="form-control"
            required
          />
          <div className="form-text">
            Enter keywords separated by commas. Emails containing any of these keywords will be moved to the specified folder.
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="folderName" className="form-label">
            <strong>Folder Name (Gmail Label)</strong>
          </label>
          <input
            type="text"
            id="folderName"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="e.g., job-opportunities, important-emails, spam-filter"
            className="form-control"
            required
          />
          <div className="form-text">
            This will create a new Gmail label (folder) if it doesn't exist. Matching emails will be organized into this folder.
          </div>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !keywords.trim() || !folderName.trim()}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              '🔍 Apply Filters & Organize'
            )}
          </button>
          
          <button 
            type="button" 
            className="btn btn-outline-secondary"
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </form>

      {!loading && matchingEmails.length > 0 && (
        <div className="mt-4">
          <h5>📧 Matching Emails (Moved to "{folderName}" folder)</h5>
          <div className="list-group">
            {matchingEmails.map((email) => (
              <div key={email.emailId} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{email.subject || 'No Subject'}</h6>
                    <p className="mb-1 text-muted">
                      <strong>From:</strong> {email.from || 'Unknown'}
                    </p>
                    <p className="mb-1 text-muted">
                      <strong>Date:</strong> {email.date || 'Unknown'}
                    </p>
                    {email.snippet && (
                      <p className="mb-0 text-muted small">
                        {email.snippet.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                  <span className="badge bg-success">✓ Moved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && matchingEmails.length === 0 && success && (
        <div className="mt-4">
          <div className="alert alert-info">
            <h6>📁 Folder Status</h6>
            <p className="mb-0">
              Folder "<strong>{folderName}</strong>" has been created and is ready to receive matching emails. 
              Run this filter again later to organize new emails that match your keywords.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilteredInbox;
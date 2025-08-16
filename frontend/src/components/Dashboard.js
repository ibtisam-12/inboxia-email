// Dashboard.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { logout } from '../slices/userSlice';
import EmailOperations from './EmailOperations';
import LogUnifiedInboxBodies from './LogUnifiedInboxBodies';
import FilteredInbox from './FilteredInbox';
import FolderList from './FolderList';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../utils/firebase';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDetails, loading } = useSelector((state) => state.user);
  const [activeView, setActiveView] = useState('inbox'); // inbox | compose | filtered | folders

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      dispatch(logout());
      navigate('/login');
    }
  };

  const handleNavigation = (view) => {
    setActiveView(view);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Alert variant="info">Loading user data...</Alert>
      </Container>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container style={{ padding: '20px', maxWidth: '1200px' }}>
        {/* Full-width Welcome Section */}
        <Card
          className="mb-4"
          style={{
            background: 'linear-gradient(90deg, #007bff 0%, #0056b3 100%)',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            width: '100%',
            minHeight: '110px'
          }}
        >
          <Card.Body>
            <Row className="align-items-center">
              <Col xs={12} md={8}>
                <h2 className="mb-2" style={{ fontWeight: 'bold' }}>📧 Inboxia</h2>
                <div style={{ fontSize: '1.2rem' }}>
                  Welcome, <strong>{userDetails?.name || 'User'}</strong>
                  <span style={{ fontWeight: 400, marginLeft: 10, fontSize: '1rem' }}>
                    ({userDetails?.email || 'N/A'})
                  </span>
                </div>
              </Col>
              <Col xs={12} md={4} className="text-md-end mt-3 mt-md-0">
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  🚪 Logout
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Email Card with Contained Header/Navbar */}
        <Row>
          <Col>
            <Card style={{
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              minHeight: '600px',
              overflow: 'hidden'
            }}>
              {/* Contained Navbar/Header */}
              <div style={{
                backgroundColor: '#343a40',
                color: 'white',
                padding: '1rem',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                position: 'sticky',
                top: 0,
                zIndex: 2
              }}>
                <Row className="align-items-center">
                  <Col md={3}>
                    <h4 style={{ margin: 0, fontWeight: 'bold' }}>
                      {activeView === 'filtered' ? '🔍 Filtered Inbox' : 
                       activeView === 'folders' ? '📁 Folders' : '📥 Email'}
                    </h4>
                  </Col>
                  <Col md={6} className="text-center">
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Button
                        variant={activeView === 'inbox' ? 'primary' : 'outline-light'}
                        onClick={() => handleNavigation('inbox')}
                        size="sm"
                        style={{ minWidth: '80px' }}
                      >
                        📥 Inbox
                      </Button>

                      <Button
                        variant={activeView === 'compose' ? 'primary' : 'outline-light'}
                        onClick={() => handleNavigation('compose')}
                        size="sm"
                        style={{ minWidth: '80px' }}
                      >
                        ✏️ Compose
                      </Button>

                      <Button
                        variant={activeView === 'filtered' ? 'primary' : 'outline-light'}
                        onClick={() => handleNavigation('filtered')}
                        size="sm"
                        style={{ minWidth: '100px' }}
                      >
                        🔍 Filtered
                      </Button>

                      <Button
                        variant={activeView === 'folders' ? 'primary' : 'outline-light'}
                        onClick={() => handleNavigation('folders')}
                        size="sm"
                        style={{ minWidth: '80px' }}
                      >
                        📁 Folders
                      </Button>

                      <LogUnifiedInboxBodies />
                    </div>
                  </Col>
                  <Col md={3} />
                </Row>
              </div>

              {/* Content Section (scrollable) */}
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                minHeight: '500px',
                maxHeight: '600px',
                overflowY: 'auto'
              }}>
                {activeView === 'inbox' && <EmailOperations activeView="inbox" />}
                {activeView === 'compose' && <EmailOperations activeView="compose" />}
                {activeView === 'filtered' && <FilteredInbox />}
                {activeView === 'folders' && <FolderList />}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;

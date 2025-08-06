import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { logout } from '../slices/userSlice';
import EmailOperations from './EmailOperations';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../utils/firebase';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDetails, loading } = useSelector((state) => state.user);
  const [activeView, setActiveView] = useState('inbox');

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
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
                      📥 Email
                    </h4>
                  </Col>
                  <Col md={6} className="text-center">
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                      <Button
                        variant={activeView === 'inbox' ? 'primary' : 'outline-light'}
                        onClick={() => handleNavigation('inbox')}
                        style={{ minWidth: '100px' }}
                      >
                        📥 Inbox
                      </Button>
                      <Button
                        variant={activeView === 'compose' ? 'primary' : 'outline-light'}
                        onClick={() => handleNavigation('compose')}
                        style={{ minWidth: '100px' }}
                      >
                        ✏️ Compose
                      </Button>
                    </div>
                  </Col>
                  <Col md={3} />
                </Row>
              </div>
              {/* Email Operations Section (scrollable) */}
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                minHeight: '500px',
                maxHeight: '600px',
                overflowY: 'auto'
              }}>
                <EmailOperations activeView={activeView} />
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
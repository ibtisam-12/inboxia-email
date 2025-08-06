import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { Container, Card } from 'react-bootstrap';

const App = () => (
  <Provider store={store}>
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Auth />} />
          {/* Home Route - Welcome Page */}
          <Route 
            path="/" 
            element={
              <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Card className="text-center p-4" style={{ maxWidth: '500px' }}>
                  <Card.Body>
                    <h1 className="mb-4">📧 Welcome to Inboxia</h1>
                    <p className="mb-4">
                      Your intelligent email management platform. 
                      Connect with Google to get started and manage your emails efficiently.
                    </p>
                    <div className="d-grid gap-2">
                      <a href="/login" className="btn btn-primary btn-lg">
                        Get Started
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Container>
            } 
          />
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  </Provider>
);

export default App;
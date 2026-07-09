import React from 'react';
import { Alert, Button } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Alert variant="danger" className="text-center p-4" style={{ maxWidth: '500px' }}>
            <Alert.Heading>Something went wrong</Alert.Heading>
            <p>{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <Button onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}>
              Go Home
            </Button>
          </Alert>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

import React, { useEffect } from 'react';
import { Container, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, setError, clearError } from '../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../utils/firebase';
import { GoogleAuthProvider } from 'firebase/auth';
import { sendTokensToBackend } from '../utils/sendTokensToBackend';

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async () => {
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const result = await signInWithGoogle();
      const user = result.user;
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const oauthAccessToken = credential.accessToken;
      const refreshToken = user.stsTokenManager.refreshToken; // <-- Get refresh token

      // Debug: log tokens (remove in production)
      // console.log(' OAuth Access Token:', oauthAccessToken);
      // console.log(' Refresh Token:', refreshToken);

      if (!oauthAccessToken) {
        throw new Error('No OAuth access token received. Please ensure Gmail API scopes are configured.');
      }
      if (!oauthAccessToken.startsWith('ya29.')) {
        throw new Error('Invalid OAuth token format. Expected OAuth access token.');
      }

      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };

      dispatch(setUser({
        user: userData,
        accessToken: oauthAccessToken,
        refreshToken: refreshToken, // <-- Store refresh token in Redux
      }));

      try {
        await sendTokensToBackend(oauthAccessToken, refreshToken);
      } catch (err) {
        // You can choose to ignore or handle this error
        console.error('Failed to send tokens to backend:', err);
      }

      navigate('/dashboard');
    } catch (error) {
      dispatch(setError(`Failed to login: ${error.message}`));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="p-4" style={{ width: '20rem' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Login to Your Account</h2>
          {error && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}
          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Signing in...
                </>
              ) : (
                'Login with Google'
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Auth;
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { logout, setLoading } from '../slices/userSlice';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, accessToken } = useSelector((state) => state.user);
  const [initialCheck, setInitialCheck] = useState(false);

  useEffect(() => {
    // console.log('🔒 ProtectedRoute: Starting auth check...');
    dispatch(setLoading(true));
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // console.log('🔥 Firebase auth state changed:', user ? user.email : 'No user');
      
      if (user) {
        // console.log('🔥 Firebase user detected:', user.email);
        // console.log('🔑 Redux auth state:', isAuthenticated);
        // console.log('🔑 Access token present:', !!accessToken);
        // console.log('🔑 Token type:', accessToken ? (accessToken.startsWith('ya29.') ? 'OAuth' : 'Other') : 'None');
        
        if (!accessToken) {
          // console.log('❌ No OAuth access token found. User needs to login again.');
          dispatch(logout());
        } else if (!accessToken.startsWith('ya29.')) {
          // console.log('❌ Invalid token type. Expected OAuth access token starting with ya29.');
          // console.log('🔑 Current token starts with:', accessToken.substring(0, 10));
          dispatch(logout());
        } else {
          // console.log('✅ Valid OAuth access token present');
        }
      } else {
        // console.log('🔥 No Firebase user detected');
        dispatch(logout());
      }
      
      dispatch(setLoading(false));
      setInitialCheck(true);
    });

    return () => unsubscribe();
  }, [dispatch, accessToken, isAuthenticated]);

  // console.log('🔒 ProtectedRoute render:', { initialCheck, loading, isAuthenticated, hasToken: !!accessToken });

  if (!initialCheck || loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2">Checking authentication...</div>
        </div>
      </Container>
    );
  }

  // Redirect to login if not authenticated or no valid OAuth token
  if (!isAuthenticated || !accessToken || !accessToken.startsWith('ya29.')) {
    // console.log('🔒 Redirecting to login:', { isAuthenticated, hasToken: !!accessToken });
    return <Navigate to="/login" replace />;
  }

  // console.log('✅ ProtectedRoute: Rendering protected content');
  return children;
};

export default ProtectedRoute;
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { authService } from '../../services';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyTokenAndRole = async () => {
      setIsVerifying(true);

      // Check if token exists in localStorage
      const isAuthenticated = authService.isAuthenticated();
      const userRole = authService.getUserRole();

      if (!isAuthenticated) {
        // No token found, clear storage and redirect
        await authService.logout();
        setIsValid(false);
        setIsVerifying(false);
        return;
      }

      try {
        // Verify token with API
        const response = await authService.verifyToken();

        if (response && response.success) {
          // Token is valid, check role
          const verifiedRole = response.user?.rol || userRole;

          // If required role doesn't match, clear storage and redirect
          if (requiredRole && verifiedRole !== requiredRole) {
            await authService.logout();
            setIsValid(false);
          } else {
            setIsValid(true);
          }
        } else {
          // Token verification failed, clear storage
          await authService.logout();
          setIsValid(false);
        }
      } catch (error) {
        // Token verification error (expired, invalid, etc.), clear storage
        console.error('Token verification failed:', error);
        await authService.logout();
        setIsValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyTokenAndRole();
  }, [location.pathname, requiredRole]);

  // Show loading spinner while verifying
  if (isVerifying) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  // If not valid, redirect to login
  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  // Token is valid and role matches, render children
  return children;
};

export default ProtectedRoute;

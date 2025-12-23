import { Navigate } from 'react-router-dom';
import { authService } from '../../services';

const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirigir a la página correspondiente según el rol del usuario
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/users" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

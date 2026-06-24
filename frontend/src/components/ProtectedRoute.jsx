// Route guard that blocks unauthenticated access to protected pages.
import { Navigate } from 'react-router-dom';
import Loader from './Loader';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { initialized, isAuthenticated } = useAuth();

  if (!initialized) {
    return <Loader fullScreen label="Restoring your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

// Route definitions for the Smart Flashcard Generator frontend.
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateFlashcard from './pages/CreateFlashcard';
import ReviewFlashcard from './pages/ReviewFlashcard';

const ProtectedFrame = ({ children }) => (
  <ProtectedRoute>
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main>{children}</main>
    </div>
  </ProtectedRoute>
);

const App = () => {
  const { initialized, isAuthenticated } = useAuth();

  if (!initialized) {
    return <Loader fullScreen label="Booting Smart Flashcard Generator..." />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedFrame>
            <Dashboard />
          </ProtectedFrame>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedFrame>
            <CreateFlashcard />
          </ProtectedFrame>
        }
      />
      <Route
        path="/review"
        element={
          <ProtectedFrame>
            <ReviewFlashcard />
          </ProtectedFrame>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

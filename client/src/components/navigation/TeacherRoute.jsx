import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TeacherRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'teacher') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default TeacherRoute;
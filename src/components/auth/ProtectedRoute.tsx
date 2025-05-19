import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../layout/Layout';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { currentUser, userProfile, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check admin role if required
  if (requireAdmin && userProfile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          غير مصرح
        </h2>
        <p className="text-gray-600 mb-8">
          ليس لديك صلاحية للوصول إلى هذه الصفحة.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          عودة
        </button>
      </div>
    );
  }

  // Render the protected content inside the layout
  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;

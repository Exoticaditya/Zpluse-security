import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { currentUser, userRole } = useAuth();

    // Check authentication
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // Check role authorization
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole?.toUpperCase())) {
        // Redirect to appropriate dashboard based on role
        const roleRoutes = {
            'ADMIN': '/portal/admin',
            'MANAGER': '/portal/manager',
            'GUARD': '/portal/worker',
            'CLIENT': '/portal/client',
        };
        return <Navigate to={roleRoutes[userRole?.toUpperCase()] || '/'} replace />;
    }

    return children;
};

export default ProtectedRoute;

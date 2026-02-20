import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { currentUser, userRole } = useAuth();

    // Check authentication
    if (!currentUser) {
        return <Navigate to="/portal" replace />;
    }

    // Check role authorization
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole?.toUpperCase())) {
        // Redirect to appropriate dashboard based on role
        const roleRoutes = {
            'ADMIN': '/dashboard/admin',
            'SUPERVISOR': '/dashboard/manager',
            'GUARD': '/dashboard/guard',
            'CLIENT': '/dashboard/client',
        };
        return <Navigate to={roleRoutes[userRole?.toUpperCase()] || '/portal'} replace />;
    }

    return children;
};

export default ProtectedRoute;

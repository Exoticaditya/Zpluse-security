import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            setUserRole(user.role);
        }
        setLoading(false);
    }, []);

    // Login user with JWT
    const login = async (email, password) => {
        try {
            const user = await authService.login(email, password);
            setCurrentUser(user);
            setUserRole(user.role);
            return user;
        } catch (error) {
            throw error;
        }
    };

    // Register new user
    const register = async (email, password, userData) => {
        try {
            const response = await authService.register(email, password, userData);
            return response;
        } catch (error) {
            throw error;
        }
    };

    // Logout user
    const logout = () => {
        authService.logout();
        setCurrentUser(null);
        setUserRole(null);
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return authService.isAuthenticated();
    };

    // Get user role
    const getUserRole = () => {
        return userRole;
    };

    const value = {
        currentUser,
        userRole,
        login,
        register,
        logout,
        isAuthenticated,
        getUserRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

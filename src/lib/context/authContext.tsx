"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Auth context for managing user authentication state
// Provides login, logout, and user info to the app
type User = {
    // User object structure
    id: string;
    name: string;
    role: string;
};

type AuthContextType = {
    // Auth context value type
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // State for the current user
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // On page load, if user was already in localStorage, restore it
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: User) => {
        // Log in and save user to localStorage
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        // Log out and clear user/token from localStorage
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        // Provide auth context to children
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    // Custom hook to use auth context
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

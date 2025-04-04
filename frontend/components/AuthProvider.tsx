'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// User interface
interface User {
    id: number;
    username: string;
    email: string;
    token?: string;
}

// Auth context interface
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    error: string | null;
    clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Get API URL from environment variables
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    // Clear error
    const clearError = () => setError(null);

    // Check if user is already authenticated
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(`${API_URL}/api/auth/me`, {
                    credentials: 'include' // Include cookies for authentication
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    // Not authenticated
                    setUser(null);
                    // If on a protected route, redirect to login
                    if (window.location.pathname !== '/login' &&
                        window.location.pathname !== '/register' &&
                        window.location.pathname !== '/') {
                        router.push('/login');
                    }
                }
            } catch (error) {
                console.error('Auth check error:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [API_URL, router]);

    // Login function
    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Login failed');
            }

            const userData = await response.json();
            setUser(userData);

            // Redirect to compression dashboard
            router.push('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setError((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    // Register function
    const register = async (username: string, email: string, password: string): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify({ username, email, password })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Registration failed');
            }

            const userData = await response.json();
            setUser(userData);

            // Redirect to compression dashboard
            router.push('/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
            setError((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = async (): Promise<void> => {
        setIsLoading(true);

        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include' // Include cookies for authentication
            });

            // Clear user state
            setUser(null);

            // Redirect to home
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
                error,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
} 
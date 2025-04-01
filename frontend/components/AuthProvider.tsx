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
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Clear error
    const clearError = () => setError(null);

    // Check if user is logged in on initial load
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/auth/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include cookies
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
    }, [router]);

    // Login user
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies
                body: JSON.stringify({ email, password }),
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

    // Register user
    const register = async (username: string, email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies
                body: JSON.stringify({ username, email, password }),
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

    // Logout user
    const logout = async () => {
        setIsLoading(true);
        try {
            await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                credentials: 'include', // Include cookies
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
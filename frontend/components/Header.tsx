'use client';

import React from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useAuth } from './AuthProvider';

const Header = () => {
    const { user, isAuthenticated, logout, isLoading } = useAuth();

    return (
        <header className="bg-blue-600 dark:bg-blue-800 text-white shadow-md transition-colors duration-200">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-0">
                        <Link href="/" className="text-2xl font-bold hover:text-blue-100 transition-colors mr-6">
                            Text File Compressor
                        </Link>
                        {!isLoading && (
                            <nav className="mt-2 md:mt-0">
                                <ul className="flex space-x-4">
                                    {isAuthenticated ? (
                                        <>
                                            <li>
                                                <Link href="/dashboard" className="hover:text-blue-100 transition-colors">
                                                    Dashboard
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/keys" className="hover:text-blue-100 transition-colors">
                                                    My Keys
                                                </Link>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li>
                                                <Link href="/login" className="hover:text-blue-100 transition-colors">
                                                    Login
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/register" className="hover:text-blue-100 transition-colors">
                                                    Register
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </nav>
                        )}
                    </div>
                    <div className="flex items-center justify-between md:justify-end">
                        {isAuthenticated && !isLoading && (
                            <div className="flex items-center mr-4">
                                <span className="mr-2 hidden md:inline">Hello, {user?.username}</span>
                                <button
                                    onClick={logout}
                                    className="text-sm bg-blue-700 dark:bg-blue-900 hover:bg-blue-800 dark:hover:bg-blue-950 py-1 px-3 rounded transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                        <div className="flex items-center space-x-3">
                            <ThemeToggle />
                            <a
                                href="https://github.com/amanmodiii/File-compressor"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-blue-200 transition-colors text-sm flex items-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="inline-block mr-1"
                                >
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                </svg>
                                <span className="hidden md:inline">GitHub</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 
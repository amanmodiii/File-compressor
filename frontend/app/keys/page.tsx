'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';

interface HuffmanKey {
    id: number;
    fileName: string;
    huffmanData: string;
    createdAt: string;
}

export default function KeysPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const [keys, setKeys] = useState<HuffmanKey[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const router = useRouter();

    // Fetch keys from the API
    const fetchKeys = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:5000/api/compression/keys', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Huffman keys');
            }

            const data = await response.json();
            setKeys(data);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    // Handle copying key to clipboard
    const handleCopyKey = (id: number, key: string) => {
        navigator.clipboard.writeText(key)
            .then(() => {
                setCopiedId(id);
                setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
            })
            .catch(err => {
                console.error('Error copying to clipboard:', err);
            });
    };

    // Format date
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        } else if (isAuthenticated) {
            fetchKeys();
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-colors">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">My Huffman Keys</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Huffman keys are needed to decompress your files. Keep them securely.
                    </p>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {keys.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <p>You haven't compressed any files yet.</p>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            File Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Date Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Huffman Key
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {keys.map((key) => (
                                        <tr key={key.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {key.fileName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(key.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="max-w-xs overflow-hidden text-ellipsis">
                                                    {key.huffmanData.length > 50
                                                        ? key.huffmanData.substring(0, 50) + '...'
                                                        : key.huffmanData}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleCopyKey(key.id, key.huffmanData)}
                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                                                >
                                                    {copiedId === key.id ? 'Copied!' : 'Copy Key'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 
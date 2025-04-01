'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import FileUpload from '../../components/FileUpload';
import FileList from '../../components/FileList';
import FileDecompressor from '../../components/FileDecompressor';

type TabType = 'compress' | 'decompress' | 'files';

export default function Dashboard() {
    const { isAuthenticated, isLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('compress');
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const router = useRouter();

    // Handle file compressed event
    const handleFileCompressed = () => {
        setRefreshTrigger(prev => prev + 1);
        setActiveTab('files');
    };

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-colors">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex">
                        <button
                            onClick={() => setActiveTab('compress')}
                            className={`px-6 py-4 text-sm font-medium ${activeTab === 'compress'
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                } transition-colors focus:outline-none`}
                        >
                            Compress
                        </button>
                        <button
                            onClick={() => setActiveTab('decompress')}
                            className={`px-6 py-4 text-sm font-medium ${activeTab === 'decompress'
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                } transition-colors focus:outline-none`}
                        >
                            Decompress
                        </button>
                        <button
                            onClick={() => setActiveTab('files')}
                            className={`px-6 py-4 text-sm font-medium ${activeTab === 'files'
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                } transition-colors focus:outline-none`}
                        >
                            My Files
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'compress' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                                Compress a Text File
                            </h2>
                            <FileUpload onFileCompressed={handleFileCompressed} />
                        </div>
                    )}

                    {activeTab === 'decompress' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                                Decompress a File
                            </h2>
                            <FileDecompressor />
                        </div>
                    )}

                    {activeTab === 'files' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                                My Compressed Files
                            </h2>
                            <FileList refreshTrigger={refreshTrigger} showDownloadOptions={true} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 
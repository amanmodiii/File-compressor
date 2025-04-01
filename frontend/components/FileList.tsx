'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface File {
    id: string; // Changed to string for UUID
    fileName: string;
    compressionRatio: number;
    fileSize: number;
    compressedSize: number;
    createdAt: string;
}

interface FileListProps {
    refreshTrigger: number;
}

const FileList: React.FC<FileListProps> = ({ refreshTrigger }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
    const [selectedKey, setSelectedKey] = useState<string>('');

    // Fetch all files
    const fetchFiles = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:5000/api/compression/files', {
                credentials: 'include' // Include cookies for authentication
            });

            if (!response.ok) {
                throw new Error('Failed to fetch files');
            }

            const data = await response.json();
            setFiles(data);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    // Delete a file
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this key?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/compression/files/${id}`, {
                method: 'DELETE',
                credentials: 'include' // Include cookies for authentication
            });

            if (!response.ok) {
                throw new Error('Failed to delete key');
            }

            // Remove file from state
            setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
        } catch (error) {
            setError((error as Error).message);
        }
    };

    // Show Huffman key
    const handleShowKey = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/compression/files/${id}`, {
                credentials: 'include' // Include cookies for authentication
            });

            if (!response.ok) {
                throw new Error('Failed to fetch key');
            }

            const data = await response.json();
            setSelectedFileId(id);
            setSelectedKey(data.huffmanData);
            setShowKeyModal(true);
        } catch (error) {
            setError((error as Error).message);
        }
    };

    // Format file size
    const formatFileSize = (size: number): string => {
        if (size < 1024) {
            return `${size} B`;
        } else if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(2)} KB`;
        } else {
            return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        }
    };

    // Format date
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    // Close the modal
    const closeModal = () => {
        setShowKeyModal(false);
        setSelectedFileId(null);
        setSelectedKey('');
    };

    // Copy key to clipboard
    const copyKeyToClipboard = () => {
        navigator.clipboard.writeText(selectedKey)
            .then(() => {
                alert('Huffman key copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy key: ', err);
            });
    };

    // Fetch files when component mounts or refreshTrigger changes
    useEffect(() => {
        fetchFiles();
    }, [refreshTrigger]);

    // Table row variants for animation
    const tableRowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.3
            }
        }),
        exit: { opacity: 0, y: -20 }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {loading && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500 dark:text-gray-400 font-inter"
                >
                    <svg className="animate-spin w-5 h-5 inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading saved Huffman keys...
                </motion.p>
            )}

            {error && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:border-red-500 dark:text-red-300 px-4 py-3 rounded-lg mb-4 font-inter"
                >
                    {error}
                </motion.div>
            )}

            {!loading && files.length === 0 && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500 dark:text-gray-400 py-8 font-inter"
                >
                    No saved Huffman keys found. Compress a file to save its key!
                </motion.p>
            )}

            {files.length > 0 && (
                <motion.div
                    className="overflow-x-auto rounded-lg shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden transition-colors duration-200">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-sm leading-normal font-poppins">
                                <th className="py-3 px-4 text-left">File Name</th>
                                <th className="py-3 px-4 text-left">Original Size</th>
                                <th className="py-3 px-4 text-left">Compression Ratio</th>
                                <th className="py-3 px-4 text-left">Date Saved</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 dark:text-gray-300 text-sm font-inter">
                            <AnimatePresence>
                                {files.map((file, index) => (
                                    <motion.tr
                                        key={file.id}
                                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        variants={tableRowVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        custom={index}
                                    >
                                        <td className="py-3 px-4 font-medium">{file.fileName}</td>
                                        <td className="py-3 px-4">
                                            {formatFileSize(file.fileSize)}
                                        </td>
                                        <td className="py-3 px-4">{file.compressionRatio.toFixed(2)}x</td>
                                        <td className="py-3 px-4">{formatDate(file.createdAt)}</td>
                                        <td className="py-3 px-4 flex space-x-2">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleShowKey(file.id)}
                                                className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-1 px-3 rounded-lg text-xs transition-all duration-200"
                                            >
                                                View Key
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDelete(file.id)}
                                                className="bg-red-500 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-800 text-white font-bold py-1 px-3 rounded-lg text-xs transition-all duration-200"
                                            >
                                                Delete
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </motion.div>
            )}

            {/* Modal for displaying Huffman key */}
            {showKeyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-hidden flex flex-col"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white font-poppins">
                                Huffman Key: {files.find(file => file.id === selectedFileId)?.fileName}
                            </h3>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </motion.button>
                        </div>
                        <div className="p-4 flex-1 overflow-auto">
                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-300 font-inter">
                                <p>This is your Huffman key for this file. You'll need it to decompress your .huff file. Keep it safe!</p>
                            </div>
                            <pre className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 rounded-lg font-mono text-sm overflow-auto max-h-64">{selectedKey}</pre>
                        </div>
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={copyKeyToClipboard}
                                className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy to Clipboard
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default FileList; 
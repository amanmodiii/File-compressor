'use client';

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface FileUploadProps {
    onFileCompressed: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileCompressed }) => {
    const [_file, setFile] = useState<File | null>(null);
    const [content, setContent] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setSuccess(null);

        if (!e.target.files || e.target.files.length === 0) {
            setFile(null);
            setFileName('');
            setContent('');
            return;
        }

        const selectedFile = e.target.files[0];

        // Check if it's a text file
        if (!selectedFile.type.includes('text') &&
            !selectedFile.name.endsWith('.txt') &&
            !selectedFile.name.endsWith('.md') &&
            !selectedFile.name.endsWith('.js') &&
            !selectedFile.name.endsWith('.html') &&
            !selectedFile.name.endsWith('.css') &&
            !selectedFile.name.endsWith('.json')) {
            setError('Please select a text file');
            setFile(null);
            setFileName('');
            setContent('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            if (e.target && typeof e.target.result === 'string') {
                setContent(e.target.result);
                setFile(selectedFile);
                setFileName(selectedFile.name);
            }
        };

        reader.onerror = () => {
            setError('Error reading file');
            setFile(null);
            setFileName('');
            setContent('');
        };

        reader.readAsText(selectedFile);
    };

    const handleManualInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        if (!fileName && e.target.value.trim()) {
            setFileName('untitled.txt');
        } else if (!e.target.value.trim()) {
            setFileName('');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!content) {
            setError('Please enter some text or upload a file');
            return;
        }

        if (!fileName) {
            setError('Please upload a file or type some content');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/compression/compress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify({ fileName, content }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to compress file');
            }

            const data = await response.json();

            // Automatically download the compressed file
            // The data.compressedData is now a base64 string of binary data
            const binaryString = atob(data.compressedData);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // Create a blob with the binary data
            const blob = new Blob([bytes], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName.replace(/\.[^/.]+$/, '') + '.huff';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setSuccess(`File compressed and downloaded! Compression ratio: ${data.compressionRatio.toFixed(2)}x. The Huffman key has been saved to your account.`);

            // Reset form
            setFile(null);
            setFileName('');
            setContent('');
            if (fileInputRef.current) fileInputRef.current.value = '';

            // Notify parent component to refresh file list
            onFileCompressed();
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* File input */}
                <div className="relative">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 font-inter" htmlFor="file">
                        Upload Text File
                    </label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 font-inter">
                        Supported file types: .txt, .md, .js, .html, .css, .json
                    </p>
                </div>

                {/* File details */}
                {fileName && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
                    >
                        <h3 className="font-medium text-gray-700 dark:text-gray-300 font-poppins">File Details</h3>
                        <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                                <span className="font-medium">Name:</span> {fileName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                                <span className="font-medium">Size:</span> {content.length} bytes
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                                <span className="font-medium">Will be saved as:</span> {fileName.replace(/\.[^/.]+$/, '')}.huff
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Text content */}
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 font-inter" htmlFor="content">
                        Text Content
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={handleManualInput}
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 h-48 transition-all duration-200"
                        placeholder="Enter text to compress or upload a file"
                        required
                    />
                </div>

                {/* Error and success messages */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg"
                    >
                        {error}
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-500 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg"
                    >
                        {success}
                    </motion.div>
                )}

                {/* Submit button */}
                <div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className={`w-full bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Compressing...
                            </div>
                        ) : 'Compress File'}
                    </motion.button>
                </div>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                        After compression, the file will automatically download and the key will be saved to your account.
                    </p>
                </div>
            </form>
        </motion.div>
    );
};

export default FileUpload; 
'use client';

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';

const FileDecompressor: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [compressedData, setCompressedData] = useState<string>('');
    const [huffmanData, setHuffmanData] = useState<string>('');
    const [decompressedContent, setDecompressedContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showResult, setShowResult] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setSuccess(null);
        setShowResult(false);
        setDecompressedContent('');

        if (!e.target.files || e.target.files.length === 0) {
            setFile(null);
            setCompressedData('');
            return;
        }

        const selectedFile = e.target.files[0];

        // Check if it's a .huff file
        if (!selectedFile.name.endsWith('.huff')) {
            setError('Please select a .huff file');
            setFile(null);
            setCompressedData('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                if (e.target && typeof e.target.result === 'string') {
                    // Convert binary data to base64 string
                    const binaryData = e.target.result;
                    const base64Data = btoa(binaryData);
                    setCompressedData(base64Data);
                    setFile(selectedFile);
                } else if (e.target && e.target.result instanceof ArrayBuffer) {
                    // Handle ArrayBuffer result if needed
                    const bytes = new Uint8Array(e.target.result);
                    let binaryString = '';
                    for (let i = 0; i < bytes.length; i++) {
                        binaryString += String.fromCharCode(bytes[i]);
                    }
                    const base64Data = btoa(binaryString);
                    setCompressedData(base64Data);
                    setFile(selectedFile);
                }
            } catch (error) {
                setError('Error parsing .huff file. The file might be corrupted.');
                setFile(null);
                setCompressedData('');
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };

        reader.onerror = () => {
            setError('Error reading file');
            setFile(null);
            setCompressedData('');
        };

        // Read as binary string
        reader.readAsBinaryString(selectedFile);
    };

    const handleKeyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setHuffmanData(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!compressedData) {
            setError('Please upload a compressed .huff file');
            return;
        }

        if (!huffmanData) {
            setError('Please enter the Huffman key');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        setShowResult(false);

        try {
            // Client-side decompression using the Huffman algorithm

            // Function to convert base64 to a string of bits (0s and 1s)
            const base64ToBits = (base64: string): string => {
                const binaryString = atob(base64);
                let bits = '';
                for (let i = 0; i < binaryString.length; i++) {
                    const byte = binaryString.charCodeAt(i);
                    bits += byte.toString(2).padStart(8, '0');
                }
                return bits;
            };

            // Convert base64 compressed data to bit string
            const bitString = base64ToBits(compressedData);

            // Function to deserialize Huffman data and rebuild tree
            const deserializeHuffmanData = (serializedData: string) => {
                try {
                    const data = JSON.parse(serializedData);
                    const frequencyMap = new Map<string, number>();

                    for (const char in data.frequencyMap) {
                        frequencyMap.set(char, data.frequencyMap[char]);
                    }

                    // Rebuild Huffman tree
                    const root = buildHuffmanTree(frequencyMap);

                    return { root, frequencyMap };
                } catch (error) {
                    throw new Error('Invalid Huffman key format. Please check your key and try again.');
                }
            };

            // Class definition for Huffman node
            class HuffmanNode {
                char: string | null;
                frequency: number;
                left: HuffmanNode | null;
                right: HuffmanNode | null;

                constructor(char: string | null, frequency: number) {
                    this.char = char;
                    this.frequency = frequency;
                    this.left = null;
                    this.right = null;
                }
            }

            // Function to build Huffman tree
            const buildHuffmanTree = (frequencyMap: Map<string, number>) => {
                const priorityQueue: HuffmanNode[] = [];

                for (const [char, frequency] of frequencyMap.entries()) {
                    priorityQueue.push(new HuffmanNode(char, frequency));
                }

                while (priorityQueue.length > 1) {
                    priorityQueue.sort((a, b) => a.frequency - b.frequency);

                    const left = priorityQueue.shift()!;
                    const right = priorityQueue.shift()!;

                    const parent = new HuffmanNode(null, left.frequency + right.frequency);
                    parent.left = left;
                    parent.right = right;

                    priorityQueue.push(parent);
                }

                return priorityQueue[0];
            };

            // Function to decode text
            const decodeText = (encodedText: string, root: HuffmanNode): string => {
                let decodedText = '';
                let currentNode = root;

                for (const bit of encodedText) {
                    if (bit === '0') {
                        currentNode = currentNode.left!;
                    } else {
                        currentNode = currentNode.right!;
                    }

                    if (currentNode.char !== null) {
                        decodedText += currentNode.char;
                        currentNode = root;
                    }
                }

                return decodedText;
            };

            // Decompress the data using the bit string instead of the raw compressed data
            const { root } = deserializeHuffmanData(huffmanData);
            const result = decodeText(bitString, root);

            setDecompressedContent(result);
            setSuccess('File decompressed successfully!');
            setShowResult(true);

        } catch (error) {
            setError(`Error decompressing file: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    };

    const downloadDecompressedContent = () => {
        if (!decompressedContent || !file) return;

        const blob = new Blob([decompressedContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name.replace('.huff', '');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 font-inter" htmlFor="huffFile">
                        Upload Compressed .huff File
                    </label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        id="huffFile"
                        onChange={handleFileChange}
                        accept=".huff"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 font-inter">
                        Only .huff files can be decompressed
                    </p>
                </div>

                {file && (
                    <motion.div
                        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="font-medium text-gray-700 dark:text-gray-300 font-poppins">File Details</h3>
                        <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                                <span className="font-medium">Name:</span> {file.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                                <span className="font-medium">Size:</span> {file.size} bytes
                            </p>
                        </div>
                    </motion.div>
                )}

                <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 font-inter" htmlFor="huffmanKey">
                        Huffman Key
                    </label>
                    <textarea
                        id="huffmanKey"
                        value={huffmanData}
                        onChange={handleKeyChange}
                        placeholder="Paste your Huffman key here"
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 h-32 transition-all duration-200"
                    />
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-300 font-inter">
                        <p className="font-medium mb-1">Huffman Key Format</p>
                        <p>The key should be a JSON object with a frequency map, showing the distribution of characters in the original text. Example:</p>
                        <pre className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded mt-1 text-xs overflow-x-auto">{"{ \"frequencyMap\": { \"a\": 10, \"b\": 5, \"c\": 15 } }"}</pre>
                    </div>
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
                        disabled={!file || !huffmanData || loading}
                        className={`w-full bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-200 ${(!file || !huffmanData || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Decompressing...
                            </div>
                        ) : 'Decompress File'}
                    </motion.button>
                </div>
            </form>

            {/* Decompressed content */}
            {showResult && decompressedContent && (
                <motion.div
                    className="bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="border-b dark:border-gray-700 p-4 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200 font-poppins">Decompressed Content</h3>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={downloadDecompressedContent}
                            className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                        </motion.button>
                    </div>
                    <div className="p-4 max-h-96 overflow-auto">
                        <pre className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 rounded font-mono">{decompressedContent}</pre>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default FileDecompressor; 
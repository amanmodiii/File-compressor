'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-12 md:py-20">
        {/* Hero section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Secure Text File Compression
            <span className="block text-blue-600 dark:text-blue-400">
              Using Huffman Algorithm
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Compress your text files efficiently while keeping your encryption keys separate for maximum security.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors md:py-4 md:text-lg md:px-10"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </Link>
                    <Link
                      href="/login"
                      className="px-8 py-3 text-base font-medium rounded-md text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors md:py-4 md:text-lg md:px-10"
                    >
                      Login
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Features section */}
        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Upload & Compress</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upload your text file through our secure interface. Our system compresses it using the efficient Huffman algorithm.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Secure Key Storage</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We store the encryption key in our secure database, while only the compressed binary data is sent to you.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Decompress Anytime</h3>
              <p className="text-gray-600 dark:text-gray-300">
                To decompress, simply upload your compressed binary and use your saved Huffman key to restore the original file.
              </p>
            </div>
          </div>
        </div>

        {/* Advantages section */}
        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-12">
            Advantages
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors border border-gray-200 dark:border-gray-700">
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-white">Enhanced Security:</span> By separating the compression key from the data, your files remain secure even if intercepted.</p>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-white">Efficient Compression:</span> Huffman coding provides optimal prefix-free compression, reducing file sizes significantly.</p>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-white">Lossless Compression:</span> Your original text is perfectly preserved - no information is lost in the compression process.</p>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-white">Centralized Key Management:</span> Your Huffman keys are securely stored in your account for easy access whenever needed.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Ready to start compressing files?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Create an account today and experience the benefits of secure file compression.
          </p>
          {!isLoading && !isAuthenticated && (
            <div className="mt-8">
              <Link
                href="/register"
                className="px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors md:py-4 md:text-lg md:px-10"
              >
                Get Started Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
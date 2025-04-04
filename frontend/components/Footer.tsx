import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 dark:bg-gray-900 text-white py-6 transition-colors duration-200">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm">
                            &copy; {new Date().getFullYear()} Text File Compressor. All rights reserved.
                        </p>
                    </div>
                    <div className="text-sm">
                        <p>Built by <a href="https://github.com/amanmodiii" className="underline">Aman Modi</a></p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 
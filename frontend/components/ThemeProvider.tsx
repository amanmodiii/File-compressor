'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');

    // Initialize theme on component mount
    useEffect(() => {
        // Check if user has a saved preference
        const storedTheme = localStorage.getItem('theme') as Theme | null;

        // If a preference exists, use it
        if (storedTheme) {
            setTheme(storedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Otherwise, use system preference if dark
            setTheme('dark');
        }
    }, []);

    // Update the document class when theme changes
    useEffect(() => {
        // Remove both classes to ensure clean state
        document.documentElement.classList.remove('light', 'dark');
        // Add the current theme class
        document.documentElement.classList.add(theme);
        // Save preference to localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Toggle between light and dark modes
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Custom hook to use the theme context
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
} 
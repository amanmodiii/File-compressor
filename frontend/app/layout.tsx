import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { AuthProvider } from "../components/AuthProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
    display: 'swap'
});

const poppins = Poppins({
    weight: ['400', '500', '600', '700'],
    subsets: ["latin"],
    variable: '--font-poppins',
    display: 'swap'
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: '--font-jetbrains-mono',
    display: 'swap'
});

export const metadata: Metadata = {
    title: "Text File Compressor",
    description: "Compress and decompress text files using Huffman algorithm",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} font-sans`}>
                <AuthProvider>
                    <ThemeProvider>
                        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                            <Header />
                            <main className="flex-grow container mx-auto px-4 py-8">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
} 
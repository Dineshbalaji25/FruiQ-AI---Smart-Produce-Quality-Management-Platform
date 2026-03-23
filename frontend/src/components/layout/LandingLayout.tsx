import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function LandingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            <Navbar />
            <main className="flex-grow pt-16">
                {children}
            </main>
            <Footer />
        </div>
    );
}

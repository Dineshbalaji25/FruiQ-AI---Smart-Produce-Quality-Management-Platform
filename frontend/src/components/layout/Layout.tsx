import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-background overflow-hidden relative">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <MobileNav />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 min-w-0">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

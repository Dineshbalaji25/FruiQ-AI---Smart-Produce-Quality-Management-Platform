import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Apple, LineChart, UploadCloud, Info, MessageSquare, BookOpen } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { Button } from '../common/Button';

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: 'Dashboard', path: '/', icon: <LineChart className="w-5 h-5 mr-3" /> },
        { name: 'Scan Fruit', path: '/scan', icon: <UploadCloud className="w-5 h-5 mr-3" /> },
        { name: 'Batch Process', path: '/batch', icon: <Apple className="w-5 h-5 mr-3" /> },
        { name: 'Blog', path: '/blog', icon: <BookOpen className="w-5 h-5 mr-3" /> },
        { name: 'About', path: '/about', icon: <Info className="w-5 h-5 mr-3" /> },
        { name: 'Contact Us', path: '/contact', icon: <MessageSquare className="w-5 h-5 mr-3" /> },
    ];

    return (
        <div className="md:hidden">
            <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-2">
                    <Apple className="w-6 h-6 text-primary" />
                    <span className="font-bold text-xl tracking-tight text-primary">FruiQ AI</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
            </header>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={cn(
                "fixed top-16 left-0 right-0 bg-card border-b border-border z-40 transition-transform duration-300 ease-in-out overflow-y-auto max-h-[calc(100vh-4rem)]",
                isOpen ? "translate-y-0" : "-translate-y-full"
            )}>
                <nav className="p-4 space-y-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center px-4 py-4 text-base font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )
                            }
                        >
                            {link.icon}
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
}

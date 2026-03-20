import React from 'react';
import { NavLink } from 'react-router-dom';
import { Apple, LineChart, UploadCloud, Info, MessageSquare, BookOpen } from 'lucide-react';
import { cn } from '../../utils/helpers';

export function Sidebar() {
    const links = [
        { name: 'Dashboard', path: '/', icon: <LineChart className="w-5 h-5 mr-3" /> },
        { name: 'Scan Fruit', path: '/scan', icon: <UploadCloud className="w-5 h-5 mr-3" /> },
        { name: 'Batch Process', path: '/batch', icon: <Apple className="w-5 h-5 mr-3" /> },
        { name: 'Blog', path: '/blog', icon: <BookOpen className="w-5 h-5 mr-3" /> },
        { name: 'About', path: '/about', icon: <Info className="w-5 h-5 mr-3" /> },
        { name: 'Contact Us', path: '/contact', icon: <MessageSquare className="w-5 h-5 mr-3" /> },
    ];

    return (
        <aside className="w-64 bg-card h-screen border-r border-border hidden md:flex flex-col">
            <div className="p-6 pb-2">
                <h1 className="text-2xl font-bold flex items-center text-primary">
                    FruiQ AI
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Smart Quality Platform</p>
            </div>

            <nav className="flex-1 px-4 mt-8 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
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

            <div className="p-6 border-t border-border">
                <div className="text-xs text-muted-foreground">Version 1.0.0</div>
            </div>
        </aside>
    );
}

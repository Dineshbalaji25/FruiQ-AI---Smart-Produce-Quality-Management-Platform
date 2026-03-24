import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Apple, ShoppingCart, Store, Utensils, Shield, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '../common/Button';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [solutionsOpen, setSolutionsOpen] = useState(false);

    const solutions = [
        { name: 'Consumers', icon: <ShoppingCart className="w-5 h-5 text-primary" />, desc: 'Check if the fruit you bought is safe before eating', id: 'consumers' },
        { name: 'Vendors & traders', icon: <Store className="w-5 h-5 text-primary" />, desc: 'Verify your stock quality before selling', id: 'vendors' },
        { name: 'Restaurants', icon: <Utensils className="w-5 h-5 text-primary" />, desc: 'Screen incoming produce for your kitchen', id: 'restaurants' },
        { name: 'Food inspectors', icon: <Shield className="w-5 h-5 text-primary" />, desc: 'Quick field screening without lab equipment', id: 'inspectors' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Apple className="w-8 h-8 text-primary" />
                            <span className="text-xl font-bold tracking-tight">FruiQ</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <div className="relative group"
                            onMouseEnter={() => setSolutionsOpen(true)}
                            onMouseLeave={() => setSolutionsOpen(false)}>
                            <button className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors py-2">
                                Solutions <ChevronDown className="w-4 h-4" />
                            </button>

                            {/* Mega Menu Dropdown */}
                            {solutionsOpen && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-card border border-border shadow-lg rounded-xl p-4 grid grid-cols-2 gap-4">
                                    {solutions.map((sol) => (
                                        <Link key={sol.name} to={`/?id=${sol.id}`} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                                            <div className="mt-1 bg-primary/10 p-2 rounded-md">
                                                {sol.icon}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-foreground">{sol.name}</div>
                                                <div className="text-sm text-muted-foreground mt-1">{sol.desc}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">About</Link>
                        <Link to="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Blog</Link>

                        <div className="flex items-center gap-4 ml-4 border-l border-border pl-8">
                            <Link to="/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Dashboard</Link>
                            <Link to="/batch" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Batch Process</Link>
                            <Button asChild size="sm">
                                <Link to="/scan">Scan Fruit</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-foreground">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-card border-b border-border p-4 space-y-4">
                    <div className="font-semibold px-2 mb-2">Solutions</div>
                    {solutions.map((sol) => (
                        <Link key={sol.name} to={`/?id=${sol.id}`} className="block px-2 py-1 text-muted-foreground hover:text-primary" onClick={() => setIsOpen(false)}>
                            {sol.name}
                        </Link>
                    ))}
                    <div className="border-t border-border my-2"></div>
                    <Link to="/about" className="block px-2 py-2 text-foreground font-medium" onClick={() => setIsOpen(false)}>About</Link>
                    <Link to="/blog" className="block px-2 py-2 text-foreground font-medium" onClick={() => setIsOpen(false)}>Blog</Link>
                    <Link to="/dashboard" className="block px-2 py-2 text-foreground font-medium" onClick={() => setIsOpen(false)}>Dashboard</Link>
                    <Link to="/batch" className="block px-2 py-2 text-foreground font-medium" onClick={() => setIsOpen(false)}>Batch Process</Link>
                    <Button asChild className="w-full mt-4" onClick={() => setIsOpen(false)}>
                        <Link to="/scan">Scan Fruit</Link>
                    </Button>
                </div>
            )}
        </nav>
    );
}

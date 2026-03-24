import React from 'react';
import { Link } from 'react-router-dom';
import { Apple, Twitter, Github, Linkedin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-card border-t border-border mt-auto dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <Apple className="w-8 h-8 text-primary" />
                            <span className="text-xl font-bold tracking-tight">FruiQ</span>
                        </Link>
                        <p className="text-muted-foreground text-sm">
                            Smart produce quality management for consumers, vendors, restaurants, and inspectors.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li><Link to="/scan" className="text-muted-foreground hover:text-primary text-sm transition-colors">Scan Fruit</Link></li>
                            <li><Link to="/dashboard" className="text-muted-foreground hover:text-primary text-sm transition-colors">Dashboard</Link></li>
                            <li><Link to="/batch" className="text-muted-foreground hover:text-primary text-sm transition-colors">Batch Process</Link></li>
                            <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">Solutions</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Capabilities</h3>
                        <ul className="space-y-2">
                            <li><Link to="/detect-rotten-fruits" className="text-muted-foreground hover:text-primary text-sm transition-colors">Detect Rotten Fruits</Link></li>
                            <li><Link to="/fruit-freshness-checker" className="text-muted-foreground hover:text-primary text-sm transition-colors">Freshness Checker</Link></li>
                            <li><Link to="/formalin-detection-fruits" className="text-muted-foreground hover:text-primary text-sm transition-colors">Formalin Detection</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><Link to="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">About Us</Link></li>
                            <li><Link to="/blog" className="text-muted-foreground hover:text-primary text-sm transition-colors">Blog</Link></li>
                            <li><Link to="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} FruiQ AI. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm">
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

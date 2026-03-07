import React from 'react';
import { Leaf, Cpu, ShieldCheck, Zap, Github } from 'lucide-react';

export function About() {
    return (
        <div className="space-y-12 animate-in fade-in zoom-in duration-500 pb-16">
            {/* Hero Section */}
            <div className="text-center space-y-4 pt-8">
                <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4 shadow-sm">
                    <Leaf className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">FruiQ AI</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    The Smart Produce Quality Management Platform powered by advanced Deep Learning.
                </p>
            </div>

            {/* Mission Statement */}
            <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm text-center max-w-4xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-primary to-emerald-600"></div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Food waste and unsafe chemical treatments are critical global challenges. FruiQ AI was engineered to bridge the gap between cutting-edge artificial intelligence and agricultural supply chains. By utilizing state-of-the-art computer vision models, we empower distributors, retailers, and consumers to instantly assess fruit freshness, detect harmful formalin treatments, and estimate precise shelf-life.
                </p>
            </div>

            {/* Features / Value Props */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="bg-background border rounded-2xl p-6 hover:border-primary/50 transition-colors shadow-sm group">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Cpu className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">EfficientNetV2 Architecture</h3>
                    <p className="text-sm text-muted-foreground">
                        Utilizing a highly optimized convolutional neural network, FruiQ achieves remarkable accuracy parameters while maintaining rapid inference times.
                    </p>
                </div>

                <div className="bg-background border rounded-2xl p-6 hover:border-destructive/50 transition-colors shadow-sm group">
                    <div className="bg-destructive/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-6 h-6 text-destructive" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Toxin & Formalin Detection</h3>
                    <p className="text-sm text-muted-foreground">
                        Specialized classification heads identify anomalous visual textures typical of formalin treatment, protecting end-consumers from toxic exposure.
                    </p>
                </div>

                <div className="bg-background border rounded-2xl p-6 hover:border-blue-500/50 transition-colors shadow-sm group">
                    <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Real-time Batch Processing</h3>
                    <p className="text-sm text-muted-foreground">
                        Engineered for scale, our batch APIs allow industrial warehouses to validate entire crates in seconds rather than individually.
                    </p>
                </div>
            </div>

            {/* Tech Stack - HIDDEN PER REQUEST */}
            {/* 
            <div className="max-w-4xl mx-auto pt-8 border-t border-border">
                <h3 className="text-center text-xl font-bold mb-8">Modern Technology Stack</h3>
                <div className="flex flex-wrap justify-center gap-4">
                    {['React 18', 'Tailwind CSS v4', 'Vite', 'Flask', 'TensorFlow', 'EfficientNet', 'SQLAlchemy'].map((tech) => (
                        <span key={tech} className="px-5 py-2.5 bg-secondary text-secondary-foreground rounded-full text-sm font-bold border border-border shadow-sm hover:bg-secondary/80 transition-colors">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
            */}

            {/* Footer links - HIDDEN PER REQUEST */}
            {/* 
            <div className="text-center pt-8">
                <a
                    href="https://github.com/Dineshbalaji25/FruiQ-AI---Smart-Produce-Quality-Management-Platform"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border hover:border-primary/50 hover:bg-primary/5 shadow-sm text-foreground rounded-xl font-medium transition-all"
                >
                    <Github className="w-5 h-5" />
                    View Open Source Repository
                </a>
            </div>
            */}
        </div>
    );
}

import React from 'react';
import { Apple, Crosshair, BarChart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 space-y-12">
            <div className="space-y-6 max-w-3xl">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                    <Apple className="text-primary w-12 h-12" />
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
                    Smart Produce <br /> Quality Management
                </h1>
                <p className="text-xl text-muted-foreground">
                    Next-generation platform for real-time fruit quality assessment using deep learning. Ensure food safety, predict shelf life, and grade faster.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Button asChild size="lg" className="text-lg">
                        <Link to="/scan">Scan Fruit Now</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="text-lg">
                        <Link to="/about">Learn More</Link>
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mt-12 w-full">
                <div className="bg-card border p-6 rounded-xl flex flex-col items-center shadow-sm">
                    <Crosshair className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-lg font-bold">Precision Grading</h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                        AI-driven assessments delivering Freshness Scores (0-100) and letter grades in under 100ms.
                    </p>
                </div>
                <div className="bg-card border p-6 rounded-xl flex flex-col items-center shadow-sm">
                    <ShieldCheck className="w-10 h-10 text-destructive mb-4" />
                    <h3 className="text-lg font-bold">Food Safety First</h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Unique advanced detection system capable of identifying harmful formalin treatments.
                    </p>
                </div>
                <div className="bg-card border p-6 rounded-xl flex flex-col items-center shadow-sm">
                    <BarChart className="w-10 h-10 text-accent-foreground mb-4" />
                    <h3 className="text-lg font-bold">Shelf Life & Analytics</h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Rule-based estimation models to predict optimal consumption dates with confidence.
                    </p>
                </div>
            </div>
        </div>
    );
}

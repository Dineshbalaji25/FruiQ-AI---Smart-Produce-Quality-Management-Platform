import React from 'react';
import { Apple } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

// Home components
import { StatsBar } from '../components/home/StatsBar';
import { HowItWorks } from '../components/home/HowItWorks';
import { FruitGrid } from '../components/home/FruitGrid';
import { UserSegments } from '../components/home/UserSegments';
import { FAQAccordion } from '../components/home/FAQAccordion';
import { TrustStrip } from '../components/home/TrustStrip';
import { useLocation } from 'react-router-dom';

export function Home() {
    const { search } = useLocation();

    React.useEffect(() => {
        const params = new URLSearchParams(search);
        const id = params.get('id');
        if (id) {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                // Clean up the URL by removing the query param (optional but cleaner)
                window.history.replaceState(null, '', window.location.pathname + window.location.hash.split('?')[0]);
            }
        }
    }, [search]);

    return (
        <div className="flex flex-col min-h-screen">
            {/* HERO SECTION */}
            <div className="flex flex-col items-center justify-center text-center px-4 pt-16 pb-12 space-y-8 max-w-4xl mx-auto">
                <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
                    <Apple className="text-primary w-14 h-14" />
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                    Smart Produce <br className="hidden md:inline" /> Quality Management
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                    Next-generation platform for real-time fruit quality assessment using deep learning. Ensure food safety, predict shelf life, and grade faster.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 w-full sm:w-auto">
                    <Button asChild size="lg" className="text-lg w-full sm:w-auto h-14 px-8">
                        <Link to="/scan">Scan Fruit Now</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="text-lg w-full sm:w-auto h-14 px-8">
                        <Link to="/about">Learn More</Link>
                    </Button>
                </div>
            </div>

            {/* COMPONENT 1: Stats Bar */}
            <StatsBar />

            {/* COMPONENT 7: Trust Logo Strip (Placeholder for now) */}
            <TrustStrip />

            {/* COMPONENT 2: How It Works */}
            <div className="bg-muted/30 border-y border-border">
                <HowItWorks />
            </div>

            {/* COMPONENT 4: User Segment Selector (Consumer, Vendor, etc.) */}
            <UserSegments />

            {/* COMPONENT 3: Fruit Grid */}
            <div className="bg-muted/30 border-y border-border">
                <FruitGrid />
            </div>

            {/* COMPONENT 6: FAQ Accordion */}
            <FAQAccordion />

            {/* BOTTOM CTA */}
            <div className="w-full bg-primary text-primary-foreground py-20 px-4 text-center">
                <h2 className="text-4xl font-extrabold mb-6">Ready to check your produce?</h2>
                <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">Join thousands of users screening their food quality seamlessly with our real-time AI.</p>
                <Button asChild size="lg" className="text-lg h-14 px-10 bg-background text-foreground hover:bg-muted font-bold">
                    <Link to="/scan">Start Scanning For Free</Link>
                </Button>
            </div>
        </div>
    );
}

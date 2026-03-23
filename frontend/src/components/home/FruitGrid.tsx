import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function FruitGrid() {
    const fruits = [
        { emoji: "🍎", name: "Apple", path: "/fruit-freshness-checker" },
        { emoji: "🍌", name: "Banana", path: "/fruit-freshness-checker" },
        { emoji: "🍊", name: "Orange", path: "/detect-rotten-fruits" },
        { emoji: "🥭", name: "Mango", path: "/formalin-detection-fruits" },
        { emoji: "🍅", name: "Tomato", path: "/fruit-freshness-checker" },
        { emoji: "🍉", name: "Watermelon", path: "/detect-rotten-fruits" },
        { emoji: "🍍", name: "Pineapple", path: "/detect-rotten-fruits" },
        { emoji: "🍇", name: "Grapes", path: "/fruit-freshness-checker" },
        { emoji: "🍓", name: "Strawberry", path: "/fruit-freshness-checker" },
        { emoji: "🥑", name: "Avocado", path: "/fruit-freshness-checker" },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto py-16 px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">Supported Produce</h2>
                    <p className="mt-2 text-muted-foreground text-lg">Over 10+ types trained on thousands of samples</p>
                </div>
                <Link to="/scan" className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1 group">
                    View all models <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {fruits.map((fruit, idx) => (
                    <Link
                        key={idx}
                        to={fruit.path}
                        className="group flex flex-col items-center p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                    >
                        <span className="text-5xl group-hover:scale-110 transition-transform mb-4">
                            {fruit.emoji}
                        </span>
                        <span className="font-semibold text-foreground">{fruit.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

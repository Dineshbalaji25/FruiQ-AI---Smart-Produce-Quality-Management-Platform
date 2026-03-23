import React from 'react';
import { ShoppingCart, Store, Utensils, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function UserSegments() {
    const segments = [
        {
            id: "consumers",
            title: "Consumers",
            icon: <ShoppingCart className="w-6 h-6" />,
            description: "Check if the fruit you bought is safe before eating.",
            action: "Scan your first fruit",
            color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
        },
        {
            id: "vendors",
            title: "Vendors & Traders",
            icon: <Store className="w-6 h-6" />,
            description: "Verify your stock quality before selling to bulk buyers.",
            action: "Grade your stock",
            color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
        },
        {
            id: "restaurants",
            title: "Restaurants",
            icon: <Utensils className="w-6 h-6" />,
            description: "Screen incoming produce to ensure premium kitchen standards.",
            action: "Start screening",
            color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
        },
        {
            id: "inspectors",
            title: "Food Inspectors",
            icon: <Shield className="w-6 h-6" />,
            description: "Quick field screening without needing bulky lab equipment.",
            action: "Explore testing tools",
            color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
        }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto py-20 px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Built for Every Link in the Chain</h2>
                <p className="mt-4 text-xl text-muted-foreground">Tailored intelligence from farm to table</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {segments.map((segment) => (
                    <div
                        id={segment.id}
                        key={segment.id}
                        className="flex flex-col p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-lg transition-all pt-10"
                    >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm ${segment.color}`}>
                            {segment.icon}
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{segment.title}</h3>
                        <p className="text-muted-foreground mb-8 flex-grow">
                            {segment.description}
                        </p>
                        <Link to="/scan" className="inline-flex items-center text-primary font-medium group transition-colors hover:text-primary/80">
                            {segment.action} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

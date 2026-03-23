import React from 'react';

export function StatsBar() {
    const stats = [
        { value: "3s", label: "Scan speed", sub: "instant results" },
        { value: "5,400+", label: "Training images", sub: "FruitVision dataset" },
        { value: "3", label: "Threat categories", sub: "Fresh / Rotten / Formalin" },
        { value: "10+", label: "Fruit types", sub: "more added monthly" },
    ];

    return (
        <div className="w-full max-w-5xl mx-auto py-8 px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center text-center space-y-2 p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary drop-shadow-sm">
                            {stat.value}
                        </span>
                        <span className="text-sm md:text-base font-semibold text-foreground">
                            {stat.label}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            {stat.sub}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

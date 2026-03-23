import React from 'react';

export function TrustStrip() {
    const partners = [
        { name: "FruitVision Dataset", highlight: true },
        { name: "TensorFlow", highlight: false },
        { name: "Hugging Face", highlight: false },
        { name: "EfficientNetV2", highlight: true },
        { name: "Vercel", highlight: false }
    ];

    return (
        <div className="w-full py-10 border-y border-border bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 overflow-hidden">
                <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                    Powered By Industry Standards
                </p>
                <div className="flex justify-center items-center flex-wrap gap-8 md:gap-16 opacity-70">
                    {partners.map((partner, idx) => (
                        <div
                            key={idx}
                            className={`flex items-center space-x-2 text-xl md:text-2xl font-bold transition-all ${partner.highlight ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <span className="tracking-tighter">{partner.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import { Camera, Zap, FileCheck } from 'lucide-react';

export function HowItWorks() {
    const steps = [
        {
            icon: <Camera className="w-8 h-8 text-primary" />,
            number: "1",
            title: "Take a photo",
            description: "Upload an image of your produce from any device"
        },
        {
            icon: <Zap className="w-8 h-8 text-primary" />,
            number: "2",
            title: "AI analyses in 3 seconds",
            description: "Our proprietary FruitVision model processes the image instantly"
        },
        {
            icon: <FileCheck className="w-8 h-8 text-primary" />,
            number: "3",
            title: "Get freshness score + verdict",
            description: "Receive letter grades and safety alerts before you buy or sell"
        }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto py-16 px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">How FruiQ Works</h2>
                <p className="mt-4 text-xl text-muted-foreground">Three simple steps to smarter produce grading</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
                {/* Connection line for desktop */}
                <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-border to-transparent z-0"></div>

                {steps.map((step, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center text-center p-6 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-card border-4 border-background shadow-md flex items-center justify-center relative">
                            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                {step.number}
                            </div>
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-bold">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

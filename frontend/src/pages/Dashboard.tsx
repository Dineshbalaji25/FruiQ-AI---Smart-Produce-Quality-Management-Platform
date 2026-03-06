import React from 'react';
import { Apple, LineChart, PieChart, Activity } from 'lucide-react';

export function Dashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard & Analytics</h2>
            </div>

            {/* Overview Stats */}
            <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Scans</h3>
                        <LineChart className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="text-3xl font-bold mt-2">15,000</div>
                    <p className="text-xs text-muted-foreground mt-1">+2.4% from last month</p>
                </div>
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">Accuracy Rate</h3>
                        <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-3xl font-bold mt-2">94.8%</div>
                    <p className="text-xs text-muted-foreground mt-1 text-primary">High precision</p>
                </div>
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">Fresh Quality</h3>
                        <Apple className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="text-3xl font-bold mt-2">8,500</div>
                    <p className="text-xs text-muted-foreground mt-1 text-emerald-500">56% of total</p>
                </div>
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">Unsafe Detected</h3>
                        <PieChart className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="text-3xl font-bold mt-2">1,300</div>
                    <p className="text-xs text-muted-foreground mt-1 text-destructive">Formalin treated</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card border rounded-xl p-6 h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">Accuracy vs Time Chart Placeholder</p>
                </div>
                <div className="bg-card border rounded-xl p-6 h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">Class Distribution Chart Placeholder</p>
                </div>
            </div>

        </div>
    );
}

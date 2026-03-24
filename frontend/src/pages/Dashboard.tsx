import React, { useEffect, useState } from 'react';
import { Apple, Activity, PieChart, ShieldAlert, Zap, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';

interface DashboardStats {
    total_predictions: number;
    accuracy: number;
    average_confidence: number;
    class_distribution: {
        fresh: number;
        rotten: number;
        formalin: number;
    };
    trend_data: { date: string; scans: number }[];
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // Emerald, Amber, Red

export function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/api/v1/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex h-[80vh] items-center justify-center animate-pulse text-muted-foreground font-medium">Loading AI metrics...</div>;
    }

    if (!stats) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center text-muted-foreground font-medium space-y-4">
                <ShieldAlert className="w-12 h-12 text-destructive/50" />
                <p>Unable to synchronize with the AI analysis engine.</p>
                <p className="text-xs">The statistics endpoint might be temporarily unavailable or misconfigured.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-bold shadow-sm"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    const pieData = [
        { name: 'Fresh', value: stats.class_distribution.fresh },
        { name: 'Rotten', value: stats.class_distribution.rotten },
        { name: 'Formalin (Unsafe)', value: stats.class_distribution.formalin }
    ];

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Real-Time AI Analytics</h2>
            </div>

            {/* Overview Stats */}
            <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-card border rounded-xl p-6 shadow-sm hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Scans</h3>
                        <Activity className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="text-3xl font-bold mt-2">{stats.total_predictions.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1 text-primary">Live data stream</p>
                </div>

                <div className="bg-card border rounded-xl p-6 shadow-sm hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">Theoretical Accuracy</h3>
                        <Zap className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="text-3xl font-bold mt-2">{stats.accuracy}%</div>
                    <p className="text-xs text-muted-foreground mt-1 text-yellow-500">Model Precision</p>
                </div>

                <div className="bg-card border rounded-xl p-6 shadow-sm hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">Fresh Quality</h3>
                        <Apple className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="text-3xl font-bold mt-2">{stats.class_distribution.fresh.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1 text-emerald-500">
                        {stats.total_predictions > 0
                            ? Math.round((stats.class_distribution.fresh / stats.total_predictions) * 100)
                            : 0}% of total
                    </p>
                </div>

                <div className="bg-card border rounded-xl p-6 shadow-sm hover:border-destructive/50 transition-colors bg-gradient-to-br from-card to-destructive/5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">Unsafe (Formalin)</h3>
                        <ShieldAlert className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="text-3xl font-bold mt-2 text-destructive">{stats.class_distribution.formalin.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1 text-destructive">Toxic items flagged</p>
                </div>
            </div>

            {/* Custom Dynamic Intelligence Feature */}
            <div className="bg-gradient-to-r from-primary/10 via-background to-background border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/20 p-4 rounded-full">
                        <TrendingUp className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold">Model Confidence Matrix</h3>
                        <p className="text-sm text-muted-foreground">The AI is highly confident in its current decision boundary across all classes.</p>
                        <div className="mt-4 bg-muted h-3 rounded-full overflow-hidden relative">
                            {/* Animated progress bar representing average confidence */}
                            <div
                                className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-out"
                                style={{ width: `${stats.average_confidence * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs font-semibold">
                            <span>0%</span>
                            <span className="text-primary">{Math.round(stats.average_confidence * 100)}% Average AI Confidence Score</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Trend Chart */}
                <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col min-h-[400px]">
                    <h3 className="text-lg font-bold mb-6">Scan Volume Trend (7 Days)</h3>
                    <div className="w-full min-h-[320px]">
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={stats.trend_data}>
                                <defs>
                                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                                <Area type="monotone" dataKey="scans" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Chart */}
                <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col min-h-[400px]">
                    <h3 className="text-lg font-bold mb-6">Aggregate Quality Distribution</h3>
                    <div className="w-full min-h-[320px]">
                        <ResponsiveContainer width="100%" height={320}>
                            <RechartsPieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={75}
                                    outerRadius={105}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
}

import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, RefreshCw, FileText, Image as ImageIcon, Camera } from 'lucide-react';
import { Button } from '../components/common/Button';
import api from '../services/api';
import { motion } from 'framer-motion';

interface BatchResult {
    filename: string;
    error?: string;
    prediction?: {
        class: string;
        confidence: number;
        freshness_score: number;
        grade: string;
    };
    safety?: {
        formalin_detected: boolean;
    };
    shelf_life?: {
        estimated_days: number;
        optimal_consumption_date: string;
        storage_recommendation: string;
    };
}

export function BatchProcess() {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<BatchResult[] | null>(null);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(Array.from(e.target.files));
            setResults(null);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setLoading(true);
        setError('');

        const formData = new FormData();
        files.forEach((file) => formData.append('images', file));

        // Match default batch analysis parameters
        formData.append('include_shelf_life', 'true');
        formData.append('include_gradcam', 'false'); // Usually off for speed in batching

        try {
            const response = await api.post('/predict/batch', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResults(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to perform batch analysis.');
        } finally {
            setLoading(false);
        }
    };

    const getGeneralAssessment = () => {
        if (!results) return null;

        const validResults = results.filter(r => !r.error && r.prediction);
        if (validResults.length === 0) return null;

        const total = validResults.length;
        const fresh = validResults.filter(r => r.prediction?.class === 'fresh').length;
        const rotten = validResults.filter(r => r.prediction?.class === 'rotten').length;
        const formalin = validResults.filter(r => r.safety?.formalin_detected).length;

        const avgScore = validResults.reduce((acc, curr) => acc + (curr.prediction?.freshness_score || 0), 0) / total;

        return {
            total,
            fresh,
            rotten,
            formalin,
            avgScore: Math.round(avgScore)
        };
    };

    const assessment = getGeneralAssessment();

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Bulk AI Inspection</h2>
            </div>

            {/* Guidelines / Criterias block */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Batch Analysis Criteria & Guidelines
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <ImageIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-semibold text-foreground">Supported File Formats</p>
                                <p className="text-muted-foreground">Upload images exclusively in .JPG, .PNG, or .WEBP format. Max 10MB per image.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-semibold text-foreground">File Volume Limits</p>
                                <p className="text-muted-foreground">You can upload up to 50 images simultaneously in a single batch request.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <Camera className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-semibold text-foreground">Image Clarity Requirement</p>
                                <p className="text-muted-foreground">Ensure fruits are photographed in well-lit environments. Subjects must be centered and non-blurring. Heavy background noise reduces model accuracy.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-semibold text-foreground">Single Item Preference</p>
                                <p className="text-muted-foreground">For optimal AI confidence boundaries, each image should preferably contain one focal fruit rather than a pile.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">

                {/* Upload Section */}
                <div className="md:col-span-1 flex flex-col space-y-4">
                    <h3 className="font-semibold text-lg">1. Upload Queue</h3>
                    <div className="border-2 border-dashed border-border rounded-xl p-8 bg-card flex flex-col items-center justify-center min-h-[250px] hover:border-primary/50 transition-colors">
                        <label className="flex flex-col items-center cursor-pointer text-center w-full">
                            <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
                            <span className="text-md font-medium">Select Images</span>
                            <span className="text-xs text-muted-foreground mt-1 mb-4">Click to browse multiple files</span>
                            <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />

                            {files.length > 0 && (
                                <div className="mt-4 p-3 bg-muted rounded-md w-full text-sm font-semibold">
                                    {files.length} file(s) queued for scan
                                </div>
                            )}
                        </label>
                    </div>
                    {files.length > 0 && (
                        <div className="flex justify-between items-center text-sm text-muted-foreground px-1">
                            <span>Ready to process.</span>
                            <button
                                onClick={() => { setFiles([]); setResults(null); }}
                                className="text-destructive hover:underline"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                    <Button
                        className="w-full text-md h-12"
                        disabled={files.length === 0 || loading}
                        onClick={handleUpload}
                    >
                        {loading ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : null}
                        {loading ? 'Analyzing batch...' : 'Run Bulk Analysis'}
                    </Button>
                    {error && <p className="text-sm text-destructive mt-2">{error}</p>}
                </div>

                {/* Results Section */}
                <div className="md:col-span-2 space-y-6">
                    <h3 className="font-semibold text-lg">2. Report Matrix</h3>

                    {!results && !loading && (
                        <div className="border border-border rounded-xl p-12 bg-card text-center text-muted-foreground">
                            Waiting for batch data payload.
                        </div>
                    )}

                    {loading && (
                        <div className="border border-border rounded-xl p-12 bg-card text-center flex flex-col items-center justify-center gap-4 text-primary">
                            <RefreshCw className="w-10 h-10 animate-spin" />
                            <p className="font-semibold animate-pulse">Running neural networks at scale...</p>
                        </div>
                    )}

                    {results && assessment && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">

                            {/* Dashboard-lite Summary block */}
                            <div className="grid grid-cols-4 gap-4">
                                <div className="bg-card border rounded-xl p-4 shadow-sm text-center">
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Total Evaluated</p>
                                    <p className="text-xl font-bold mt-1">{assessment.total}</p>
                                </div>
                                <div className="bg-card border rounded-xl p-4 shadow-sm text-center">
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Fresh Count</p>
                                    <p className="text-xl font-bold mt-1 text-primary">{assessment.fresh}</p>
                                </div>
                                <div className="bg-card border rounded-xl p-4 shadow-sm text-center">
                                    <p className="text-xs text-destructive uppercase tracking-widest font-bold">Unsafe / Toxic</p>
                                    <p className="text-xl font-bold mt-1 text-destructive">{assessment.formalin}</p>
                                </div>
                                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
                                    <p className="text-xs text-primary uppercase tracking-widest font-bold">Batch Avg. Score</p>
                                    <p className="text-xl font-bold mt-1 text-primary">{assessment.avgScore}/100</p>
                                </div>
                            </div>

                            {/* Itemized list */}
                            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-muted p-4 grid grid-cols-12 gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border border-dashed">
                                    <div className="col-span-4">File ID</div>
                                    <div className="col-span-3">Classification</div>
                                    <div className="col-span-2 text-center">Score</div>
                                    <div className="col-span-3">Shelf Life Est.</div>
                                </div>

                                <div className="divide-y divide-border">
                                    {results.map((res, i) => (
                                        <div key={i} className="p-4 grid grid-cols-12 gap-4 items-center text-sm">
                                            <div className="col-span-4 font-mono truncate" title={res.filename}>
                                                {res.filename}
                                            </div>

                                            {res.error ? (
                                                <div className="col-span-8 text-destructive text-xs">Error: {res.error}</div>
                                            ) : res.prediction ? (
                                                <>
                                                    <div className="col-span-3 capitalize">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${res.safety?.formalin_detected ? 'bg-destructive/10 text-destructive' :
                                                                res.prediction.class === 'rotten' ? 'bg-orange-500/10 text-orange-500' :
                                                                    'bg-primary/10 text-primary'
                                                            }`}>
                                                            {res.safety?.formalin_detected && <AlertTriangle className="w-3 h-3" />}
                                                            {res.safety?.formalin_detected ? 'Formalin' : res.prediction.class}
                                                        </span>
                                                    </div>

                                                    <div className="col-span-2 text-center font-bold">
                                                        {res.prediction.freshness_score}
                                                    </div>

                                                    <div className="col-span-3 text-muted-foreground truncate">
                                                        {res.shelf_life?.estimated_days} days
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

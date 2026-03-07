import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, RefreshCw, Apple } from 'lucide-react';
import { Button } from '../components/common/Button';
import api from '../services/api';
import { motion } from 'framer-motion';

export function Scan() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setResult(null);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('image', file);
        formData.append('include_gradcam', 'true');
        formData.append('include_shelf_life', 'true');

        try {
            const response = await api.post('/predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to scan the fruit.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Smart Fruit Scan</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">

                {/* Upload Section */}
                <div className="flex flex-col space-y-4">
                    <div className="border-2 border-dashed border-border rounded-xl p-8 bg-card flex flex-col items-center justify-center min-h-[300px] hover:border-primary/50 transition-colors">
                        {!previewUrl ? (
                            <label className="flex flex-col items-center cursor-pointer text-center">
                                <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
                                <span className="text-lg font-medium">Click or Drag to Upload</span>
                                <span className="text-sm text-muted-foreground mt-1">PNG, JPG, WEBP up to 16MB</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img src={previewUrl} alt="Preview" className="max-h-[300px] rounded-md object-contain" />
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="absolute top-2 right-2 rounded-full shadow-md"
                                    onClick={() => {
                                        setFile(null);
                                        setPreviewUrl(null);
                                        setResult(null);
                                    }}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <Button
                        className="w-full text-lg h-12"
                        disabled={!file || loading}
                        onClick={handleUpload}
                    >
                        {loading ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : null}
                        {loading ? 'Processing Analysis...' : 'Start Analysis'}
                    </Button>
                    {error && <p className="text-sm text-destructive mt-2">{error}</p>}
                </div>

                {/* Results Section */}
                <div className="bg-card border rounded-xl overflow-hidden shadow-sm relative min-h-[400px]">
                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 transition-all">
                            <RefreshCw className="w-10 h-10 text-primary animate-spin mb-4" />
                            <p className="animate-pulse font-medium">Running deep learning models...</p>
                        </div>
                    ) : result ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 h-full flex flex-col space-y-6">

                            {/* Header Score Info */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold capitalize">{result.prediction.class}</h3>
                                    <p className="text-muted-foreground">Confidence: {(result.prediction.confidence * 100).toFixed(1)}%</p>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <div className="text-4xl font-black text-primary flex items-center gap-1">
                                        {result.prediction.freshness_score}
                                        <span className="text-lg text-muted-foreground font-medium">/100</span>
                                    </div>
                                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold mt-2">
                                        Grade {result.prediction.grade}
                                    </span>
                                </div>
                            </div>

                            {/* Safety Alert (Formalin) */}
                            {result.safety.formalin_detected ? (
                                <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded flex gap-3 text-destructive">
                                    <AlertTriangle className="w-6 h-6 shrink-0" />
                                    <div>
                                        <p className="font-bold">Formalin Detected</p>
                                        <p className="text-sm opacity-90">This produce is unsafe for consumption.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-primary/10 border-l-4 border-primary p-4 rounded flex gap-3 text-primary">
                                    <CheckCircle className="w-6 h-6 shrink-0" />
                                    <div>
                                        <p className="font-bold">Safe</p>
                                        <p className="text-sm opacity-90">No chemical treatments detected.</p>
                                    </div>
                                </div>
                            )}

                            {/* Shelf Life */}
                            {result.shelf_life && (
                                <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Estimated Shelf Life</p>
                                        <p className="font-bold">{result.shelf_life.estimated_days} days</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Optimal Date</p>
                                        <p className="font-bold">{result.shelf_life.optimal_consumption_date}</p>
                                    </div>
                                </div>
                            )}

                            {/* Grad CAM Visual (Mock for demonstration) */}
                            {result.visualization?.heatmap_overlay && (
                                <div className="mt-auto space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Activation Map (Explainable AI)</p>
                                    <img
                                        src={`data:image/jpeg;base64,${result.visualization.heatmap_overlay}`}
                                        alt="Heatmap"
                                        className="w-full h-48 object-cover rounded-lg border shadow-inner"
                                    />
                                </div>
                            )}

                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col justify-center items-center text-muted-foreground opacity-50 p-6 text-center">
                            <Apple className="w-16 h-16 mb-4" />
                            <p>Upload a fruit image and tap Start Analysis to see comprehensive quality results.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

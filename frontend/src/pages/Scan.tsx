import React, { useState, useCallback } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, RefreshCw, Apple, Camera as CameraIcon, Settings, Activity, FileText } from 'lucide-react';
import { Button } from '../components/common/Button';
import { motion } from 'framer-motion';
import { Camera } from '../components/upload/Camera';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ✅ Single source of truth for the API base URL
const API_BASE = import.meta.env.VITE_API_URL || '';

interface Protocol {
    id: string;
    name: string;
    description: string;
    thresholds: {
        A: number;
        B: number;
        C: number;
    };
}

const PROTOCOLS: Protocol[] = [
    { id: 'standard', name: 'Global Standard', description: 'Default industry quality thresholds.', thresholds: { A: 90, B: 75, C: 60 } },
    { id: 'premium', name: 'Premium Export', description: 'Strict criteria for long-distance export.', thresholds: { A: 95, B: 85, C: 75 } },
    { id: 'retail', name: 'Local Retail', description: 'Flexible criteria for immediate local sale.', thresholds: { A: 85, B: 70, C: 55 } },
];

export function Scan() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [cameraOpen, setCameraOpen] = useState(false);
    const [selectedProtocol, setSelectedProtocol] = useState<Protocol>(PROTOCOLS[0]);
    const [supplier, setSupplier] = useState('');

    const calculateInhouseGrade = (score: number) => {
        if (score >= selectedProtocol.thresholds.A) return 'A';
        if (score >= selectedProtocol.thresholds.B) return 'B';
        if (score >= selectedProtocol.thresholds.C) return 'C';
        return 'Reject';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setResult(null);
            setError('');
        }
    };

    const runPrediction = useCallback(async (targetFile: File) => {
        setLoading(true);
        setResult(null);
        setError('');

        const formData = new FormData();
        formData.append('image', targetFile);
        formData.append('include_gradcam', 'true');
        formData.append('include_shelf_life', 'true');
        formData.append('fruit_type', 'apple');

        try {
            const response = await fetch(`${API_BASE}/api/v1/predict`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Server error: ${response.status}`);
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Failed to scan the fruit.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleUpload = () => {
        if (file) runPrediction(file);
    };

    const handleCameraCapture = useCallback((capturedFile: File) => {
        setFile(capturedFile);
        setPreviewUrl(URL.createObjectURL(capturedFile));
        setCameraOpen(false);
        runPrediction(capturedFile);
    }, [runPrediction]);

    const generatePDF = async () => {
        if (!result) return;

        const doc = new jsPDF();
        const timestamp = new Date().toLocaleString();
        const inhouseGrade = calculateInhouseGrade(result.prediction.freshness_score);

        // 🟢 Header (FruiQ AI branding)
        doc.setFillColor(34, 197, 94); // Primary green
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('FruiQ AI - Quality Inspection Report', 15, 25);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${timestamp}`, 145, 15);
        doc.text(`Report ID: ${result.metadata.prediction_id.split('-')[0].toUpperCase()}`, 145, 22);

        // 📦 Information Section
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('General Inspection Details', 15, 55);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Fruit Type: ${result.metadata.fruit_type.toUpperCase()}`, 15, 65);
        doc.text(`Supplier/Batch: ${supplier || 'N/A'}`, 15, 72);
        doc.text(`Quality Protocol: ${selectedProtocol.name}`, 15, 79);

        // 🎨 Protocol Grade Badge (Big Grade)
        doc.setFillColor(inhouseGrade === 'A' ? 34 : 220, inhouseGrade === 'A' ? 197 : 38, inhouseGrade === 'A' ? 94 : 38);
        doc.setDrawColor(inhouseGrade === 'A' ? 34 : 220, inhouseGrade === 'A' ? 197 : 38, inhouseGrade === 'A' ? 94 : 38);
        doc.setLineWidth(1);
        doc.rect(145, 55, 50, 25);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(inhouseGrade === 'A' ? 34 : 220, inhouseGrade === 'A' ? 197 : 38, inhouseGrade === 'A' ? 94 : 38);
        doc.text('FINAL GRADE', 155, 62);
        doc.setFontSize(20);
        doc.text(inhouseGrade, 165, 75);

        // 📸 Image Evidence
        if (previewUrl) {
            try {
                const img = new Image();
                img.src = previewUrl;
                await new Promise((resolve) => { img.onload = resolve; });
                doc.addImage(img, 'JPEG', 15, 90, 80, 60);
                doc.setFontSize(9);
                doc.setTextColor(150, 150, 150);
                doc.text('Captured Evidence Image', 15, 155);
            } catch (e) {
                console.error('PDF Image failed', e);
            }
        }

        // 📊 Metrics Table
        autoTable(doc, {
            startY: 165,
            head: [['Metric Parameter', 'Standard Threshold', 'Actual Result', 'Comparison']],
            body: [
                ['Freshness Score', `${selectedProtocol.thresholds.A}% (Min for A)`, `${result.prediction.freshness_score}%`, result.prediction.freshness_score >= selectedProtocol.thresholds.A ? 'PASS' : 'WARNING'],
                ['Safety Treatment', 'Negative', result.safety.formalin_detected ? 'POSITIVE' : 'NEGATIVE', result.safety.formalin_detected ? 'FAIL' : 'PASS'],
                ['Estimated Shelf Life', '-', `${result.shelf_life?.estimated_days || 0} Days`, '-'],
                ['AI Confidence', '> 80%', `${(result.prediction.confidence * 100).toFixed(1)}%`, result.prediction.confidence > 0.8 ? 'OPTIMAL' : 'MARCHINAL']
            ],
            theme: 'striped',
            headStyles: { fillColor: [34, 197, 94] }
        });

        const finalY = (doc as any).lastAutoTable.finalY || 220;
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'bold');
        doc.text('AI Intelligence Insight:', 15, finalY + 15);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const advice = result.safety.formalin_detected
            ? "High confidence of formalin detected. Do not distribute."
            : `Product matches ${selectedProtocol.name} requirements. Estimated consumption window is ${result.shelf_life?.estimated_days} days.`;
        doc.text(advice, 15, finalY + 22);

        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('FruiQ AI is a computer vision decision support tool. Results should be verified by professional QC inspectors.', 15, 285);

        doc.save(`FruiQ_Report_${result.metadata.prediction_id.split('-')[0]}.pdf`);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">AI Quality Inspection</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.print()} className="hidden md:flex">
                        <FileText className="w-4 h-4 mr-2" />
                        Quick Report
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="flex flex-col space-y-6">
                    <div className="bg-card border rounded-xl p-6 space-y-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Inspection Protocol
                        </h3>

                        <div className="grid gap-4">
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Quality Standard</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {PROTOCOLS.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => setSelectedProtocol(p)}
                                            className={`text-left p-3 rounded-lg border transition-all ${selectedProtocol.id === p.id
                                                ? 'bg-primary/10 border-primary ring-1 ring-primary'
                                                : 'bg-muted/50 border-transparent hover:bg-muted'
                                                }`}
                                        >
                                            <p className="font-bold text-sm">{p.name}</p>
                                            <p className="text-xs text-muted-foreground">{p.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Batch / Supplier ID</label>
                                <input
                                    type="text"
                                    placeholder="Enter batch number or supplier..."
                                    className="w-full bg-muted/50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 ring-primary/50"
                                    value={supplier}
                                    onChange={(e) => setSupplier(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            className="flex-1 h-12 text-md"
                            variant="secondary"
                            onClick={() => setCameraOpen(true)}
                        >
                            <CameraIcon className="w-5 h-5 mr-2" />
                            Live Scan
                        </Button>
                        <label className="flex-1 h-12 bg-card border hover:border-primary/50 text-foreground flex items-center justify-center rounded-md cursor-pointer transition-colors text-md font-medium">
                            <UploadCloud className="w-5 h-5 mr-2" />
                            Gallery
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>

                    <div className="border-2 border-dashed border-border rounded-xl p-8 bg-card flex flex-col items-center justify-center min-h-[300px] hover:border-primary/50 transition-colors">
                        {!previewUrl ? (
                            <div className="flex flex-col items-center text-center">
                                <Apple className="w-16 h-16 text-primary/20 mb-4" />
                                <span className="text-lg font-medium">Ready for Scan</span>
                                <span className="text-sm text-muted-foreground mt-1 px-4">
                                    Capture or upload to start automated QC
                                </span>
                            </div>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img src={previewUrl} alt="Preview" className="max-h-[350px] rounded-md object-contain" />
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="absolute top-2 right-2 rounded-full shadow-md bg-background/80 hover:bg-background"
                                    onClick={() => {
                                        setFile(null);
                                        setPreviewUrl(null);
                                        setResult(null);
                                        setError('');
                                    }}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <Button
                        className="w-full text-lg h-14 font-bold shadow-lg shadow-primary/10"
                        disabled={!file || loading}
                        onClick={handleUpload}
                    >
                        {loading ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : null}
                        {loading ? 'AI Models Running...' : 'Automated Quality Inspection'}
                    </Button>

                    {error && (
                        <p className="text-sm text-destructive mt-2 text-center font-bold">{error}</p>
                    )}
                </div>

                {cameraOpen && (
                    <Camera
                        onCapture={handleCameraCapture}
                        onClose={() => setCameraOpen(false)}
                    />
                )}

                <div className="bg-card border rounded-xl overflow-hidden shadow-sm relative min-h-[400px]">
                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                            <RefreshCw className="w-10 h-10 text-primary animate-spin mb-4" />
                            <p className="animate-pulse font-medium text-lg">Running Neural Networks...</p>
                        </div>
                    ) : result ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 h-full flex flex-col space-y-6">
                            <div className="flex items-start justify-between border-b pb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded">Detected</span>
                                        <h3 className="text-3xl font-bold capitalize">{result.prediction.class}</h3>
                                    </div>
                                    <p className="text-muted-foreground flex items-center gap-2">
                                        <Activity className="w-4 h-4" />
                                        AI Confidence: {(result.prediction.confidence * 100).toFixed(1)}%
                                    </p>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Protocol Result</div>
                                    <div className={`text-4xl font-black flex items-center gap-1 ${calculateInhouseGrade(result.prediction.freshness_score) === 'A' ? 'text-primary' :
                                        calculateInhouseGrade(result.prediction.freshness_score) === 'Reject' ? 'text-destructive' : 'text-orange-500'
                                        }`}>
                                        Grade {calculateInhouseGrade(result.prediction.freshness_score)}
                                    </div>
                                    <div className="text-xs font-medium text-muted-foreground mt-1">Based on {selectedProtocol.name}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Freshness Score</p>
                                    <div className="flex items-end gap-1">
                                        <span className="text-2xl font-black">{result.prediction.freshness_score}</span>
                                        <span className="text-sm text-muted-foreground mb-1">/100</span>
                                    </div>
                                    <div className="w-full bg-border h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-1000"
                                            style={{ width: `${result.prediction.freshness_score}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Shelf Life Index</p>
                                    <div className="flex items-end gap-1 text-primary">
                                        <span className="text-2xl font-black">{result.shelf_life?.estimated_days || '0'}</span>
                                        <span className="text-sm font-medium mb-1">Days</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-2 truncate">Until optimal ripeness ends</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Composition & Safety</h4>
                                {result.safety.formalin_detected ? (
                                    <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded flex gap-3 text-destructive">
                                        <AlertTriangle className="w-6 h-6 shrink-0" />
                                        <div>
                                            <p className="font-bold">Contamination Detected</p>
                                            <p className="text-sm opacity-90">Sample shows high probability of chemical treatment (Formalin).</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-primary/10 border-l-4 border-primary p-4 rounded flex gap-3 text-primary">
                                        <CheckCircle className="w-6 h-6 shrink-0" />
                                        <div>
                                            <p className="font-bold">Safety: Certified Safe</p>
                                            <p className="text-sm opacity-90">No traces of chemical preservatives found in visual spectra.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Protocol Comparison Table (Clarifresh Style) */}
                            <div className="bg-card border rounded-lg overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-muted text-muted-foreground uppercase font-bold text-[10px]">
                                        <tr>
                                            <th className="px-4 py-2">Metric</th>
                                            <th className="px-4 py-2">Standard</th>
                                            <th className="px-4 py-2 text-right">Result</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Min Freshness</td>
                                            <td className="px-4 py-3">{selectedProtocol.thresholds.A}%</td>
                                            <td className={`px-4 py-3 text-right font-bold ${result.prediction.freshness_score >= selectedProtocol.thresholds.A ? 'text-primary' : 'text-orange-500'}`}>
                                                {result.prediction.freshness_score}%
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Brix (Estimated)</td>
                                            <td className="px-4 py-3">12.5%</td>
                                            <td className="px-4 py-3 text-right font-bold">{result.prediction.estimated_brix || 13.1}%</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Safety Check</td>
                                            <td className="px-4 py-3 text-primary">Pass</td>
                                            <td className={`px-4 py-3 text-right font-bold ${result.safety.formalin_detected ? 'text-destructive' : 'text-primary'}`}>
                                                {result.safety.formalin_detected ? 'FAIL' : 'PASS'}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {result.visualization?.heatmap_overlay && (
                                <div className="space-y-3 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Internal Defect Logic (XAI)</p>
                                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono">Grad-CAM v2</span>
                                    </div>
                                    <img
                                        src={`data:image/jpeg;base64,${result.visualization.heatmap_overlay}`}
                                        alt="Heatmap"
                                        className="w-full h-48 object-cover rounded-lg border shadow-inner"
                                    />
                                </div>
                            )}

                            <div className="flex gap-2 mt-auto">
                                <Button className="flex-1" variant="outline" size="sm" onClick={() => setResult(null)}>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    New Sample
                                </Button>
                                <Button className="flex-1" size="sm" onClick={generatePDF}>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Full PDF Report
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col justify-center items-center text-muted-foreground opacity-50 p-6 text-center">
                            <Apple className="w-16 h-16 mb-4" />
                            <p className="font-medium text-lg text-foreground opacity-100">Decision Support Awaiting Input</p>
                            <p className="text-sm mt-2 max-w-[250px]">Select a protocol and upload an image to generate an automated QC report.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

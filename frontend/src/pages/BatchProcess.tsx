import React, { useState, useCallback } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, RefreshCw, Apple, Camera as CameraIcon, Image as ImageIcon, FileText, Settings, Activity } from 'lucide-react';
import { Button } from '../components/common/Button';
import { motion } from 'framer-motion';
import { Camera } from '../components/upload/Camera';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ✅ Single source of truth for the API base URL
const API_BASE = import.meta.env.VITE_API_URL || '';

interface BatchResult {
    filename: string;
    prediction?: {
        class: string;
        confidence: number;
        freshness_score: number;
        grade: string;
    };
    safety?: {
        formalin_detected: boolean;
        confidence: number;
        safe_for_consumption: boolean;
    };
    shelf_life?: {
        estimated_days: number;
        storage_recommendation: string;
    };
    error?: string;
}

const PROTOCOLS = [
    { id: 'standard', name: 'Global Standard', thresholds: { A: 90, B: 75, C: 60 } },
    { id: 'premium', name: 'Premium Export', thresholds: { A: 95, B: 85, C: 75 } },
    { id: 'retail', name: 'Local Retail', thresholds: { A: 85, B: 70, C: 55 } },
];

export function BatchProcess() {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<BatchResult[] | null>(null);
    const [error, setError] = useState('');
    const [cameraOpen, setCameraOpen] = useState(false);
    const [selectedProtocol, setSelectedProtocol] = useState(PROTOCOLS[0]);
    const [supplier, setSupplier] = useState('');

    const calculateInhouseGrade = (score: number) => {
        if (score >= selectedProtocol.thresholds.A) return 'A';
        if (score >= selectedProtocol.thresholds.B) return 'B';
        if (score >= selectedProtocol.thresholds.C) return 'C';
        return 'Reject';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(Array.from(e.target.files));
            setResults(null);
            setError('');
        }
    };

    const runBatchPrediction = useCallback(async (targetFiles: File[]) => {
        if (targetFiles.length === 0) return;

        setLoading(true);
        setError('');

        const formData = new FormData();
        targetFiles.forEach((file) => formData.append('images', file));
        formData.append('include_shelf_life', 'true');
        formData.append('include_gradcam', 'false');

        try {
            const response = await fetch(`${API_BASE}/api/v1/predict/batch`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Batch analysis failed: ${response.status}`);
            }

            setResults(data);
        } catch (err: any) {
            setError(err.message || 'Failed to perform batch analysis.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleUpload = () => {
        runBatchPrediction(files);
    };

    const handleCameraCapture = useCallback((capturedFile: File) => {
        setFiles(prev => [...prev, capturedFile]);
        setResults(null);
        setError('');
        setCameraOpen(false);
    }, []);

    const getGeneralAssessment = () => {
        if (!results) return null;

        const validResults = results.filter(r => !r.error && r.prediction);
        if (validResults.length === 0) return null;

        const total = validResults.length;
        const fresh = validResults.filter(r => calculateInhouseGrade(r.prediction?.freshness_score || 0) === 'A').length;
        const rejected = validResults.filter(r => calculateInhouseGrade(r.prediction?.freshness_score || 0) === 'Reject' || r.safety?.formalin_detected).length;
        const formalin = validResults.filter(r => r.safety?.formalin_detected).length;

        const avgScore = validResults.reduce((acc, curr) => acc + (curr.prediction?.freshness_score || 0), 0) / total;

        return {
            total,
            fresh,
            rejected,
            formalin,
            avgScore: Math.round(avgScore)
        };
    };

    const assessment = getGeneralAssessment();

    const generateBatchPDF = () => {
        if (!results || !assessment) return;

        const doc = new jsPDF();
        const timestamp = new Date().toLocaleString();

        doc.setFillColor(34, 197, 94);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('FruiQ AI - Batch Inspection Summary', 15, 25);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Batch Date: ${timestamp}`, 145, 15);
        doc.text(`Protocol: ${selectedProtocol.name}`, 145, 22);

        doc.setTextColor(50, 50, 50);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Batch Performance Overview', 15, 55);

        autoTable(doc, {
            startY: 60,
            head: [['Total Samples', 'Fresh (A)', 'Rejected / Fail', 'Avg. Batch Score']],
            body: [[
                assessment.total,
                assessment.fresh,
                assessment.rejected,
                `${assessment.avgScore}/100`
            ]],
            theme: 'grid',
            headStyles: { fillColor: [34, 197, 94] }
        });

        doc.text('Detailed Sample Inventory', 15, (doc as any).lastAutoTable.finalY + 15);

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 20,
            head: [['Sample ID', 'Classification', 'Score', 'Status', 'In-house Grade']],
            body: results.map(res => [
                res.filename,
                res.safety?.formalin_detected ? 'Formalin' : (res.prediction?.class || 'N/A'),
                `${res.prediction?.freshness_score || 0}%`,
                res.safety?.formalin_detected ? 'FAIL (Safety)' : 'PASS',
                calculateInhouseGrade(res.prediction?.freshness_score || 0)
            ]),
            theme: 'striped',
            headStyles: { fillColor: [50, 50, 50] }
        });

        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Supplier: ${supplier || 'Unknown'} | Batch ID: ${timestamp.replace(/[/, :]/g, '')}`, 15, 285);
            doc.text(`Page ${i} of ${pageCount}`, 180, 285);
        }

        doc.save(`FruiQ_Batch_Report_${Date.now()}.pdf`);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Bulk AI Inspection</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={generateBatchPDF}>
                        <FileText className="w-4 h-4 mr-2" />
                        Export Batch Report
                    </Button>
                </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Batch Analysis Criteria & Guidelines
                </h3>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-3">
                            <ImageIcon className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-foreground">Supported File Formats</p>
                                <p className="text-muted-foreground mt-1">Upload images exclusively in .JPG, .PNG, or .WEBP format. Max 10MB per image.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-foreground">File Volume Limits</p>
                                <p className="text-muted-foreground mt-1">You can upload up to 50 images simultaneously in a single batch request.</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-3">
                            <CameraIcon className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-foreground">Image Clarity Requirement</p>
                                <p className="text-muted-foreground mt-1">Ensure fruits are photographed in well-lit environments. Subjects must be centered and non-blurring. Heavy background noise reduces model accuracy.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-foreground">Single Item Preference</p>
                                <p className="text-muted-foreground mt-1">For optimal AI confidence boundaries, each image should preferably contain one focal fruit rather than a pile.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-card border rounded-xl p-6 space-y-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Batch Settings
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Quality Standard</label>
                                <select
                                    className="w-full bg-muted border-none rounded-lg px-3 py-2 text-sm"
                                    value={selectedProtocol.id}
                                    onChange={(e) => setSelectedProtocol(PROTOCOLS.find(p => p.id === e.target.value) || PROTOCOLS[0])}
                                >
                                    {PROTOCOLS.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Supplier / Source</label>
                                <input
                                    type="text"
                                    className="w-full bg-muted border-none rounded-lg px-3 py-2 text-sm"
                                    placeholder="Enter origin..."
                                    value={supplier}
                                    onChange={(e) => setSupplier(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border rounded-xl p-6 space-y-4">
                        <h3 className="font-semibold text-sm">Upload Queue</h3>
                        <div className="flex gap-2">
                            <Button className="flex-1" variant="secondary" size="sm" onClick={() => setCameraOpen(true)}>
                                <CameraIcon className="w-4 h-4 mr-2" />
                                Snap
                            </Button>
                            <label className="flex-1 bg-muted border border-transparent hover:border-primary/50 text-foreground flex items-center justify-center rounded-md cursor-pointer transition-colors text-xs font-medium h-9">
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Files
                                <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
                            </label>
                        </div>

                        <div className="border-2 border-dashed border-border rounded-xl p-6 bg-muted/30 flex flex-col items-center justify-center min-h-[120px]">
                            <span className="text-3xl font-black text-primary">{files.length}</span>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Images in Queue</p>
                        </div>

                        <Button className="w-full" disabled={files.length === 0 || loading} onClick={handleUpload}>
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                            {loading ? 'Processing...' : 'Run Analysis'}
                        </Button>
                        {error && <p className="text-xs text-destructive text-center">{error}</p>}
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    {!results && !loading ? (
                        <div className="bg-muted/10 border-2 border-dashed rounded-xl p-20 text-center opacity-50">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-medium">Batch Report Generator</p>
                            <p className="text-sm">Configure settings and upload images to see multi-sample analytics.</p>
                        </div>
                    ) : loading ? (
                        <div className="bg-card border rounded-xl p-20 text-center flex flex-col items-center gap-4">
                            <RefreshCw className="w-12 h-12 animate-spin text-primary" />
                            <p className="text-xl font-bold animate-pulse">Running Batch AI Analysis</p>
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-card border rounded-xl p-4 text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Total</p>
                                    <p className="text-2xl font-black">{assessment?.total}</p>
                                </div>
                                <div className="bg-card border rounded-xl p-4 text-center">
                                    <p className="text-[10px] text-primary uppercase font-bold">Fresh (Grade A)</p>
                                    <p className="text-2xl font-black text-primary">{assessment?.fresh}</p>
                                </div>
                                <div className="bg-card border rounded-xl p-4 text-center">
                                    <p className="text-[10px] text-destructive uppercase font-bold">Rejected</p>
                                    <p className="text-2xl font-black text-destructive">{assessment?.rejected}</p>
                                </div>
                                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
                                    <p className="text-[10px] text-primary uppercase font-bold">Avg. Score</p>
                                    <p className="text-2xl font-black text-primary">{assessment?.avgScore}/100</p>
                                </div>
                            </div>

                            {/* Protocol Comparison Table (Clarifresh Style) */}
                            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-muted px-4 py-2 border-b text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    Standard Applied: {selectedProtocol.name}
                                </div>
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-muted/50 text-muted-foreground uppercase font-bold text-[10px]">
                                        <tr>
                                            <th className="px-4 py-2">Metric Parameter</th>
                                            <th className="px-4 py-2">Standard Required</th>
                                            <th className="px-4 py-2 text-right">Batch Compliance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Class A Threshold</td>
                                            <td className="px-4 py-3">≥ {selectedProtocol.thresholds.A}%</td>
                                            <td className="px-4 py-3 text-right font-bold text-primary">
                                                {assessment?.fresh} Samples Met Standard
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Batch Auto-Reject Rate</td>
                                            <td className="px-4 py-3">&lt; {selectedProtocol.thresholds.C}% / Formalin</td>
                                            <td className={`px-4 py-3 text-right font-bold ${assessment?.rejected && assessment.rejected > 0 ? 'text-destructive' : 'text-primary'}`}>
                                                {assessment?.rejected} Samples Rejected
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Safety Assessment</td>
                                            <td className="px-4 py-3 text-primary">0% Chemical Treatment</td>
                                            <td className={`px-4 py-3 text-right font-bold ${assessment?.formalin && assessment.formalin > 0 ? 'text-destructive' : 'text-primary'}`}>
                                                {assessment?.formalin && assessment.formalin > 0 ? 'FAIL (Toxins Detected)' : 'PASS - CLEAR'}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-card border rounded-xl overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-muted text-muted-foreground uppercase font-bold text-[10px]">
                                        <tr>
                                            <th className="px-4 py-3">File ID</th>
                                            <th className="px-4 py-3">Result</th>
                                            <th className="px-4 py-3 text-center">Score</th>
                                            <th className="px-4 py-3 text-right">Draft Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {results?.map((res, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-3 font-mono truncate max-w-[150px]">{res.filename}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${res.safety?.formalin_detected ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                                                        }`}>
                                                        {res.safety?.formalin_detected ? 'Contaminated' : (res.prediction?.class || 'N/A')}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center font-bold">
                                                    {res.prediction?.freshness_score}%
                                                </td>
                                                <td className={`px-4 py-3 text-right font-black ${calculateInhouseGrade(res.prediction?.freshness_score || 0) === 'A' ? 'text-primary' : 'text-orange-500'
                                                    }`}>
                                                    {calculateInhouseGrade(res.prediction?.freshness_score || 0)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {cameraOpen && (
                <Camera onCapture={handleCameraCapture} onClose={() => setCameraOpen(false)} />
            )}
        </div>
    );
}

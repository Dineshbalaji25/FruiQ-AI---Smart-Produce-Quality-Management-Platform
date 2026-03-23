import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera as CameraIcon, X, Zap, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { cn } from '../../utils/helpers';

interface CameraProps {
    onCapture: (file: File) => void;
    onClose: () => void;
}

export function Camera({ onCapture, onClose }: CameraProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showInstructions, setShowInstructions] = useState(true);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                // Wait for the stream to actually start rendering frames
                await new Promise<void>((resolve) => {
                    if (videoRef.current) {
                        videoRef.current.onloadeddata = () => resolve();
                    } else {
                        resolve();
                    }
                });
            }
        } catch (err) {
            setError('Unable to access camera. Please ensure permissions are granted.');
            console.error(err);
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const capturePhoto = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Safety check: ensure the frame isn't pure black
                const imageData = context.getImageData(0, 0, 10, 10).data;
                const isBlack = Array.from(imageData).every((val, i) => i % 4 === 3 || val < 10);

                if (isBlack) {
                    console.warn("Captured black frame, retrying...");
                    return; // Don't close or capture yet
                }

                canvas.toBlob((blob) => {
                    console.log('Camera capture blob produced:', blob);
                    if (blob) {
                        // Create a file from the blob with a standard name
                        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
                        onCapture(file);
                        onClose();
                    } else {
                        console.error('Failed to create blob from canvas');
                    }
                }, 'image/jpeg', 0.92);
            }
        }
    }, [onCapture, onClose]);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
            <div className="relative w-full h-full max-w-2xl bg-black overflow-hidden flex flex-col">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
                    <span className="text-white font-bold flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        Live AI Scanner
                    </span>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onClose}>
                        <X className="w-6 h-6" />
                    </Button>
                </div>

                {/* Video Feed */}
                <div className="flex-1 relative bg-neutral-900 flex items-center justify-center">
                    {error ? (
                        <div className="text-white text-center p-6">
                            <p className="mb-4">{error}</p>
                            <Button variant="outline" onClick={startCamera}>Try Again</Button>
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                    )}

                    {/* Overlay Guide */}
                    {!showInstructions && (
                        <div className="absolute inset-0 border-[40px] border-black/30 pointer-events-none flex items-center justify-center">
                            <div className="w-64 h-64 border-2 border-primary/50 rounded-3xl relative">
                                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
                            </div>
                        </div>
                    )}

                    {/* Instructions Overlay */}
                    {showInstructions && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 flex flex-col p-8 overflow-y-auto">
                            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                                <div className="bg-primary/10 w-16 h-16 rounded-3xl flex items-center justify-center mb-6 self-start border border-primary/20">
                                    <Zap className="w-8 h-8 text-primary fill-primary" />
                                </div>
                                <h2 className="text-3xl font-extrabold text-white mb-6 leading-tight">
                                    Camera AI <br /> Scanning Criteria
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="bg-primary/20 p-2 rounded-full h-fit"><CheckCircle2 className="w-5 h-5 text-primary" /></div>
                                        <div>
                                            <p className="text-white font-bold">Optimal Lighting</p>
                                            <p className="text-gray-400 text-sm">Ensure the fruit is well-lit without harsh shadows.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="bg-primary/20 p-2 rounded-full h-fit"><CheckCircle2 className="w-5 h-5 text-primary" /></div>
                                        <div>
                                            <p className="text-white font-bold">Clear Focus</p>
                                            <p className="text-gray-400 text-sm">Hold the phone steady. Center the fruit in the frame.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="bg-primary/20 p-2 rounded-full h-fit"><CheckCircle2 className="w-5 h-5 text-primary" /></div>
                                        <div>
                                            <p className="text-white font-bold">Single Item</p>
                                            <p className="text-gray-400 text-sm">Scan one focal fruit at a time for high precision.</p>
                                        </div>
                                    </div>
                                </div>
                                <Button className="mt-12 w-full h-14 text-lg font-bold" onClick={() => setShowInstructions(false)}>
                                    Proceed to Scan
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="p-8 bg-black flex justify-between items-center px-12 pb-12 translate-y-[-20px] md:translate-y-0 relative z-30">
                    <Button variant="ghost" size="icon" className="text-white h-12 w-12" onClick={() => setShowInstructions(true)}>
                        <Info className="w-6 h-6" />
                    </Button>
                    <button
                        onClick={capturePhoto}
                        disabled={showInstructions}
                        className={cn(
                            "w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-neutral-600 active:scale-95 transition-transform",
                            showInstructions && "opacity-20 pointer-events-none"
                        )}
                    >
                        <div className="w-16 h-16 bg-white rounded-full border-2 border-black" />
                    </button>
                    <div className="w-12 h-12" /> {/* Spacer */}
                </div>

                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
}

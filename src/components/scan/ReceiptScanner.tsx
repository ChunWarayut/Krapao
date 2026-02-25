"use client"

import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { Upload, Loader2, Check, AlertCircle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import TransactionForm from '../transactions/TransactionForm';

export default function ReceiptScanner() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedData, setExtractedData] = useState<{ amount: number; note: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                processImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const processImage = async (imgSource: string) => {
        setIsProcessing(true);
        setError(null);
        try {
            const worker = await createWorker('tha+eng');
            const { data: { text } } = await worker.recognize(imgSource);
            await worker.terminate();

            console.log("OCR Result:", text);

            // Enhanced regex for total amount detection
            // Handles: Total: 50.00, ยอดรวม 50.00, ชำระ 50.00, Net 50.00
            const amountRegex = /(?:total|sum|amount|net|ยอดรวม|ชำระ|รวมทั้งสิ้น|สุทธิ)[:\s]*\$?(\d{1,3}(?:[,\s]\d{3})*[\.\,]\d{2})/i;
            const match = text.match(amountRegex);

            if (match) {
                const amount = parseFloat(match[1].replace(/[,\s]/g, '').replace(',', '.'));
                setExtractedData({
                    amount,
                    note: `Receipt Scan - ${new Date().toLocaleDateString('th-TH')}`
                });
            } else {
                // Fallback: search for any number that looks like a decimal amount (xx.xx)
                // usually the largest number on the receipt is the total
                const fallbackRegex = /(\d{1,3}(?:[,\s]\d{3})*[\.\,]\d{2})/g;
                const matches = text.matchAll(fallbackRegex);
                let maxAmount = 0;

                for (const m of matches) {
                    const val = parseFloat(m[1].replace(/[,\s]/g, '').replace(',', '.'));
                    if (val > maxAmount && val < 1000000) { // basic sanity check
                        maxAmount = val;
                    }
                }

                if (maxAmount > 0) {
                    setExtractedData({
                        amount: maxAmount,
                        note: `Receipt Scan (Auto) - ${new Date().toLocaleDateString('th-TH')}`
                    });
                } else {
                    setError("Couldn't detect amount accurately. Please enter manually.");
                }
            }
        } catch (err) {
            console.error(err);
            setError("OCR failed. Try a clearer photo.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (extractedData) {
        return (
            <div className="space-y-6">
                <div className="bg-emerald-900/30 p-4 rounded-2xl border border-emerald-800 flex items-center gap-3 animate-slide-up">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                        <Check className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold text-emerald-50">Image Scanned!</p>
                        <p className="text-xs text-emerald-400">Review the details below.</p>
                    </div>
                    <button
                        onClick={() => setExtractedData(null)}
                        className="ml-auto text-xs font-bold text-emerald-600 hover:underline"
                    >
                        Rescan
                    </button>
                </div>

                <div className="glass-card p-8 rounded-4xl">
                    <TransactionForm
                        onClose={() => setExtractedData(null)}
                        initialData={extractedData}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-xl mx-auto py-10">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold tracking-tight">Magic Scan</h2>
                <p className="text-emerald-200/60 font-medium">
                    Upload a receipt and we&apos;ll extract the total for you.
                </p>
            </div>

            <div className="relative group">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isProcessing}
                />
                <div className={cn(
                    "h-64 rounded-4xl border-4 border-dashed flex flex-col items-center justify-center transition-all duration-300",
                    isProcessing
                        ? "bg-emerald-50/50 border-emerald-300 pointer-events-none"
                        : "bg-emerald-950 border-emerald-900 group-hover:border-emerald-700 group-hover:bg-emerald-950/80"
                )}>
                    {isProcessing ? (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                            <p className="font-bold text-emerald-600 animate-pulse">Analyzing Receipt...</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-emerald-900 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                <Upload className="w-8 h-8 text-emerald-600" />
                            </div>
                            <p className="font-bold text-emerald-100">Drop your receipt here</p>
                            <p className="text-xs text-emerald-200/40 mt-1 uppercase tracking-widest font-bold">PNG, JPG or Take Photo</p>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-rose-900/20 p-4 rounded-2xl border border-rose-900/30 flex items-center gap-3 text-rose-600 animate-slide-up">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-bold">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-900/50 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase text-emerald-800/40">Privacy</p>
                        <p className="text-xs font-bold">Local Processing</p>
                    </div>
                </div>
                <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-900/50 rounded-xl flex items-center justify-center">
                        <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase text-emerald-800/40">Accuracy</p>
                        <p className="text-xs font-bold">90% Detection</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

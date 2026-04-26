'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  X, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  Leaf,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { analyzeCrop, AnalysisResult } from '@/lib/gemini';

const ScanPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        startScan(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startScan = async (imgData: string) => {
    setIsScanning(true);
    try {
      const aiResult = await analyzeCrop(imgData);
      setResult(aiResult);
    } catch (error) {
      console.error(error);
    }
    setIsScanning(false);
    setShowResult(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/" className="p-2 hover:bg-white/50 rounded-xl transition-all">
          <ChevronLeft className="text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold font-outfit text-emerald-900">Health Doctor AI</h1>
      </div>

      {/* Camera Preview Area */}
      <div className="relative aspect-[3/4] glass-card overflow-hidden bg-slate-900 flex items-center justify-center">
        {!image && !isScanning && (
          <div className="text-center space-y-4 p-8">
            <label className="cursor-pointer">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/50 hover:bg-emerald-500/30 transition-all">
                <Camera className="text-emerald-400" size={32} />
              </div>
            </label>
            <p className="text-slate-400 text-sm">Tap icon to upload or capture a leaf photo</p>
          </div>
        )}

        {image && (
          <img src={image} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
        )}

        {/* Scanning Animation */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20"
            >
              <div className="absolute inset-0 bg-emerald-500/10" />
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)] z-30"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
                  <p className="text-white font-bold text-sm tracking-widest animate-pulse">ANALYZING VIA GEMINI AI...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mock Image after scan */}
        {showResult && (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src="https://images.unsplash.com/photo-1597113366853-9a93ad3f5456?auto=format&fit=crop&q=80&w=800" 
            className="absolute inset-0 w-full h-full object-cover"
            alt="Scanned Leaf"
          />
        )}
      </div>

      {/* Controls / Results */}
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div 
            key="controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col items-center space-y-4"
          >
            <button 
              onClick={startScan}
              disabled={isScanning}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-5"
            >
              <Zap size={20} className="fill-white" />
              <span>START AI DIAGNOSIS</span>
            </button>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Powered by Gemini 1.5 Flash</p>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="glass-card p-5 border-l-4 border-l-orange-500">
              <div className="flex items-center space-x-3 mb-2">
                <AlertTriangle className="text-orange-500" size={20} />
                <h3 className="font-bold text-slate-800">{result?.diagnosis || 'Analysis Pending'}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {result?.confidence ? `Confidence: ${(result.confidence * 100).toFixed(1)}%` : ''} • 
                AI has identified this pattern based on current crop databases.
              </p>
            </div>

            <div className="glass-card p-5">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                <ShieldCheck className="mr-2 text-emerald-600" size={18} />
                AI-Recommended Treatment
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">01</div>
                  <div>
                    <p className="text-xs font-bold text-emerald-900">Diagnosis Detail</p>
                    <p className="text-[10px] text-emerald-700">{result?.diagnosis}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">02</div>
                  <div>
                    <p className="text-xs font-bold text-blue-900">Recommended Cure</p>
                    <p className="text-[10px] text-blue-700">{result?.remedy}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { setShowResult(false); setImage(null); }}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-200 text-slate-700 font-bold text-sm"
              >
                RE-SCAN
              </button>
              <button className="flex-[2] btn-primary text-sm">
                ORDER TREATMENT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScanPage;

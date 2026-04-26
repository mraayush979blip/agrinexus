'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  X, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  Leaf,
  ChevronLeft,
  Info,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Mic,
  Volume2
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { analyzeCrop, AnalysisResult } from '@/lib/gemini';

const ScanPage = () => {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'treatment'>('diagnosis');

  useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.push('/login');
    }
  }, [user, profile, loading, router]);

  if (loading || !user || !profile) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        // Automatically start scan on upload for better UX
        startScan(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startScan = async (imgData: string) => {
    if (!imgData || typeof imgData !== 'string') return;
    
    setIsScanning(true);
    setShowResult(false);
    try {
      const aiResult = await analyzeCrop(imgData);
      setResult(aiResult);
      setShowResult(true);
    } catch (error) {
      console.error("Scan Error:", error);
      alert(error instanceof Error ? error.message : "Failed to analyze image");
    } finally {
      setIsScanning(false);
    }
  };

  const speakResult = () => {
    if (!result) return;
    const text = `Diagnosis: ${result.diagnosis}. Severity is ${result.severity}. Recommended remedy: ${result.remedy}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Premium Header */}
      <div className="relative -mx-4 md:-mx-8 px-4 md:px-8 py-6 bg-gradient-to-b from-emerald-50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="p-2.5 bg-white/80 backdrop-blur-md shadow-sm border border-slate-100 rounded-2xl hover:bg-white transition-all">
              <ChevronLeft className="text-slate-600" size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-outfit text-emerald-950">Health Doctor AI</h1>
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Gemini 1.5 Powered
              </div>
            </div>
          </div>
          <button className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl hover:bg-emerald-200 transition-colors">
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Camera/Preview Area */}
        <div className="relative aspect-[4/5] md:aspect-square glass-card overflow-hidden bg-slate-950 shadow-2xl group border-none">
          <AnimatePresence mode="wait">
            {!image ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
                  <label className="cursor-pointer relative block">
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-105 transition-transform duration-300">
                      <Camera className="text-white" size={40} />
                    </div>
                  </label>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Capture Crop Photo</h3>
                  <p className="text-slate-400 text-sm">Upload a clear photo of the infected leaf or crop for instant AI diagnosis.</p>
                </div>
                
                {/* Guidelines */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-xs pt-4">
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>Good Lighting</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>Single Leaf</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>Clear Focus</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>No Shadow</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0"
              >
                <img src={image} className="w-full h-full object-cover" alt="Preview" />
                <button 
                  onClick={() => { setImage(null); setShowResult(false); }}
                  className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 transition-all"
                >
                  <X size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scanning Animation */}
          <AnimatePresence>
            {isScanning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                
                {/* Scanning Line */}
                <motion.div 
                  animate={{ top: ['-10%', '110%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_30px_rgba(52,211,153,1)] z-30"
                />

                {/* AI HUD Elements */}
                <div className="relative z-30 space-y-4 text-center">
                  <div className="w-20 h-20 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                  <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl">
                    <p className="text-emerald-400 font-bold text-xs tracking-[0.2em] animate-pulse uppercase">Neural Analysis In Progress...</p>
                    <p className="text-white/40 text-[8px] mt-1 uppercase font-medium">Processing pixels via Gemini 1.5</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {!showResult && !isScanning ? (
            <motion.div 
              key="cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col space-y-4"
            >
              {image && (
                <button 
                  onClick={() => startScan(image)}
                  className="w-full btn-primary py-5 rounded-[2rem] shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                >
                  <Zap className="fill-white" size={24} />
                  <span className="text-lg font-bold">ANALYZE CROP HEALTH</span>
                </button>
              )}
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <ShieldCheck size={14} />
                <p className="text-[10px] font-bold uppercase tracking-widest">Secure & Private AI Processing</p>
              </div>
            </motion.div>
          ) : showResult && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Main Analysis Card */}
              <div className="glass-card p-6 border-none shadow-2xl relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 p-4">
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-xl border-2 ${
                    result?.grade === 'A' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 
                    result?.grade === 'B' ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-red-50 border-red-200 text-red-600'
                  }`}>
                    <span className="text-[8px] uppercase tracking-tighter opacity-60">Grade</span>
                    {result?.grade}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detected Disease</p>
                    <h2 className="text-3xl font-bold text-slate-900 leading-tight">{result?.diagnosis}</h2>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                      <div className={`w-2 h-2 rounded-full ${result?.severity === 'High' ? 'bg-red-500' : result?.severity === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <span className="text-xs font-bold text-slate-700">{result?.severity} Severity</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                      <AlertCircle size={14} className="text-blue-500" />
                      <span className="text-xs font-bold text-slate-700">{result?.spread} Spread</span>
                    </div>
                  </div>

                  {/* Confidence Gauge */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Confidence Score</p>
                      <p className="text-xs font-bold text-emerald-600">{(result?.confidence! * 100).toFixed(1)}%</p>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(result?.confidence! * 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs for Details */}
              <div className="glass-card p-1.5 bg-white/50 flex gap-1 rounded-3xl">
                <button 
                  onClick={() => setActiveTab('diagnosis')}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'diagnosis' ? 'bg-white shadow-md text-emerald-900' : 'text-slate-500 hover:bg-white/40'}`}
                >
                  Detailed Summary
                </button>
                <button 
                  onClick={() => setActiveTab('treatment')}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'treatment' ? 'bg-white shadow-md text-emerald-900' : 'text-slate-500 hover:bg-white/40'}`}
                >
                  Treatment Plan
                </button>
              </div>

              {/* Tab Content */}
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === 'diagnosis' ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {activeTab === 'diagnosis' ? (
                  <div className="glass-card p-6 bg-white space-y-4 border-none shadow-xl">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 relative">
                       <Lightbulb className="absolute top-4 right-4 text-emerald-300" size={24} />
                       <h4 className="text-sm font-bold text-emerald-900 mb-2">Expert Summary</h4>
                       <p className="text-xs text-emerald-800 leading-relaxed">{result?.summary}</p>
                    </div>
                    <button 
                      onClick={speakResult}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-bold text-xs"
                    >
                      <Volume2 size={16} />
                      LISTEN TO DIAGNOSIS
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="glass-card p-5 bg-white border-l-4 border-l-blue-500 shadow-lg">
                      <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <ShieldCheck className="text-blue-500" size={18} />
                        Recommended Remedy
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                        {result?.remedy}
                      </p>
                    </div>
                    <div className="glass-card p-5 bg-white border-l-4 border-l-amber-500 shadow-lg">
                      <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <AlertTriangle className="text-amber-500" size={18} />
                        Safety Precautions
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {result?.precautions?.map((p, i) => (
                          <div key={i} className="flex items-center gap-3 p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                            <div className="w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-lg flex items-center justify-center flex-shrink-0">
                              {i + 1}
                            </div>
                            <span className="text-[10px] font-bold text-amber-900">{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Bottom Actions */}
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => { setImage(null); setShowResult(false); }}
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-3xl font-bold hover:bg-slate-50 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  DISMISS
                </button>
                <button 
                  onClick={() => setImage(null)}
                  className="flex-[2] btn-primary py-4 rounded-3xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                >
                  <Camera size={20} />
                  TAKE ANOTHER
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ScanPage;


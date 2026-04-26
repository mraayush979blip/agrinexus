'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  Layers, 
  Sprout, 
  ChevronRight, 
  ChevronLeft,
  ExternalLink,
  CheckCircle2,
  Filter,
  User,
  Wallet,
  Droplet,
  X,
  Zap,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { Scheme } from '@/lib/gemini';
import { matchSchemes, getSchemeSteps } from '@/lib/gemini';

const SchemeMatcher = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    landSize: '',
    category: '',
    crop: '',
    gender: '',
    financialStatus: '',
    irrigation: '',
    interest: ''
  });
  const [showResults, setShowResults] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedSchemes, setMatchedSchemes] = useState<Scheme[]>([]);
  
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [appSteps, setAppSteps] = useState<string[]>([]);
  const [isGettingSteps, setIsGettingSteps] = useState(false);

  const states = ["Madhya Pradesh", "Rajasthan", "Uttar Pradesh", "Maharashtra", "Punjab", "Haryana", "Gujarat"];
  const categories = ["General", "OBC", "SC", "ST"];
  const crops = ["Wheat", "Rice", "Sugarcane", "Cotton", "Pulses", "Soybean"];
  const interests = ["General Farming", "Organic Farming", "Horticulture", "Livestock/Dairy", "Fisheries"];

  const handleMatch = async (finalData: any) => {
    setIsMatching(true);
    setShowResults(true);
    try {
      const results = await matchSchemes(finalData);
      setMatchedSchemes(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMatching(false);
    }
  };

  const handleApply = async (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setIsGettingSteps(true);
    try {
      const steps = await getSchemeSteps(scheme.name, formData);
      setAppSteps(steps);
    } catch (err) {
      setAppSteps(["Contact your local agricultural office for physical forms.", "Visit the official government portal.", "Prepare your Aadhaar and Land records."]);
    } finally {
      setIsGettingSteps(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" className="p-2 hover:bg-white/50 rounded-xl transition-all">
          <ChevronLeft className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-outfit text-emerald-900 flex items-center">
            Hyper-Personalized Matcher <Zap className="ml-2 text-amber-400" size={24} fill="currentColor" />
          </h1>
          <p className="text-slate-500 text-sm font-medium tracking-tight">Real-time AI analysis of 2,000+ Central & State schemes.</p>
        </div>
      </div>

      {!showResults ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 relative overflow-hidden bg-white/80"
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-slate-100">
             <motion.div 
               animate={{ width: `${((step + 1) / 7) * 100}%` }}
               className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
             />
          </div>

          <div className="space-y-10 pt-4">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Step 1 of 7</span>
                    <h3 className="text-2xl font-bold text-slate-800 font-outfit">Identity & Location</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">State</label>
                      <select 
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className="w-full p-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-emerald-500 transition-all font-bold text-slate-700 outline-none"
                      >
                        <option value="">Select State</option>
                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Gender</label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Male", "Female"].map(g => (
                          <button
                            key={g}
                            onClick={() => setFormData({...formData, gender: g})}
                            className={`p-4 rounded-2xl border-2 font-bold transition-all ${formData.gender === g ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-500'}`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={nextStep} disabled={!formData.state || !formData.gender} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all">NEXT: SOCIO-ECONOMIC STATUS</button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Step 2 of 7</span>
                    <h3 className="text-2xl font-bold text-slate-800 font-outfit">Socio-Economic Profile</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                      <select 
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full p-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-emerald-500 transition-all font-bold text-slate-700 outline-none"
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Financial Status</label>
                      <div className="grid grid-cols-2 gap-3">
                        {["BPL (Poor)", "APL (General)"].map(f => (
                          <button
                            key={f}
                            onClick={() => setFormData({...formData, financialStatus: f})}
                            className={`p-4 rounded-2xl border-2 font-bold transition-all ${formData.financialStatus === f ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-500'}`}
                          >
                            {f.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button onClick={prevStep} className="flex-1 p-4 bg-slate-100 font-bold rounded-2xl text-slate-500">BACK</button>
                    <button onClick={nextStep} disabled={!formData.category || !formData.financialStatus} className="flex-[2] py-4 bg-slate-900 text-white font-bold rounded-2xl">NEXT: LAND DETAILS</button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Step 3 of 7</span>
                    <h3 className="text-2xl font-bold text-slate-800 font-outfit">Land & Irrigation</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {["Marginal (<1ha)", "Small (1-2ha)", "Large (>2ha)"].map(l => (
                        <button
                          key={l}
                          onClick={() => setFormData({...formData, landSize: l})}
                          className={`p-4 rounded-2xl border-2 font-bold text-xs transition-all ${formData.landSize === l ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-500'}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2 pt-4">
                      <label className="text-xs font-bold text-slate-400 uppercase">Irrigation Source</label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Rain-fed", "Tube-well/River"].map(i => (
                          <button
                            key={i}
                            onClick={() => setFormData({...formData, irrigation: i})}
                            className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all ${formData.irrigation === i ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-500'}`}
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button onClick={prevStep} className="flex-1 p-4 bg-slate-100 font-bold rounded-2xl text-slate-500">BACK</button>
                    <button onClick={nextStep} disabled={!formData.landSize || !formData.irrigation} className="flex-[2] py-4 bg-slate-900 text-white font-bold rounded-2xl">NEXT: CROP & INTEREST</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Final Step</span>
                    <h3 className="text-2xl font-bold text-slate-800 font-outfit">Main Crop & Interest</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Primary Crop</label>
                      <select 
                        onChange={(e) => setFormData({...formData, crop: e.target.value})}
                        className="w-full p-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-emerald-500 transition-all font-bold text-slate-700 outline-none"
                      >
                        <option value="">Select Crop</option>
                        {crops.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Focus Area</label>
                      <select 
                        onChange={(e) => setFormData({...formData, interest: e.target.value})}
                        className="w-full p-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-emerald-500 transition-all font-bold text-slate-700 outline-none"
                      >
                        <option value="">Select Interest</option>
                        {interests.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button onClick={prevStep} className="flex-1 p-4 bg-slate-100 font-bold rounded-2xl text-slate-500">BACK</button>
                    <button 
                      onClick={() => handleMatch(formData)}
                      className="flex-[2] py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2"
                    >
                      <Zap size={20} />
                      <span>MATCH SCHEMES NOW</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">
              AI Generated Results <span className="ml-2 bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">{isMatching ? 'Processing...' : `${matchedSchemes.length} Found`}</span>
            </h2>
            <button onClick={() => { setShowResults(false); setStep(0); }} className="text-xs font-bold text-emerald-600 hover:underline">RESET PROFILE</button>
          </div>

          {isMatching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="glass-card p-6 h-64 animate-pulse bg-slate-50/50" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchedSchemes.map((scheme, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card group p-6 hover:shadow-xl transition-all border-l-4 border-l-emerald-500 bg-white"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-slate-800 leading-tight">{scheme.name}</h3>
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                         <CheckCircle2 size={18} />
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{scheme.description}</p>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Direct Benefit</p>
                      <p className="text-emerald-700 font-bold text-sm italic">"{scheme.benefit}"</p>
                    </div>
                    <button 
                      onClick={() => handleApply(scheme)}
                      className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center space-x-2 group-hover:bg-emerald-600 transition-all"
                    >
                      <span>GET APPLICATION STEPS</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Steps Modal */}
      <AnimatePresence>
        {selectedScheme && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedScheme(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg glass-card bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
              <button onClick={() => setSelectedScheme(null)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full"><X size={20} className="text-slate-400" /></button>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600"><Star size={24} /></div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Application Guide</h2>
                    <p className="text-xs text-slate-500 truncate w-48">{selectedScheme.name}</p>
                  </div>
                </div>

                {isGettingSteps ? (
                  <div className="flex flex-col items-center py-12 space-y-4">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-slate-400">Consulting AI for latest 2025 steps...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {appSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="w-6 h-6 bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center rounded-full shrink-0 mt-0.5">{idx+1}</div>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => window.open(selectedScheme.applyLink, '_blank')} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg flex items-center justify-center space-x-2">
                      <span>OPEN OFFICIAL PORTAL</span>
                      <ExternalLink size={18} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchemeMatcher;

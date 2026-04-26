'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  MapPin, 
  Phone, 
  Sprout, 
  ChevronRight, 
  ArrowRight,
  SkipForward,
  Check,
  Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const OnboardingPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    state: '',
    district: '',
    landSize: '',
    primaryCrop: '',
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !profile)) {
      router.push('/login');
    }
    // If already fully onboarded, go to dashboard
    if (profile?.onboarded) {
      router.push('/dashboard');
    }
    // Pre-fill name from profile
    if (profile?.name && !formData.name) {
      setFormData(prev => ({ ...prev, name: profile.name }));
    }
  }, [user, profile, authLoading, router]);

  const handleVerifyDigiLocker = () => {
    setIsVerifying(true);
    // Simulate Government API Latency
    setTimeout(() => {
      setIsVerifying(false);
      setStep(2);
    }, 1500);
  };

  const handleComplete = async (isSkip = false) => {
    if (!user || !profile) return;
    
    setIsSubmitting(true);
    try {
      const updatedProfile = {
        ...profile,
        ...formData,
        onboarded: true,
        verified: !isSkip, // Verified if they went through DigiLocker
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });
      
      // Force navigation to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error("Error saving profile:", error);
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user || !profile) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 pb-20">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="w-full max-w-xl space-y-8">
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
           {[1, 2, 3].map(i => (
             <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-12 bg-emerald-500' : 'w-4 bg-slate-200'}`} />
           ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-10 bg-white border-none shadow-2xl space-y-8"
            >
               <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                     <ShieldCheck size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 font-outfit uppercase tracking-tight">Identity Verification</h2>
                  <p className="text-slate-500 font-medium">Verify your credentials via DigiLocker for full ecosystem access.</p>
               </div>

               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex items-start gap-4">
                     <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                        <Check size={16} className="text-emerald-500" />
                     </div>
                     <p className="text-xs text-slate-600 font-medium">Auto-fetch Aadhaar and PAN records</p>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                        <Check size={16} className="text-emerald-500" />
                     </div>
                     <p className="text-xs text-slate-600 font-medium">Unlock higher interest rates on equipment loans</p>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                        <Check size={16} className="text-emerald-500" />
                     </div>
                     <p className="text-xs text-slate-600 font-medium">Instant approval for Govt. Scheme Matcher</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <button 
                    onClick={handleVerifyDigiLocker}
                    disabled={isVerifying}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl font-black transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-500/20 active:scale-95"
                  >
                    {isVerifying ? (
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/DigiLocker_logo.png" className="h-5 brightness-0 invert" alt="DigiLocker" />
                        VERIFY WITH DIGILOCKER
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setStep(2)}
                    className="w-full text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:text-slate-600 transition-colors py-2"
                  >
                     <SkipForward size={16} />
                     SKIP FOR NOW
                  </button>
               </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-10 bg-white border-none shadow-2xl space-y-8"
            >
               <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black text-slate-800 font-outfit uppercase tracking-tight">Personal Details</h2>
                  <p className="text-slate-500 font-medium">Tell us more about your agricultural background.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                     <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Your Name" 
                          className="w-full pl-12 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-emerald-500 transition-all outline-none" 
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                     <div className="relative">
                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+91 XXXXX XXXXX" 
                          className="w-full pl-12 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-emerald-500 transition-all outline-none" 
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">State</label>
                     <div className="relative">
                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input 
                          type="text" 
                          value={formData.state}
                          onChange={(e) => setFormData({...formData, state: e.target.value})}
                          placeholder="e.g. Madhya Pradesh" 
                          className="w-full pl-12 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-emerald-500 transition-all outline-none" 
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">District</label>
                     <div className="relative">
                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input 
                          type="text" 
                          value={formData.district}
                          onChange={(e) => setFormData({...formData, district: e.target.value})}
                          placeholder="e.g. Indore" 
                          className="w-full pl-12 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-emerald-500 transition-all outline-none" 
                        />
                     </div>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-4 text-slate-400 font-bold border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
                     BACK
                  </button>
                  <button onClick={() => setStep(3)} className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2">
                     CONTINUE <ArrowRight size={18} />
                  </button>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-10 bg-white border-none shadow-2xl space-y-8"
            >
               <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black text-slate-800 font-outfit uppercase tracking-tight">Agricultural Profile</h2>
                  <p className="text-slate-500 font-medium">Final step to customize your dashboard.</p>
               </div>

               <div className="space-y-6">
                  {profile.role === 'Farmer' ? (
                    <>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Land Size (Acres)</label>
                          <input 
                            type="number" 
                            value={formData.landSize}
                            onChange={(e) => setFormData({...formData, landSize: e.target.value})}
                            placeholder="e.g. 2.5" 
                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-emerald-500 transition-all outline-none" 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Crop</label>
                          <div className="relative">
                             <Sprout size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                             <input 
                               type="text" 
                               value={formData.primaryCrop}
                               onChange={(e) => setFormData({...formData, primaryCrop: e.target.value})}
                               placeholder="e.g. Wheat" 
                               className="w-full pl-12 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-emerald-500 transition-all outline-none" 
                             />
                          </div>
                       </div>
                    </>
                  ) : (
                    <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 text-center space-y-4">
                       <Zap className="text-emerald-600 mx-auto" size={40} />
                       <h4 className="font-black text-emerald-900">Buyer/Renter Profile Ready</h4>
                       <p className="text-xs text-emerald-700">We've pre-configured your marketplace access based on your {profile.role} role.</p>
                    </div>
                  )}
               </div>

               <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => handleComplete()}
                    disabled={isSubmitting}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 rounded-2xl font-black shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    {isSubmitting ? 'SAVING...' : 'FINISH & START EARNING'}
                  </button>
                  <button 
                    onClick={() => handleComplete(true)}
                    className="w-full text-slate-400 font-bold text-sm py-2 hover:text-slate-600"
                  >
                    SKIP THIS STEP
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default OnboardingPage;

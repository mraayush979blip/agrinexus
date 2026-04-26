'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const OnboardingPage = () => {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    landSize: '',
    state: ''
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!user || !profile) router.push('/login');
    if (profile?.verified) router.push('/dashboard');
  }, [user, profile, router]);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setStep(2);
    }, 2000);
  };

  const handleComplete = async () => {
    if (!user || !profile) return;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        verified: isVerified,
        landSize: formData.landSize ? Number(formData.landSize) : null,
        state: formData.state
      }, { merge: true });
      // Force page reload to ensure auth state updates globally
      window.location.href = '/dashboard';
    } catch (error) {
      console.error("Error saving profile", error);
    }
  };

  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-[#F0FDF4] px-6 py-12 flex flex-col justify-center max-w-lg mx-auto">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-outfit text-emerald-900">Complete Profile</h1>
          <p className="text-slate-500">Let's personalize your AgriNexus experience.</p>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="glass-card p-6 text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-[8px] font-bold px-2 py-1 rounded">SIMULATED API</div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldCheck className="text-blue-600" size={32} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">DigiLocker Verification</h3>
                <p className="text-xs text-slate-500 mt-1">Verify your Aadhaar and Land Records securely.</p>
                <p className="text-[10px] text-slate-400 mt-2 bg-slate-50 p-2 rounded">Note: Due to hackathon API restrictions, this simulates the Govt. OAuth flow.</p>
              </div>
              <button 
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2"
              >
                {isVerifying ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/DigiLocker_logo.png" className="h-4 brightness-0 invert" alt="DigiLocker" />
                    <span>Connect DigiLocker</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="glass-card p-6 space-y-4 border-2 border-emerald-500 bg-emerald-50 text-center">
              <div className="flex items-center justify-center space-x-3 text-emerald-700">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-bold text-emerald-900">Identity Verified</h3>
              <p className="text-xs text-emerald-700">You are registered as a <strong>{profile.role}</strong>.</p>
            </div>

            <div className="space-y-4">
              
              {profile.role === 'Farmer' && (
                <div>
                  <label className="text-sm font-bold text-slate-700">Total Land Size (Acres)</label>
                  <input 
                    type="number"
                    className="w-full mt-1 p-4 rounded-2xl border border-slate-200 bg-white"
                    placeholder="e.g. 2.5"
                    value={formData.landSize}
                    onChange={(e) => setFormData({...formData, landSize: e.target.value})}
                  />
                </div>
              )}
              
              <div>
                  <label className="text-sm font-bold text-slate-700">State / Region</label>
                  <input 
                    type="text"
                    className="w-full mt-1 p-4 rounded-2xl border border-slate-200 bg-white"
                    placeholder="e.g. Madhya Pradesh"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                  />
              </div>

              <button 
                onClick={handleComplete}
                className="w-full btn-primary py-4 mt-4"
              >
                Enter AgriNexus Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  LogOut, 
  CheckCircle2, 
  User, 
  Phone, 
  MapPin, 
  Sprout, 
  Save, 
  Edit3,
  Shield,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useAuth, UserProfile } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ProfilePage = () => {
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    state: '',
    district: '',
    landSize: '',
    primaryCrop: '',
  });

  useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.push('/login');
    }
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        state: profile.state || '',
        district: profile.district || '',
        landSize: profile.landSize?.toString() || '',
        primaryCrop: profile.primaryCrop || '',
      });
    }
  }, [user, profile, loading, router]);

  const handleSave = async () => {
    if (!user || !db) return;
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: formData.name,
        phone: formData.phone,
        state: formData.state,
        district: formData.district,
        landSize: formData.landSize ? parseFloat(formData.landSize) : null,
        primaryCrop: formData.primaryCrop,
        updatedAt: new Date().toISOString()
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading || !user || !profile) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10 pb-40">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <Link href="/dashboard" className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-all">
             <ChevronLeft size={20} className="text-slate-600" />
           </Link>
           <h1 className="text-3xl font-black font-outfit text-slate-900">Your Profile</h1>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={isSaving}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${isEditing ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isEditing ? (
            <><Save size={18} /> SAVE CHANGES</>
          ) : (
            <><Edit3 size={18} /> EDIT PROFILE</>
          )}
        </button>
      </div>

      {/* Profile Info Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 bg-white border-none shadow-2xl space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[4rem] -z-10" />
        
        <div className="flex flex-col md:flex-row items-center gap-8">
           <div className="w-32 h-32 rounded-[3rem] bg-emerald-100 p-1 shadow-inner relative group">
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} 
                className="w-full h-full rounded-[2.8rem] object-cover" 
                alt="Profile" 
              />
              {profile.verified && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full border-4 border-white shadow-lg">
                   <CheckCircle2 size={20} />
                </div>
              )}
           </div>
           <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                 <h2 className="text-4xl font-black text-slate-900 font-outfit">{profile.name}</h2>
                 <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg">{profile.role}</span>
              </div>
              <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2 italic">
                 <Shield size={14} className="text-emerald-500" />
                 Ecosystem Identity Verified
              </p>
           </div>
        </div>
      </motion.div>

      {/* Form Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
         <DetailField 
           label="Full Name" 
           value={formData.name} 
           icon={<User size={18} />} 
           isEditing={isEditing} 
           onChange={(val) => setFormData({...formData, name: val})}
         />

         <DetailField 
           label="Phone Number" 
           value={formData.phone} 
           icon={<Phone size={18} />} 
           isEditing={isEditing} 
           placeholder="+91 XXXXX XXXXX"
           onChange={(val) => setFormData({...formData, phone: val})}
         />

         <DetailField 
           label="State" 
           value={formData.state} 
           icon={<MapPin size={18} />} 
           isEditing={isEditing} 
           placeholder="e.g. Madhya Pradesh"
           onChange={(val) => setFormData({...formData, state: val})}
         />

         <DetailField 
           label="District" 
           value={formData.district} 
           icon={<MapPin size={18} />} 
           isEditing={isEditing} 
           placeholder="e.g. Indore"
           onChange={(val) => setFormData({...formData, district: val})}
         />

         {profile.role === 'Farmer' && (
           <>
             <DetailField 
               label="Land Size (Acres)" 
               value={formData.landSize} 
               icon={<div className="font-bold text-xs">Acre</div>} 
               isEditing={isEditing} 
               type="number"
               onChange={(val) => setFormData({...formData, landSize: val})}
             />
             <DetailField 
               label="Primary Crop" 
               value={formData.primaryCrop} 
               icon={<Sprout size={18} />} 
               isEditing={isEditing} 
               placeholder="e.g. Wheat"
               onChange={(val) => setFormData({...formData, primaryCrop: val})}
             />
           </>
         )}

      </div>

      {/* System Settings */}
      <div className="space-y-6 pt-10">
         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Ecosystem Access</h4>
         <div className="glass-card p-6 divide-y divide-slate-100">
            <div className="flex items-center justify-between py-4">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                     <CheckCircle2 size={20} />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-slate-800">DigiLocker Status</p>
                     <p className="text-[10px] text-slate-400 font-medium">Verified Aadhaar & Land Records</p>
                  </div>
               </div>
               <span className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-black">ACTIVE</span>
            </div>
            
            <div className="flex items-center justify-between py-4">
               <div className="flex items-center gap-4 text-slate-400">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                     <ExternalLink size={20} />
                  </div>
                  <div>
                     <p className="text-sm font-bold">Public ONDC Profile</p>
                     <p className="text-[10px] font-medium">View your marketplace identity</p>
                  </div>
               </div>
               <ChevronRight size={18} className="text-slate-200" />
            </div>
         </div>
      </div>

      {/* Logout Action */}
      <div className="pt-10">
         <button 
           onClick={handleLogout}
           className="w-full bg-red-50 text-red-600 hover:bg-red-100 py-6 rounded-[2rem] font-black flex items-center justify-center gap-3 transition-all active:scale-95 border border-red-100"
         >
            <LogOut size={24} />
            SIGN OUT FROM ECOSYSTEM
         </button>
      </div>

    </div>
  );
};

const DetailField = ({ label, value, icon, isEditing, onChange, placeholder, type = "text" }: any) => (
  <div className="space-y-2">
     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>
     <div className={`relative transition-all duration-300 ${isEditing ? 'scale-[1.02]' : ''}`}>
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
           {icon}
        </div>
        {isEditing ? (
          <input 
            type={type} 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-14 p-5 bg-white border-2 border-emerald-100 rounded-3xl font-bold text-slate-700 focus:border-emerald-500 transition-all outline-none shadow-xl shadow-emerald-900/5"
          />
        ) : (
          <div className="w-full pl-14 p-5 bg-white/50 border border-slate-100 rounded-3xl font-bold text-slate-800">
             {value || <span className="text-slate-300 italic">Not set</span>}
          </div>
        )}
     </div>
  </div>
);

export default ProfilePage;

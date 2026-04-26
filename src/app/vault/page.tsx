'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  FileText, 
  CreditCard, 
  ChevronRight,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';

const VaultPage = () => {
  const [formData, setFormData] = useState({ category: 'General', age: '', landSize: '' });
  const [isSearching, setIsSearching] = useState(false);
  const [suggestedSchemes, setSuggestedSchemes] = useState<any[] | null>(null);

  const handleSchemeSearch = () => {
    setIsSearching(true);
    // Simulate AI/API matching based on inputs
    setTimeout(() => {
      setIsSearching(false);
      const schemes = [];
      if (Number(formData.landSize) < 5 && Number(formData.landSize) > 0) {
        schemes.push({
          title: 'PM-Kisan Samman Nidhi',
          benefit: '₹6,000 / Year',
          status: 'High Match',
          tag: 'Central Govt'
        });
      }
      schemes.push({
        title: 'Pradhan Mantri Fasal Bima Yojana',
        benefit: 'Crop Insurance',
        status: 'General Match',
        tag: 'Central Govt'
      });
      if (formData.category === 'SC/ST' || formData.category === 'OBC') {
        schemes.push({
          title: 'Sub Mission on Agricultural Mechanization',
          benefit: 'Up to 50% Subsidy',
          status: 'Category Match',
          tag: 'Central Govt'
        });
      }
      setSuggestedSchemes(schemes);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-outfit text-emerald-900">Digital Vault</h1>
        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
           <Lock size={20} />
        </div>
      </div>

      {/* Identity Cards Scroll */}
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-1 px-1">
        {[
          { title: 'Aadhaar Card', id: '**** **** 1234', color: 'from-blue-600 to-blue-400', icon: CreditCard },
          { title: 'Land Record', id: 'Khata #9283-B', color: 'from-amber-600 to-amber-400', icon: FileText },
          { title: 'Soil Report', id: 'Batch 2024-A', color: 'from-emerald-600 to-emerald-400', icon: ShieldCheck },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`flex-shrink-0 w-64 h-36 rounded-3xl bg-gradient-to-br ${card.color} p-5 text-white shadow-lg relative overflow-hidden`}
            >
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Verified</span>
                </div>
                <div>
                  <p className="text-xs opacity-80">{card.title}</p>
                  <p className="text-lg font-bold font-mono tracking-wider">{card.id}</p>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </motion.div>
          );
        })}
      </div>

      {/* AI Scheme Matcher Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200"
      >
        <div className="flex items-center space-x-3 mb-4">
           <div className="p-2 bg-emerald-500 text-white rounded-xl">
              <Sparkles size={20} />
           </div>
           <h3 className="font-bold text-emerald-900">AI Scheme Matcher</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-emerald-800">Social Category</label>
            <select className="w-full mt-1 p-3 rounded-xl border border-emerald-200 bg-white/50 text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option>General</option>
              <option>OBC</option>
              <option>SC/ST</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-emerald-800">Age</label>
              <input type="number" className="w-full mt-1 p-3 rounded-xl border border-emerald-200 bg-white/50 text-sm" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-emerald-800">Land (Acres)</label>
              <input type="number" placeholder="e.g. 2" className="w-full mt-1 p-3 rounded-xl border border-emerald-200 bg-white/50 text-sm" value={formData.landSize} onChange={e => setFormData({...formData, landSize: e.target.value})} />
            </div>
          </div>
          <button 
             onClick={handleSchemeSearch} 
             disabled={isSearching} 
             className="w-full btn-primary text-sm py-4 flex items-center justify-center space-x-2"
          >
             {isSearching ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (
               <>
                 <span>FIND MY SCHEMES</span>
                 <ArrowRight size={16} />
               </>
             )}
          </button>
        </div>
      </motion.div>

      {/* Matching Schemes List */}
      {suggestedSchemes && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Eligible Schemes ({suggestedSchemes.length})</h4>
          
          {suggestedSchemes.map((scheme, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-4 group cursor-pointer hover:bg-white transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{scheme.tag}</span>
                  <h5 className="font-bold text-slate-800">{scheme.title}</h5>
                  <div className="flex items-center space-x-2">
                     <p className="text-xs font-bold text-emerald-700">{scheme.benefit}</p>
                     <span className="text-[10px] text-slate-400">•</span>
                     <p className="text-[10px] text-slate-500">{scheme.status}</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>
            </motion.div>
          ))}
          {suggestedSchemes.length === 0 && (
             <p className="text-center text-sm text-slate-500 py-4">No matching schemes found for this criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VaultPage;

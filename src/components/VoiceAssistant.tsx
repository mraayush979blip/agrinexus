'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Sparkles, Send } from 'lucide-react';
import { usePathname } from 'next/navigation';

const VoiceAssistant = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('How can I help you, Aayush?');

  const startListening = () => {
    setIsListening(true);
    setStatus('Listening in Hindi...');
    setTimeout(() => {
      setIsListening(false);
      setStatus('Processing your request...');
      setTimeout(() => {
        setIsOpen(false);
        setIsListening(false);
        setStatus('How can I help you, Aayush?');
      }, 2000);
    }, 3000);
  };

  if (pathname === '/' || pathname === '/login') return null;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-28 w-14 h-14 bg-emerald-900 text-white rounded-2xl shadow-2xl flex items-center justify-center z-50 overflow-hidden"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-20 bg-gradient-to-tr from-amber-400 to-transparent"
        />
        <Mic size={24} className="relative z-10" />
      </motion.button>

      {/* Voice Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-emerald-950/90 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-8 text-center"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-10 right-10 p-2 text-white/50 hover:text-white"
            >
              <X size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-8 w-full max-w-sm"
            >
              <div className="flex items-center justify-center space-x-2 text-amber-400">
                <Sparkles size={20} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">AgriNexus Voice AI</span>
              </div>

              <h2 className="text-2xl font-bold text-white font-outfit">
                {status}
              </h2>

              {/* Animated Waveform */}
              <div className="h-32 flex items-center justify-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={isListening ? {
                      height: [20, 60, 20],
                    } : {
                      height: [10, 10, 10],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                    className="w-2 bg-emerald-400 rounded-full"
                  />
                ))}
              </div>

              {!isListening ? (
                <button
                  onClick={startListening}
                  className="w-full btn-accent py-6 rounded-3xl text-lg flex items-center justify-center space-x-3"
                >
                  <Mic size={24} />
                  <span>Tap to Speak</span>
                </button>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <p className="text-emerald-400 text-sm animate-pulse italic">
                    "Tractor ki kiraya kitni hai?"
                  </p>
                  <button
                    onClick={() => setIsListening(false)}
                    className="p-4 bg-white/10 rounded-full text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
              )}

              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest pt-8">
                Powered by Bhashini + Gemini
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAssistant;

'use client';
// Team page for AgriNexus ecosystem

import React from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Code2,
  Users2,
  Heart,
  Globe
} from 'lucide-react';
import Link from 'next/link';

interface TeamMember {
  name: string;
  role: string;
  tagline: string;
  link: string;
  type: 'portfolio' | 'linkedin';
  gender: 'male' | 'female';
  customTop?: string;
}

const TeamPage = () => {
  const technicalTeam: TeamMember[] = [
    {
      name: "Aayush Sharma",
      role: "Full Stack Developer",
      tagline: "Building the backbone of AgriNexus ecosystem.",
      link: "https://aayush-sharma-beige.vercel.app/",
      type: "portfolio",
      gender: "male"
    },
    {
      name: "Aryan Soni",
      role: "Frontend Developer",
      tagline: "Crafting pixel-perfect agricultural interfaces.",
      link: "https://www.linkedin.com/in/aryan-soni-b42a69386",
      type: "linkedin",
      gender: "male"
    }
  ];

  const nonTechnicalTeam: TeamMember[] = [
    {
      name: "Mahima Bhardwaj",
      role: "Creative Strategist & Design Lead",
      tagline: "Visualizing the framing.",
      link: "https://www.linkedin.com/in/mahima-bhardwaj-2812223a1",
      type: "linkedin",
      gender: "female"
    },
    {
      name: "Alfin Tom George",
      role: "Pitch Specialist",
      tagline: "Voice of bridging tech and field.",
      link: "https://www.linkedin.com/in/alfin-tom-george",
      type: "linkedin",
      gender: "male",
      customTop: "ShortHairTheCaesar"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-1/4 w-1/2 h-1/2 bg-emerald-50 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -left-1/4 w-1/2 h-1/2 bg-blue-50 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-12">
          <div className="w-12 h-12" /> {/* Spacer instead of back button */}
          <div className="inline-flex items-center space-x-2 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em]">The Minds Behind AgriNexus</span>
          </div>
          <div className="w-12 h-12" /> {/* Spacer */}
        </div>

        <div className="text-center space-y-4 mb-20">
          <h1 className="text-5xl md:text-7xl font-black font-outfit text-slate-900 tracking-tight">Meet Our Team</h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            A passionate group of developers and strategists dedicated to transforming Indian agriculture.
          </p>
        </div>

        <div className="space-y-32">
          {/* Technical Section */}
          <section className="space-y-12">
            <div className="flex items-center gap-4 pl-2">
              <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/20">
                <Code2 size={24} />
              </div>
              <h2 className="text-3xl font-black font-outfit text-slate-800 uppercase tracking-tight">Technical Architects</h2>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {technicalTeam.map((member, i) => (
                <motion.div key={i} variants={item} className="group">
                  <div className="glass-card p-10 bg-white relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Code2 size={120} />
                    </div>
                    <div className="space-y-6 relative z-10">
                      <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center border border-blue-100">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}${member.customTop ? `&topType=${member.customTop}` : (member.gender === 'female' ? '&topType=LongHairCurvy' : '&topType=ShortHairShortWaved')}&accessoriesProbability=0&facialHairProbability=0`} 
                          className="w-14 h-14" 
                          alt={member.name} 
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-3xl font-black text-slate-900 font-outfit">{member.name}</h3>
                        <p className="text-blue-600 font-black text-xs uppercase tracking-widest">{member.role}</p>
                      </div>
                      <p className="text-slate-500 font-medium leading-relaxed">{member.tagline}</p>
                      <a
                        href={member.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all group/btn"
                      >
                        {member.type === 'portfolio' ? <Globe size={18} /> : <ExternalLink size={18} />}
                        {member.type === 'portfolio' ? 'VISIT WORK' : 'CONNECT'}
                        <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Non-Technical Section */}
          <section className="space-y-12">
            <div className="flex items-center gap-4 pl-2">
              <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                <Users2 size={24} />
              </div>
              <h2 className="text-3xl font-black font-outfit text-slate-800 uppercase tracking-tight">Strategy & Communications</h2>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {nonTechnicalTeam.map((member, i) => (
                <motion.div key={i} variants={item} className="group">
                  <div className="glass-card p-10 bg-white relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Users2 size={120} />
                    </div>
                    <div className="space-y-6 relative z-10">
                      <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center border border-emerald-100">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}${member.customTop ? `&topType=${member.customTop}` : (member.gender === 'female' ? '&topType=LongHairCurvy' : '&topType=ShortHairShortWaved')}&accessoriesProbability=0&facialHairProbability=0`} 
                          className="w-14 h-14" 
                          alt={member.name} 
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-3xl font-black text-slate-900 font-outfit">{member.name}</h3>
                        <p className="text-emerald-600 font-black text-xs uppercase tracking-widest">{member.role}</p>
                      </div>
                      <p className="text-slate-500 font-medium leading-relaxed">{member.tagline}</p>
                      <a
                        href={member.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all group/btn"
                      >
                        <ExternalLink size={18} />
                        CONNECT ON LINKEDIN
                        <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-40 text-center space-y-6"
        >
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <Heart size={24} className="fill-current" />
          </div>
          <p className="text-slate-400 font-black text-xs uppercase tracking-[0.4em]">Built with passion for Bharat</p>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamPage;

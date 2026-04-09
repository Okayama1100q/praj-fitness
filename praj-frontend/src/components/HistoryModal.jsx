import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Flame, PieChart, Info, Calendar, Smartphone, ChevronRight, Zap } from 'lucide-react';
import { OutlineButton } from './Shared';

const HistoryModal = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-[#0d0d0f] border border-white/10 rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-8 md:p-10 flex justify-between items-start border-b border-white/5 bg-white/[0.01]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase">Archive Entry</span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter text-white">{report.date}</h2>
            </div>
            <button 
              onClick={onClose}
              className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 shadow-inner"
            >
              <X className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-10 space-y-12">
            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 rounded-[36px] bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all duration-500">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Total Intake</p>
                <p className="text-5xl font-black tracking-tighter text-white">{report.intake}<span className="text-sm ml-2 font-bold opacity-20">kcal</span></p>
              </div>
              <div className="p-8 rounded-[36px] bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all duration-500">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Base Burn</p>
                <p className="text-5xl font-black tracking-tighter text-white">{report.burn}<span className="text-sm ml-2 font-bold opacity-20">kcal</span></p>
              </div>
            </div>

            {/* Hero Surplus Section */}
            <div className="relative p-10 py-12 rounded-[48px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 text-center shadow-2xl overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full opacity-20 bg-indigo-400 pointer-events-none -translate-y-1/2 translate-x-1/2" />
               <div className="absolute bottom-0 left-0 w-64 h-64 blur-[100px] rounded-full opacity-10 bg-purple-400 pointer-events-none translate-y-1/2 -translate-x-1/2" />
               <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-8 relative z-10">Daily Net Equilibrium</p>
               <div className="flex justify-around items-center relative z-10">
                  <div className="space-y-2">
                     <p className="text-white/20 text-[10px] font-black uppercase tracking-widest leading-none">Final Burn</p>
                     <p className="text-6xl font-black tracking-tighter text-white">{report.finalBurn || report.burn}</p>
                  </div>
                  <div className="w-px h-16 bg-white/10" />
                  <div className="space-y-2">
                     <p className="text-white/20 text-[10px] font-black uppercase tracking-widest leading-none">Net Surplus</p>
                     <p className={`text-6xl font-black tracking-tighter ${(report.finalSurplus || report.surplus) > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                       {(report.finalSurplus || report.surplus) > 0 ? '+' : ''}{report.finalSurplus || report.surplus}
                     </p>
                  </div>
               </div>
            </div>

            {/* Execution Detail (Selected Plan) */}
            {report.planChosen && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Protocol Executed</p>
                </div>
                <div className="p-10 rounded-[48px] bg-white/[0.04] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-5">
                       <div className={`p-5 rounded-3xl shadow-xl ${report.planChosen.type === 'walk' ? 'bg-emerald-500 text-black' : 'bg-orange-500 text-black'}`}>
                          {report.planChosen.type === 'walk' ? <Activity className="w-8 h-8" /> : <Flame className="w-8 h-8" />}
                       </div>
                       <div>
                          <h3 className="text-2xl font-black tracking-tight text-white capitalize">{report.planChosen.type} Plan</h3>
                          <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Confirmed Completion</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-5xl font-black tracking-tighter ${report.planChosen.type === 'walk' ? 'text-emerald-400' : 'text-orange-400'}`}>
                          {report.planChosen.steps || report.planChosen.duration}
                          <span className="text-[10px] ml-2 font-bold opacity-30 uppercase tracking-widest">{report.planChosen.type === 'walk' ? 'steps' : 'mins'}</span>
                       </p>
                    </div>
                  </div>

                  {report.planChosen.exercises && (
                    <div className="space-y-6 pt-8 border-t border-white/5">
                      <div className="flex flex-wrap gap-2.5">
                         {report.planChosen.exercises.map((ex, i) => (
                           <span key={i} className="px-5 py-3 rounded-2xl bg-[#131317] border border-white/10 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-default">
                              {ex}
                           </span>
                         ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Intelligence Context */}
            <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 relative group">
               <div className="flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Zap className="w-4 h-4" />
                  </div>
                  System Context
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-white/10 uppercase tracking-widest">Logged Steps</p>
                    <p className="text-white/60 font-medium leading-relaxed">
                      Manual logging confirms <span className="text-white font-black">{report.finalSteps || 0}</span> steps achieved.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-white/10 uppercase tracking-widest">Nutrition Anomalies</p>
                    <p className="text-white/60 font-medium leading-relaxed">
                      {report.cheatMeal ? (
                        <>Cheat meal entry detected: <span className="text-white font-black italic">"{report.cheatMeal}"</span></>
                      ) : (
                        'No nutritional anomalies or cheat meals detected for this cycle.'
                      )}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 md:p-10 bg-[#09090b] border-t border-white/5">
            <OutlineButton onClick={onClose} className="rounded-3xl h-16 border-white/10 hover:bg-white/5">
              Exit Consultation
            </OutlineButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HistoryModal;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, PieChart, TrendingDown, TrendingUp, X, Activity, Flame, ChevronRight, Info } from 'lucide-react';

const HistorySection = ({ logs, localHistory, onRefresh }) => {
  const [selectedReport, setSelectedReport] = useState(null);

  // Robust Merge: Create a merged list from both backend logs and local detailed reports
  const allHistory = [...logs];
  
  // Add/Merge local details
  localHistory?.forEach(localEntry => {
    const existingIndex = allHistory.findIndex(h => h.date === localEntry.date);
    if (existingIndex !== -1) {
      // Merge: Local details take priority for high-detail fields
      allHistory[existingIndex] = { ...allHistory[existingIndex], ...localEntry };
    } else {
      // Add local-only entry if not yet synced to backend
      allHistory.push(localEntry);
    }
  });

  // Sort by date descending
  allHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-card p-6 md:p-8 space-y-6 relative"
    >
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-2xl font-black tracking-tight underline decoration-indigo-500/20 underline-offset-8 decoration-4">Your Progress</h2>
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-4">History Analytics</p>
        </div>
        <button 
          onClick={onRefresh} 
          className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
        >
          <RefreshCcw className="w-5 h-5 text-white/50" />
        </button>
      </div>
      
      <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-3">
        {allHistory.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[40px]">
            <PieChart className="w-16 h-16 text-white/5 mx-auto mb-6" />
            <p className="text-white/20 font-bold uppercase tracking-widest text-xs">No entries found</p>
          </div>
        ) : (
          allHistory.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedReport(log)}
              className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:bg-white/5 hover:border-white/10 group cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-all border border-white/5 group-hover:border-white/10 shadow-lg">
                  <PieChart className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-xl text-white tracking-tighter">{log.date}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">In: {log.intake}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Burn: {log.burn}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 border-l border-white/5 pl-8 h-full">
                <div className="text-right">
                  <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em] mb-1">Final Surplus</p>
                  <div className="flex items-center gap-2">
                    {(log.finalSurplus || log.surplus) > 0 ? (
                      <TrendingUp className="w-4 h-4 text-rose-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className={`text-2xl font-black tracking-tighter ${(log.finalSurplus || log.surplus) > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {(log.finalSurplus || log.surplus) > 0 ? '+' : ''}{log.finalSurplus || log.surplus}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
              </div>

              {/* Background Glow for items with full local reports */}
              {log.finalSurplus !== undefined && (
                 <div className="absolute top-0 right-0 w-16 h-16 blur-[40px] rounded-full opacity-10 bg-indigo-500 pointer-events-none" />
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReport(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl glass-card rounded-[40px] p-8 space-y-8 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl shadow-indigo-500/10 border border-white/10"
            >
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mb-2">Daily Report</p>
                   <h2 className="text-4xl font-black tracking-tighter text-white">{selectedReport.date}</h2>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                >
                  <X className="w-5 h-5 text-white/50" />
                </button>
              </div>

              {/* Metrics Detail */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-[32px] bg-white/[0.03] border border-white/5 space-y-1">
                   <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Intake</p>
                   <p className="text-3xl font-black tracking-tight">{selectedReport.intake}<span className="text-[10px] ml-1 font-bold opacity-30">kcal</span></p>
                </div>
                <div className="p-6 rounded-[32px] bg-white/[0.03] border border-white/5 space-y-1">
                   <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Base Burn</p>
                   <p className="text-3xl font-black tracking-tight">{selectedReport.burn}<span className="text-[10px] ml-1 font-bold opacity-30">kcal</span></p>
                </div>
                <div className="p-10 col-span-2 rounded-[40px] bg-indigo-500/5 border border-indigo-500/10 text-center relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full opacity-20 bg-indigo-500 pointer-events-none" />
                   <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4">Final Summary</p>
                   <div className="flex justify-around items-end">
                      <div className="text-center">
                         <p className="text-white/30 text-[9px] font-bold uppercase mb-1">Final Burn</p>
                         <p className="text-4xl font-black tracking-tight text-white">{selectedReport.finalBurn || selectedReport.burn}</p>
                      </div>
                      <div className="w-px h-12 bg-white/10" />
                      <div className="text-center">
                         <p className="text-white/30 text-[9px] font-bold uppercase mb-1">Final Surplus</p>
                         <p className={`text-4xl font-black tracking-tighter ${(selectedReport.finalSurplus || selectedReport.surplus) > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                           {(selectedReport.finalSurplus || selectedReport.surplus) > 0 ? '+' : ''}{selectedReport.finalSurplus || selectedReport.surplus}
                         </p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Selected Plan Detail */}
              {selectedReport.planChosen && (
                <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className={`p-3 rounded-2xl ${selectedReport.planChosen.type === 'walk' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          {selectedReport.planChosen.type === 'walk' ? <Activity className="w-6 h-6" /> : <Flame className="w-6 h-6" />}
                       </div>
                       <h3 className="text-xl font-black tracking-tight capitalize">{selectedReport.planChosen.type} Plan</h3>
                    </div>
                    <div className="text-right">
                       <p className={`text-3xl font-black tracking-tighter ${selectedReport.planChosen.type === 'walk' ? 'text-emerald-400' : 'text-orange-400'}`}>
                          {selectedReport.planChosen.steps || selectedReport.planChosen.duration}
                          <span className="text-[10px] ml-1 font-bold opacity-30 uppercase tracking-tight">{selectedReport.planChosen.type === 'walk' ? 'steps' : 'mins'}</span>
                       </p>
                    </div>
                  </div>

                  {selectedReport.planChosen.exercises && (
                    <div className="space-y-4 border-t border-white/5 pt-6">
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Planned Exercises</p>
                      <div className="flex flex-wrap gap-2">
                         {selectedReport.planChosen.exercises.map((ex, i) => (
                           <span key={i} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white/70 hover:bg-white/10 transition-colors">
                              {ex}
                           </span>
                         ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Activity Section */}
              <div className="p-8 space-y-4">
                 <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-4 mb-2">
                    <Info className="w-4 h-4" /> Additional Context
                 </div>
                 <p className="text-sm text-white/40 leading-relaxed italic">
                    Final steps logged: <span className="text-white font-bold not-italic">{selectedReport.finalSteps || 0}</span>. 
                    {selectedReport.cheatMeal ? ` Cheat meal: "${selectedReport.cheatMeal}"` : ' No cheat meal logged.'}
                 </p>
              </div>

              <OutlineButton onClick={() => setSelectedReport(null)} className="rounded-[28px] h-14 border-white/10 hover:bg-white/5">
                Close Report
              </OutlineButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HistorySection;

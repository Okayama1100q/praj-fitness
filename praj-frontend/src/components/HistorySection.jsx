import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, PieChart, ChevronRight, Activity, Zap, History } from 'lucide-react';
import HistoryModal from './HistoryModal';

const HistorySection = ({ logs, localHistory, onRefresh }) => {
  const [selectedReport, setSelectedReport] = useState(null);

  // Merge backend logs and local detailed reports
  const allHistory = [...logs];
  
  localHistory?.forEach(localEntry => {
    const existingIndex = allHistory.findIndex(h => h.date === localEntry.date);
    if (existingIndex !== -1) {
      allHistory[existingIndex] = { ...allHistory[existingIndex], ...localEntry };
    } else {
      allHistory.push(localEntry);
    }
  });

  allHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!logs && !localHistory) return <EmptyState />;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end px-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-white/20" />
            <span className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Archive</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white">Your Progress</h2>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onRefresh} 
          className="p-4 rounded-2xl bg-white/5 border border-white/5 shadow-xl transition-all"
        >
          <RefreshCcw className="w-5 h-5 text-white/40" />
        </motion.button>
      </div>
      
      <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
        {allHistory.length === 0 ? (
          <EmptyState />
        ) : (
          allHistory.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setSelectedReport(log)}
              className="group relative p-8 rounded-[32px] bg-[#0d0d0f]/50 backdrop-blur-3xl border border-white/5 hover:border-white/10 transition-all cursor-pointer overflow-hidden shadow-xl"
            >
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[20px] bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:text-white/60 group-hover:bg-white/10 transition-all duration-500 shadow-2xl">
                    <PieChart className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-2xl text-white tracking-tighter">{log.date}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest whitespace-nowrap">Intake: {log.intake}</span>
                      <div className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest whitespace-nowrap">Burn: {log.burn}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-10">
                  <div className="text-right space-y-1">
                    <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em]">Daily Net</p>
                    <div className="flex items-center gap-3 justify-end">
                      {(log.finalSurplus || log.surplus) > 0 ? (
                        <TrendingUp className="w-4 h-4 text-rose-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-emerald-500" />
                      )}
                      <span className={`text-3xl font-black tracking-tighter ${(log.finalSurplus || log.surplus) > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {(log.finalSurplus || log.surplus) > 0 ? '+' : ''}{log.finalSurplus || log.surplus}
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:flex w-10 h-10 rounded-full border border-white/5 items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Status Indicator Glow */}
              <div className={`absolute -right-4 top-1/2 -translate-y-1/2 w-32 h-32 blur-[60px] rounded-full opacity-5 pointer-events-none transition-all duration-1000 group-hover:opacity-10 ${
                (log.finalSurplus || log.surplus) > 0 ? 'bg-rose-500' : 'bg-emerald-500'
              }`} />
            </motion.div>
          ))
        )}
      </div>

      <HistoryModal 
        report={selectedReport} 
        onClose={() => setSelectedReport(null)} 
      />
    </motion.div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-32 rounded-[48px] border-2 border-dashed border-white/5 space-y-6">
    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
      <Zap className="w-10 h-10 text-white/10" />
    </div>
    <div className="text-center space-y-2">
      <p className="text-sm font-bold text-white/30 uppercase tracking-[0.3em]">No Logs Detected</p>
      <p className="text-white/10 text-xs">Complete your first daily consultation to see progress.</p>
    </div>
  </div>
);

const TrendingUp = ({ className }) => <TrendingDown className={className} style={{ transform: 'rotate(180deg)' }} />;
const TrendingDown = ({ className, style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={style}
  >
    <path d="m23 18-9.5-9.5-5 5L1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

export default HistorySection;


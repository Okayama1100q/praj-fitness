import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Send, Activity, Flame, CheckCircle2, Lock, History, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { Input, TextArea, Button, OutlineButton } from './Shared';

const NightUpdate = ({ onUpdate, result, selectedPlan, nightLog }) => {
  const [finalSteps, setFinalSteps] = useState('');
  const [cheatMeal, setCheatMeal] = useState('');
  const [updatedData, setUpdatedData] = useState(null);

  const handleUpdate = (e) => {
    e.preventDefault();
    
    const extraSteps = parseInt(finalSteps) || 0;
    const extraBurn = Math.floor(extraSteps * 0.04);
    const extraIntake = cheatMeal.length > 0 ? 500 : 0;
    
    const currentSurplus = result?.surplus || 0;
    const currentBurn = result?.burn || 0;

    const newSurplus = currentSurplus + extraIntake - extraBurn;
    const newBurn = currentBurn + extraBurn;

    const finalResult = {
      finalSurplus: newSurplus,
      finalBurn: newBurn,
      extraBurn,
      extraIntake,
      finalSteps: extraSteps,
      cheatMeal: cheatMeal,
      timestamp: Date.now()
    };

    setUpdatedData(finalResult);

    if (onUpdate) onUpdate(finalResult);
  };

  const isLocked = !!nightLog;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative space-y-10"
    >
      <div className="flex justify-between items-end px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Moon className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase">Closing Protocol</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white">Night Update</h2>
        </div>
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-3 py-1.5 rounded-full uppercase tracking-widest"
          >
            <Lock className="w-3 h-3" /> Day closed 💪
          </motion.div>
        )}
      </div>

      {!updatedData && !isLocked ? (
        <div className="space-y-10">
          {/* Status Snapshot */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <h3 className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">Current Status</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <SummaryItem label="INTAKE" value={result?.intake || 0} unit="kcal" />
              <SummaryItem label="BURN" value={result?.burn || 0} unit="kcal" />
              <SummaryItem 
                label="SURPLUS" 
                value={result?.surplus || 0} 
                unit="kcal" 
                isStatus 
                status={result?.surplus > 0 ? 'bad' : 'good'} 
              />
            </div>
          </div>
          
          {/* Active Plan Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <h3 className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">Active Objective</h3>
            </div>
            
            {selectedPlan ? (
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 shadow-xl overflow-hidden relative group"
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full ${selectedPlan.type === 'walk' ? 'bg-emerald-500' : 'bg-orange-500'} opacity-30 group-hover:opacity-100 transition-opacity`} />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                   <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedPlan.type === 'walk' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'} border border-white/5`}>
                        {selectedPlan.type === 'walk' ? <Activity className="w-6 h-6" /> : <Flame className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">SELECTED PROTOCOL</p>
                        <h4 className="text-2xl font-black text-white tracking-tight">{selectedPlan.type === 'walk' ? 'Movement Target' : 'High Intensity'}</h4>
                      </div>
                   </div>
                   
                   <div className="text-right">
                      <p className={`text-5xl font-black tracking-tighter ${selectedPlan.type === 'walk' ? 'text-emerald-400' : 'text-orange-400'}`}>
                        {selectedPlan.type === 'walk' ? selectedPlan.steps : selectedPlan.duration}
                        <span className="text-sm ml-2 font-bold opacity-30 uppercase tracking-widest">{selectedPlan.type === 'walk' ? 'steps' : 'mins'}</span>
                      </p>
                   </div>
                </div>
                
                {selectedPlan.exercises && (
                  <div className="flex flex-wrap gap-2.5 mt-8 pt-8 border-t border-white/5">
                    {selectedPlan.exercises.map((ex, i) => (
                      <span key={i} className="px-4 py-2 rounded-xl bg-white/5 text-white/40 text-[10px] font-bold border border-white/5 hover:bg-white/10 transition-colors uppercase tracking-widest leading-none">
                        {ex}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="p-12 rounded-[40px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 rounded-full bg-white/5">
                  <Sparkles className="w-6 h-6 text-white/10" />
                </div>
                <p className="text-white/20 text-xs font-bold uppercase tracking-[0.3em] italic max-w-[200px] leading-relaxed">
                  No plan recorded. Visit the coach tab for analysis.
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleUpdate} className="space-y-10 pt-4 border-t border-white/5">
            <div className="grid gap-8">
              <Input 
                label="FINAL DAILY STEPS" 
                name="finalSteps" 
                type="number" 
                value={finalSteps} 
                onChange={(e) => setFinalSteps(e.target.value)} 
                placeholder="Log your actual total movement"
                required
              />
              <TextArea 
                label="NUTRITIONAL ANOMALIES" 
                name="cheatMeal" 
                value={cheatMeal} 
                onChange={(e) => setCheatMeal(e.target.value)} 
                placeholder="Logged cheat meals, extra snacks, or unexpected intake..."
                rows={2}
              />
            </div>

            <Button type="submit">
              Complete Cycle <Send className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12 py-10"
        >
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="w-24 h-24 rounded-[32px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/10"
            >
              <CheckCircle2 className="w-12 h-12" />
            </motion.div>
            <div className="space-y-2">
               <h3 className="text-4xl font-black tracking-tighter text-white">Daily Cycle Closed</h3>
               <p className="text-white/30 font-medium text-sm">Protocol synchronization complete. See you tomorrow 👋</p>
            </div>
          </div>

          <div className="p-12 rounded-[56px] bg-[#111116] border border-white/10 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 blur-[120px] rounded-full opacity-20 bg-indigo-500 pointer-events-none group-hover:opacity-30 transition-opacity" />
             <div className="absolute bottom-0 left-0 w-64 h-64 blur-[120px] rounded-full opacity-10 bg-indigo-500 pointer-events-none group-hover:opacity-20 transition-opacity" />
             
             <p className="text-indigo-400 font-black uppercase tracking-[0.4em] text-[11px] mb-10 text-center relative z-10">Final Intelligence Report</p>
             <div className="flex justify-around items-center relative z-10">
               <div className="text-center group-hover:scale-105 transition-transform duration-500">
                 <p className="text-white/20 text-[10px] font-black tracking-[0.2em] uppercase mb-4">Final Burn</p>
                 <p className="text-5xl font-black tracking-tighter text-white">
                   {updatedData?.finalBurn || nightLog?.finalBurn}
                   <span className="text-[12px] ml-2 font-bold text-white/20 tracking-widest uppercase">kcal</span>
                 </p>
               </div>
               <div className="w-px h-20 bg-white/10" />
               <div className="text-center group-hover:scale-105 transition-transform duration-500">
                 <p className="text-white/20 text-[10px] font-black tracking-[0.2em] uppercase mb-4">Final Surplus</p>
                 <p className={`text-5xl font-black tracking-tighter ${
                   (updatedData?.finalSurplus || nightLog?.finalSurplus) > 0 ? 'text-rose-500' : 'text-emerald-500'
                 }`}>
                   {(updatedData?.finalSurplus || nightLog?.finalSurplus) > 0 ? '+' : ''}
                   {updatedData?.finalSurplus || nightLog?.finalSurplus}
                   <span className="text-[12px] ml-2 font-bold opacity-30 tracking-widest uppercase text-white">kcal</span>
                 </p>
               </div>
             </div>
          </div>
          
          <div className="flex items-center justify-center pt-4">
            <div className="flex items-center gap-3 bg-white/5 py-4 px-8 rounded-full border border-white/5">
               <History className="w-4 h-4 text-white/20" />
               <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Session Archive Confirmed</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const SummaryItem = ({ label, value, unit, isStatus, status }) => {
  const isGood = status === 'good';
  const isBad = status === 'bad';
  
  return (
    <div className="p-6 rounded-[32px] bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all duration-500">
      <p className="text-white/20 text-[9px] font-black tracking-[0.2em] uppercase mb-3">{label}</p>
      <div className="flex items-end gap-1.5">
        <p className={`text-3xl font-black tracking-tighter leading-none ${isGood ? 'text-emerald-400' : isBad ? 'text-rose-400' : 'text-white'}`}>
          {value}
        </p>
        <span className="text-[10px] font-bold opacity-30 tracking-tight uppercase leading-none pb-1">{unit}</span>
      </div>
    </div>
  );
};

export default NightUpdate;


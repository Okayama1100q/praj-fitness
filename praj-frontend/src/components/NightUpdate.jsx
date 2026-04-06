import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Send, Activity, Flame, CheckCircle2, Lock, History } from 'lucide-react';
import { Input, TextArea, Button, OutlineButton } from './Shared';

const NightUpdate = ({ onUpdate, result, selectedPlan, nightLog }) => {
  const [finalSteps, setFinalSteps] = useState('');
  const [cheatMeal, setCheatMeal] = useState('');
  const [updatedData, setUpdatedData] = useState(null);

  const handleUpdate = (e) => {
    e.preventDefault();
    
    // Simulate updating day
    // Extra steps add to burn, cheat meal adds to intake
    const extraSteps = parseInt(finalSteps) || 0;
    const extraBurn = Math.floor(extraSteps * 0.04); // Rough estimate
    const extraIntake = cheatMeal.length > 0 ? 500 : 0; // Simple simulation
    
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-card p-6 md:p-8 space-y-8"
    >
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
            <Moon className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Night Update</h2>
        </div>
        {isLocked && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-full uppercase tracking-wider">
            <Lock className="w-3 h-3" /> Day closed 💪
          </div>
        )}
      </div>

      {!updatedData && !isLocked ? (
        <>
          {/* Today So Far Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase pl-1">Today So Far</h3>
            <div className="grid grid-cols-3 gap-2">
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
            
            {/* Selected Plan Details */}
            {selectedPlan ? (
              <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/[0.05] space-y-4">
                <div className="flex items-center gap-3">
                  {selectedPlan.type === 'walk' ? (
                    <Activity className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Flame className="w-5 h-5 text-orange-400" />
                  )}
                  <p className="font-bold text-sm tracking-tight">
                    {selectedPlan.type === 'walk' ? 'Walk Target' : 'Workout Protocol'}
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-end">
                    <p className={`text-2xl font-black tracking-tight ${selectedPlan.type === 'walk' ? 'text-emerald-400' : 'text-orange-400'}`}>
                      {selectedPlan.type === 'walk' ? selectedPlan.steps : selectedPlan.duration}
                      <span className="text-[10px] ml-1 font-bold opacity-40 uppercase tracking-widest">{selectedPlan.type === 'walk' ? 'steps' : 'mins'}</span>
                    </p>
                  </div>
                  
                  {selectedPlan.exercises && (
                    <div className="flex flex-wrap gap-1.5 border-t border-white/5 pt-3">
                      {selectedPlan.exercises.map((ex, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-bold border border-orange-500/10">
                          {ex}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-white/10 text-center">
                <p className="text-white/30 text-xs italic">No check-in plan selected head to Coach tab</p>
              </div>
            )}
          </div>

          <form onSubmit={handleUpdate} className="space-y-6 pt-2">
            <div className="space-y-4">
              <Input 
                label="Final Day Steps" 
                name="finalSteps" 
                type="number" 
                value={finalSteps} 
                onChange={(e) => setFinalSteps(e.target.value)} 
                placeholder="e.g., 12500"
                required
              />
              <TextArea 
                label="Cheat Meal / Extra (Optional)" 
                name="cheatMeal" 
                value={cheatMeal} 
                onChange={(e) => setCheatMeal(e.target.value)} 
                placeholder="e.g., A chocolate bar, 2 cookies"
                rows={2}
              />
            </div>

            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white border-none glow-button h-14 rounded-2xl">
              Update Day <Send className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="text-center py-6">
            <div className="w-20 h-20 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-2">Details entered today.</h3>
            <p className="text-white/40 text-sm">See ya tomorrow 👋</p>
          </div>

          <div className="p-7 rounded-[40px] bg-indigo-500/5 border border-indigo-500/10 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 blur-[100px] rounded-full opacity-30 bg-indigo-500 pointer-events-none" />
             <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px] mb-4">Final Summary</p>
             <div className="flex justify-around items-end">
               <div className="text-center">
                 <p className="text-white/30 text-[9px] font-bold tracking-widest uppercase mb-1">Final Burn</p>
                 <p className="text-3xl font-black tracking-tighter text-white">
                   {updatedData?.finalBurn || nightLog?.finalBurn}
                   <span className="text-[10px] ml-1 font-bold text-white/30 tracking-tight">KCAL</span>
                 </p>
               </div>
               <div className="w-px h-12 bg-white/5" />
               <div className="text-center">
                 <p className="text-white/30 text-[9px] font-bold tracking-widest uppercase mb-1">Final Surplus</p>
                 <p className={`text-3xl font-black tracking-tighter ${
                   (updatedData?.finalSurplus || nightLog?.finalSurplus) > 0 ? 'text-rose-400' : 'text-emerald-400'
                 }`}>
                   {(updatedData?.finalSurplus || nightLog?.finalSurplus) > 0 ? '+' : ''}
                   {updatedData?.finalSurplus || nightLog?.finalSurplus}
                   <span className="text-[10px] ml-1 font-bold opacity-50 tracking-tight uppercase">KCAL</span>
                 </p>
               </div>
             </div>
          </div>
          
          <div className="flex items-center justify-center pt-2">
            <div className="flex items-center gap-2 text-white/20 text-[10px] font-bold uppercase tracking-widest">
               <History className="w-4 h-4" /> Logged in local storage
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
    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
      <p className="text-white/40 text-[9px] font-bold tracking-widest uppercase mb-1">{label}</p>
      <p className={`font-black tracking-tighter ${isGood ? 'text-emerald-400' : isBad ? 'text-rose-400' : 'text-white'}`}>
        {value}
        <span className="text-[9px] ml-0.5 font-normal opacity-30 tracking-tighter">{unit}</span>
      </p>
    </div>
  );
};

export default NightUpdate;

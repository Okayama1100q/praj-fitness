import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Flame, CheckCircle2, Lock, Sparkles, Target } from 'lucide-react';

const ActionPlan = ({ options, onSelect, forceSelectedPlan }) => {
  const [selected, setSelected] = useState(forceSelectedPlan || null);

  useEffect(() => {
    if (forceSelectedPlan) setSelected(forceSelectedPlan);
  }, [forceSelectedPlan]);

  const handleSelect = (type, data) => {
    if (selected) return;
    
    const selection = {
      type,
      ...data,
      timestamp: Date.now()
    };
    
    setSelected(selection);
    if (onSelect) onSelect(selection);
  };

  if (!options) return null;
  const isLocked = !!selected;

  return (
    <div className="space-y-8 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="w-1 h-3 bg-white/20 rounded-full" />
          <h3 className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase font-rajdhani">Selected Protocol</h3>
        </div>
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[9px] font-black text-white/40 bg-white/5 border border-white/5 px-4 py-2 rounded-full uppercase tracking-[0.2em] font-rajdhani"
          >
            <Lock className="w-3 h-3 opacity-40" /> Sequence Locked
          </motion.div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Walk Option */}
        {options.walk && options.walk.target_steps > 0 && (
          <OptionCard 
            type="walk"
            icon={<Activity className="w-6 h-6" />}
            title="Kinetic Recovery"
            label="LOW IMPACT PROTOCOL"
            description="Closing the caloric gap through steady-state kinetics."
            value={options.walk.target_steps}
            unit="steps"
            color="white"
            isSelected={selected?.type === 'walk'}
            isDisabled={isLocked && selected?.type !== 'walk'}
            onSelect={() => handleSelect('walk', { steps: options.walk.target_steps, motivation: options.walk.motivation_msg })}
            motivation={selected?.motivation}
            isLocked={isLocked}
          />
        )}

        {/* Workout Option */}
        {options.workout && options.workout.duration > 0 && (
          <OptionCard 
            type="workout"
            icon={<Flame className="w-6 h-6" />}
            title="Structural Load"
            label="ANAEROBIC PROTOCOL"
            description={`${options.workout.duration}m intensive metabolic conditioning.`}
            value={options.workout.duration}
            unit="mins"
            exercises={options.workout.plan?.exercises}
            color="white"
            isSelected={selected?.type === 'workout'}
            isDisabled={isLocked && selected?.type !== 'workout'}
            onSelect={() => handleSelect('workout', { 
              duration: options.workout.duration, 
              exercises: options.workout.plan?.exercises,
              motivation: options.workout.motivation_msg
            })}
            motivation={selected?.motivation}
            isLocked={isLocked}
          />
        )}
      </div>
    </div>
  );
};

const OptionCard = ({ type, icon, title, label, description, value, unit, exercises, color, isSelected, isDisabled, onSelect, isLocked, motivation }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDisabled ? 0.2 : 1, 
        y: 0,
        borderColor: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
        scale: isSelected ? 1.01 : 1,
      }}
      className={`relative p-8 md:p-10 rounded-[48px] border transition-all duration-700 overflow-hidden group ${
        isSelected ? 'bg-white/[0.03]' : 'bg-white/[0.01]'
      } ${!isLocked ? 'hover:bg-white/[0.03] cursor-pointer shadow-2xl hover:border-white/10' : ''}`}
      onClick={(!isLocked && !isDisabled) ? onSelect : undefined}
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="flex items-start gap-8">
          <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center transition-all duration-700 ${
            isSelected ? 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.2)]' : 'bg-white/[0.03] text-white/10 group-hover:scale-105 group-hover:text-white/40'
          }`}>
            {icon}
          </div>
          <div className="space-y-2">
            <span className={`text-[9px] font-black uppercase tracking-[0.4em] font-rajdhani ${isSelected ? 'text-white/40' : 'text-white/10'}`}>
              {label}
            </span>
            <h4 className="text-3xl font-black text-white tracking-tighter leading-none uppercase font-rajdhani">{title}</h4>
            <p className="text-sm text-white/20 font-medium font-inter max-w-[240px] leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-10 pl-0 md:pl-10 border-l-0 md:border-l border-white/5 min-w-[200px] justify-between md:justify-end">
          <div className="text-left md:text-right">
            <p className={`text-5xl font-black tracking-tighter font-rajdhani leading-none ${isSelected ? 'text-white' : 'text-white/40'}`}>
              {value}
              <span className="text-[10px] font-black ml-2 opacity-30 uppercase tracking-[0.3em] font-rajdhani">{unit}</span>
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            {!isLocked ? (
              <motion.button
                key="choice-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex-shrink-0 px-8 py-4 rounded-2xl bg-white text-black font-black text-[10px] items-center gap-2 uppercase tracking-[0.2em] transition-all duration-500 shadow-xl font-rajdhani flex"
              >
                 Initialize <ChevronRight className="w-4 h-4" />
              </motion.button>
            ) : isSelected && (
              <motion.div 
                key="picked-badge"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <CheckCircle2 className="w-7 h-7" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isSelected && motivation && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 p-10 rounded-[40px] bg-white/[0.01] border border-white/[0.03] relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-white/20" />
          <div className="flex gap-6">
             <div className="flex-shrink-0 w-12 h-12 rounded-[20px] bg-white/[0.03] flex items-center justify-center border border-white/5 text-white/20">
                <Sparkles className="w-6 h-6" />
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em] font-rajdhani">Recalibration Strategy</p>
                <p className="text-base font-medium text-white/60 leading-relaxed italic font-inter italic opacity-80">"{motivation}"</p>
             </div>
          </div>
        </motion.div>
      )}

      {exercises && (
        <motion.div 
          initial={false}
          animate={{ height: (isSelected || !isLocked) ? 'auto' : 0, opacity: (isSelected || !isLocked) ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="mt-10 pt-10 border-t border-white/5">
            <div className="flex items-center gap-4 mb-6 opacity-20">
              <Target className="w-3 h-3" />
              <p className="text-[9px] font-black text-white uppercase tracking-[0.4em] font-rajdhani">Kinetic Breakdown</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {exercises.map((ex, idx) => (
                <span 
                  key={idx} 
                  className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-700 font-rajdhani ${
                    isSelected ? 'bg-white/5 text-white border border-white/10 scale-105' : 'bg-white/[0.01] text-white/10 border border-white/[0.02]'
                  }`}
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Glossy Accents */}
      {isSelected && (
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/[0.02] blur-[120px] rounded-full pointer-events-none transition-all duration-1000" />
      )}
    </motion.div>
  );
};

const ChevronRight = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default ActionPlan;

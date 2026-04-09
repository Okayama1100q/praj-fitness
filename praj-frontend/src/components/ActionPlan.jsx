import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Flame, CheckCircle2, Lock, ChevronRight, Sparkles } from 'lucide-react';

const ActionPlan = ({ options, onSelect, forceSelectedPlan }) => {
  const [selected, setSelected] = useState(forceSelectedPlan || null);

  useEffect(() => {
    // If a plan was saved today, it should be passed here via forceSelectedPlan
    if (forceSelectedPlan) setSelected(forceSelectedPlan);
  }, [forceSelectedPlan]);

  const handleSelect = (type, data) => {
    if (selected) return; // Already locked
    
    const selection = {
      type,
      ...data,
      timestamp: Date.now()
    };
    
    setSelected(selection);
    if (onSelect) onSelect(selection);
  };

  if (!options) return null;

  // 12-hour lock logic check
  const isLocked = !!selected;

  return (
    <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
          <h3 className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">Today's Protocol</h3>
        </div>
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full uppercase tracking-[0.1em]"
          >
            <Lock className="w-3 h-3" /> Plan locked for today 💪
          </motion.div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Walk Option */}
        {options.walk && options.walk.target_steps > 0 && (
          <OptionCard 
            type="walk"
            icon={<Activity className="w-6 h-6" />}
            title="Sustained Movement"
            label="TARGET WALK"
            description="Close the caloric gap through steady movement"
            value={options.walk.target_steps}
            unit="steps"
            color="emerald"
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
            title="High Intensity"
            label="WORKOUT PROTOCOL"
            description={`${options.workout.duration} minute strength & conditioning`}
            value={options.workout.duration}
            unit="mins"
            exercises={options.workout.plan?.exercises}
            color="orange"
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
  const isEmerald = color === 'emerald';
  const colorToken = isEmerald ? 'emerald' : 'orange';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDisabled ? 0.3 : 1, 
        y: 0,
        borderColor: isSelected ? (isEmerald ? 'rgba(16, 185, 129, 0.3)' : 'rgba(249, 115, 22, 0.3)') : 'rgba(255, 255, 255, 0.05)',
        scale: isSelected ? 1.01 : 1,
      }}
      className={`relative p-6 md:p-8 rounded-[32px] border transition-all duration-700 overflow-hidden group ${
        isSelected ? `bg-${colorToken}-500/[0.05]` : 'bg-white/[0.02]'
      } ${!isLocked ? 'hover:bg-white/[0.04] cursor-pointer shadow-2xl' : ''}`}
      onClick={(!isLocked && !isDisabled) ? onSelect : undefined}
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-start gap-5">
          <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-all duration-700 ${
            isSelected ? (isEmerald ? 'bg-emerald-500 text-black' : 'bg-orange-500 text-black') : 'bg-white/5 text-white/30 group-hover:scale-105 group-hover:text-white group-hover:bg-white/10'
          }`}>
            {icon}
          </div>
          <div className="space-y-1">
            <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${isSelected ? (isEmerald ? 'text-emerald-400' : 'text-orange-400') : 'text-white/20'}`}>
              {label}
            </span>
            <h4 className="text-2xl font-black text-white tracking-tight leading-none">{title}</h4>
            <p className="text-sm text-white/40 font-medium">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-8 pl-0 md:pl-8 border-l-0 md:border-l border-white/5">
          <div className="text-left md:text-right min-w-[100px]">
            <p className={`text-4xl font-black tracking-tighter ${isSelected ? (isEmerald ? 'text-emerald-400' : 'text-orange-400') : 'text-white/80'}`}>
              {value}
              <span className="text-[10px] font-bold ml-1 opacity-40 uppercase tracking-widest">{unit}</span>
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            {!isLocked ? (
              <motion.button
                key="choice-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 shadow-lg ${
                  isEmerald ? 'bg-emerald-500 text-black hover:bg-emerald-400 ring-emerald-500/20' : 'bg-orange-500 text-black hover:bg-orange-400 ring-orange-500/20'
                } hover:ring-8`}
              >
                Choose {type}
              </motion.button>
            ) : isSelected && (
              <div className="flex flex-col items-end gap-2">
                <motion.div 
                  key="picked-badge"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    isEmerald ? 'bg-emerald-500 text-black' : 'bg-orange-500 text-black'
                  }`}
                >
                  <CheckCircle2 className="w-6 h-6" />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isSelected && motivation && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-6 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent opacity-50" />
          <div className="flex gap-4">
             <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                <Sparkles className="w-5 h-5" />
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Praj Intelligence</p>
                <p className="text-sm font-medium text-white/80 leading-relaxed italic">"{motivation}"</p>
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
          <div className="mt-8 pt-8 border-t border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-px bg-white/20" />
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Planned Routine</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {exercises.map((ex, idx) => (
                <span 
                  key={idx} 
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-500 ${
                    isSelected ? (isEmerald ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-300 border border-orange-500/20') : 'bg-white/5 text-white/30 border border-white/5'
                  }`}
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Glossy Background Accents */}
      {isSelected && (
        <div className={`absolute -right-8 -top-8 w-48 h-48 blur-[100px] rounded-full opacity-20 pointer-events-none transition-all duration-1000 ${
          isEmerald ? 'bg-emerald-500' : 'bg-orange-500'
        }`} />
      )}
    </motion.div>
  );
};

export default ActionPlan;

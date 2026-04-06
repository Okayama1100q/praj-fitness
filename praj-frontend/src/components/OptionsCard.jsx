import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Flame, CheckCircle2, Lock } from 'lucide-react';

const OptionsCard = ({ options, onSelect, forceSelectedPlan }) => {
  const [selected, setSelected] = useState(forceSelectedPlan || null);

  useEffect(() => {
    if (forceSelectedPlan) setSelected(forceSelectedPlan);
  }, [forceSelectedPlan]);

  const handleSelect = (type, data) => {
    if (selected) return; // Locked
    
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
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold tracking-widest text-white/40 uppercase">Action Plan</h3>
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full uppercase tracking-wider"
          >
            <Lock className="w-3 h-3" /> Plan locked for today 💪
          </motion.div>
        )}
      </div>
      
      {/* Walk Option */}
      {options.walk && options.walk.target_steps && (
        <OptionItem 
          type="walk"
          icon={<Activity className="w-6 h-6" />}
          title="Target Walk"
          subtitle="Close the gap with steps"
          value={options.walk.target_steps}
          unit="steps"
          color="emerald"
          isSelected={selected?.type === 'walk'}
          isDisabled={isLocked && selected?.type !== 'walk'}
          onSelect={() => handleSelect('walk', { steps: options.walk.target_steps })}
          isLocked={isLocked}
        />
      )}

      {/* Workout Option */}
      {options.workout && options.workout.duration > 0 && (
        <OptionItem 
          type="workout"
          icon={<Flame className="w-6 h-6" />}
          title="Workout Protocol"
          subtitle={`${options.workout.duration} min intensity`}
          value={options.workout.duration}
          unit="mins"
          exercises={options.workout.plan}
          color="orange"
          isSelected={selected?.type === 'workout'}
          isDisabled={isLocked && selected?.type !== 'workout'}
          onSelect={() => handleSelect('workout', { 
            duration: options.workout.duration, 
            exercises: options.workout.plan 
          })}
          isLocked={isLocked}
        />
      )}
    </div>
  );
};

const OptionItem = ({ type, icon, title, subtitle, value, unit, exercises, color, isSelected, isDisabled, onSelect, isLocked }) => {
  const colorClass = color === 'emerald' ? 'emerald' : 'orange';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: isDisabled ? 0.3 : 1, 
        y: 0,
        scale: isSelected ? 1.02 : 1,
        borderColor: isSelected ? `rgba(${color === 'emerald' ? '52, 211, 153' : '251, 146, 60'}, 0.4)` : 'rgba(255, 255, 255, 0.05)'
      }}
      className={`p-6 rounded-3xl border transition-all duration-500 relative overflow-hidden group ${
        isSelected ? `bg-${colorClass}-500/[0.08]` : 'bg-white/[0.03]'
      } ${!isLocked ? 'hover:bg-white/[0.06] cursor-pointer shadow-xl' : ''}`}
      onClick={!isLocked ? onSelect : undefined}
    >
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 ${
            isSelected ? `bg-${colorClass}-500/20 text-${colorClass}-400 scale-110` : 'bg-white/5 text-white/40 group-hover:scale-110'
          }`}>
            {icon}
          </div>
          <div>
            <p className="font-bold text-xl text-white tracking-tight">{title}</p>
            <p className="text-sm text-white/40 italic">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className={`text-3xl font-black tracking-tighter ${isSelected ? `text-${colorClass}-400` : 'text-white/80'}`}>
              {value}
              <span className="text-[10px] font-bold ml-1 opacity-50 uppercase tracking-widest">{unit}</span>
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            {!isLocked ? (
              <motion.button
                key="select-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); onSelect(); }}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                  color === 'emerald' ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-orange-500 text-black hover:bg-orange-400'
                }`}
              >
                Choose
              </motion.button>
            ) : isSelected && (
              <motion.div 
                key="selected-icon"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  color === 'emerald' ? 'bg-emerald-500 text-black' : 'bg-orange-500 text-black'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {exercises && (
        <motion.div 
          initial={false}
          animate={{ height: isSelected || !isLocked ? 'auto' : 0, opacity: isSelected || !isLocked ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/5">
            {exercises.map((ex, idx) => (
              <span 
                key={idx} 
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  isSelected ? `bg-${colorClass}-500/10 text-${colorClass}-300 border border-${colorClass}-500/20` : 'bg-white/5 text-white/40 border border-white/5'
                }`}
              >
                {ex}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Selected Background Glow */}
      {isSelected && (
        <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full opacity-20 pointer-events-none translate-x-1/4 -translate-y-1/4 bg-${colorClass}-500`} />
      )}
    </motion.div>
  );
};

export default OptionsCard;

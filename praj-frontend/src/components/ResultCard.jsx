import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, TrendingUp, TrendingDown, ArrowUpRight, Sparkles, Zap } from 'lucide-react';

const ResultCard = ({ result, onReset }) => {
  if (!result) return null;

  const hasCarryOver = result.adjusted_surplus > result.surplus;
  const carryOverAmount = result.adjusted_surplus - result.surplus;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative space-y-8"
    >
      {/* Header Info */}
      <div className="flex justify-between items-end px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-white/40" />
            <span className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Internal Scan Complete</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white">Daily Analysis</h2>
        </div>
        <motion.button 
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.7, ease: "anticipate" }}
          onClick={onReset} 
          className="p-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
        >
          <RefreshCcw className="w-4 h-4 text-white/40" />
        </motion.button>
      </div>

      {/* Praj Message - Premium Chat Bubble */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="relative p-10 rounded-[40px] bg-white/[0.03] border border-white/10 shadow-2xl overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
        <p className="text-2xl font-black leading-[1.2] text-white/90 tracking-tight">
          "{result.message}"
        </p>
      </motion.div>

      {/* Carry Over Highlight */}
      <AnimatePresence>
        {hasCarryOver && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            className="px-6 py-4 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20">
                <TrendingUp className="w-4 h-4 text-rose-400" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-rose-400">Carried Over Surplus</span>
            </div>
            <p className="text-xl font-black tracking-tighter text-rose-400">
              +{carryOverAmount} <span className="text-[10px] opacity-40">kcal</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricItem label="INTAKE" value={result.intake} unit="kcal" delay={0.3} />
        <MetricItem label="BASE BURN" value={result.burn} unit="kcal" delay={0.4} />
        <MetricItem 
          label="NET SURPLUS" 
          value={result.surplus} 
          unit="kcal" 
          status={result.surplus > 0 ? 'bad' : 'good'} 
          sign
          delay={0.5}
        />
        <MetricItem 
          label="ADJ. SURPLUS" 
          value={result.adjusted_surplus} 
          unit="kcal" 
          highlight
          status={result.adjusted_surplus > 0 ? 'bad' : 'good'}
          sign
          delay={0.6}
        />
      </div>
    </motion.div>
  );
};

const MetricItem = ({ label, value, unit, status, sign, highlight, delay }) => {
  const isGood = status === 'good';
  const isBad = status === 'bad';
  const colorClass = isGood ? 'text-emerald-400' : isBad ? 'text-rose-400' : 'text-white/60';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-6 rounded-[32px] flex flex-col justify-between transition-all duration-500 border relative overflow-hidden group shadow-lg ${
        highlight ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-white/[0.02] border-white/5'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[9px] font-black tracking-[0.2em] uppercase ${highlight ? 'text-indigo-400' : 'text-white/20'}`}>
          {label}
        </span>
        {highlight && <Zap className="w-3 h-3 text-indigo-400 fill-indigo-400" />}
      </div>
      <div className="space-y-0 text-left">
        <span className={`text-4xl font-black tracking-tighter block ${colorClass}`}>
          {sign && value > 0 ? '+' : ''}{value}
        </span>
        <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest block transform translate-y-[-4px]">{unit}</span>
      </div>
      
      {/* Small directional icon */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-40 transition-opacity">
        {isGood ? <TrendingDown className="w-4 h-4 text-emerald-400" /> : <TrendingUp className="w-4 h-4 text-rose-400" />}
      </div>
    </motion.div>
  );
};

export default ResultCard;


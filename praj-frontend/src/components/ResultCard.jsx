import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, TrendingUp, TrendingDown, Sparkles, Zap, Brain } from 'lucide-react';

const ResultCard = ({ result, onReset }) => {
  if (!result) return null;

  const hasCarryOver = result.adjusted_surplus > result.surplus;
  const carryOverAmount = result.adjusted_surplus - result.surplus;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative space-y-10"
    >
      {/* diagnostic header */}
      <div className="flex justify-between items-end px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-3 bg-white/20 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 font-rajdhani">Diagnostic Output</span>
          </div>
          <h2 className="text-5xl font-black tracking-tighter text-white uppercase font-rajdhani leading-none">Analysis Cluster</h2>
        </div>
        <motion.button 
          whileHover={{ rotate: 90, scale: 1.1 }}
          transition={{ duration: 0.4 }}
          onClick={onReset} 
          className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
        >
          <RefreshCcw className="w-5 h-5 text-white/20" />
        </motion.button>
      </div>

      {/* Intelligence Insight */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="relative p-12 rounded-[48px] bg-[#0d0d0f]/60 backdrop-blur-3xl border border-white/[0.03] overflow-hidden group shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-white opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-6 opacity-40">
            <Brain className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] font-rajdhani italic">Praj Insight Engine</span>
        </div>
        
        <p className="text-3xl font-black leading-tight text-white tracking-tighter font-rajdhani uppercase">
          "{result.message}"
        </p>
      </motion.div>

      {/* Persistence Carry Over */}
      <AnimatePresence>
        {hasCarryOver && (
          <motion.div 
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            className="px-8 py-5 rounded-[28px] bg-rose-500/[0.03] border border-rose-500/10 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
               <TrendingUp className="w-4 h-4 text-rose-500/40" />
               <span className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-500/60 font-rajdhani">Residual Metabolic Surplus</span>
            </div>
            <p className="text-2xl font-black tracking-tighter text-rose-500 font-rajdhani">
              +{carryOverAmount} <span className="text-[10px] uppercase opacity-30 tracking-widest font-inter">Kcal</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricItem label="INGEST" value={result.intake} unit="kcal" delay={0.3} />
        <MetricItem label="METABOLIC BASE" value={result.burn} unit="kcal" delay={0.4} />
        <MetricItem 
          label="NET DELTA" 
          value={result.surplus} 
          unit="kcal" 
          status={result.surplus > 0 ? 'bad' : 'good'} 
          sign
          delay={0.5}
        />
        <MetricItem 
          label="ADJ. STATUS" 
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-7 rounded-[40px] flex flex-col justify-between transition-all duration-700 border relative overflow-hidden group ${
        highlight ? 'bg-white/[0.04] border-white/10' : 'bg-white/[0.01] border-white/5'
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <span className={`text-[10px] font-black tracking-[0.2em] uppercase font-rajdhani ${highlight ? 'text-white' : 'text-white/20'}`}>
          {label}
        </span>
        {highlight && <Zap className="w-3 h-3 text-white fill-white opacity-40" />}
      </div>
      <div className="space-y-0 text-left">
        <span className={`text-5xl font-black tracking-tighter block font-rajdhani leading-none ${colorClass}`}>
          {sign && value > 0 ? '+' : ''}{value}
        </span>
        <span className="text-[10px] font-black opacity-20 uppercase tracking-[0.3em] block mt-2 font-rajdhani">{unit}</span>
      </div>
      
      {/* Directional Accent */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-20 transition-all transform translate-y-2 group-hover:translate-y-0">
        {isGood ? <TrendingDown className="w-5 h-5 text-emerald-400" /> : <TrendingUp className="w-5 h-5 text-rose-400" />}
      </div>
    </motion.div>
  );
};

export default ResultCard;


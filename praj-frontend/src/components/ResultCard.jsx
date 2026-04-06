import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';
import { OutlineButton } from './Shared';

const ResultCard = ({ result, onReset }) => {
  if (!result) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 md:p-8 space-y-6"
    >
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold tracking-tight">Status Update</h2>
        <button 
          onClick={onReset} 
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Praj Message */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-white/20" />
        <p className="text-xl font-medium leading-relaxed italic text-white/90">
          "{result.message}"
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricItem label="INTAKE" value={result.intake} unit="kcal" />
        <MetricItem label="BURN" value={result.burn} unit="kcal" />
        <MetricItem 
          label="SURPLUS" 
          value={result.surplus} 
          unit="kcal" 
          status={result.surplus > 0 ? 'bad' : 'good'} 
          sign
        />
        <MetricItem 
          label="ADJ. SURPLUS" 
          value={result.adjusted_surplus} 
          unit="kcal" 
          highlight
          status={result.adjusted_surplus > 0 ? 'bad' : 'good'}
          sign
        />
      </div>
    </motion.div>
  );
};

const MetricItem = ({ label, value, unit, status, sign, highlight }) => {
  const isGood = status === 'good';
  const isBad = status === 'bad';
  
  return (
    <div className={`p-4 rounded-xl flex flex-col justify-between ${highlight ? 'bg-white/10 border-white/20' : 'bg-black/40 border-white/5'} border`}>
      <span className={`text-[10px] font-bold tracking-widest mb-1 ${highlight ? 'text-white/80' : 'text-white/40'}`}>
        {label}
      </span>
      <span className={`text-xl font-black tracking-tight ${isGood ? 'text-emerald-400' : isBad ? 'text-rose-400' : 'text-white'}`}>
        {sign && value > 0 ? '+' : ''}{value}
        <span className="text-[10px] ml-1 font-normal opacity-50 uppercase tracking-tighter">{unit}</span>
      </span>
    </div>
  );
};

export default ResultCard;

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Coffee, Zap, Activity, Brain, Target, ShieldCheck } from 'lucide-react';
import { Input, TextArea, Select, Button } from './Shared';

const InputCard = ({ formData, handleChange, handleSubmit, loading }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative"
    >
      <div className="relative glass-card-peak p-8 md:p-14 overflow-hidden border border-white/[0.03]">
        {/* Aesthetic Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-[120px] -z-10" />

        <div className="mb-14">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-1 h-4 bg-white rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 font-rajdhani">System Synchronized</span>
          </motion.div>
          <h2 className="text-5xl font-black tracking-tighter mb-6 text-white leading-none uppercase font-rajdhani">Metabolic Input Sequence</h2>
          <p className="text-white/30 text-base font-medium max-w-lg leading-relaxed font-inter">Synchronizing your 6 PM physiological status. Provide precise intake data for optimal closing strategy recalibration.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid gap-12">
            {/* Nutritional Ingest */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2 ml-1">
                    <Brain className="w-3 h-3 text-white/20" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20 font-rajdhani">Previous Intake</span>
                </div>
                <TextArea 
                    name="food" 
                    value={formData.food} 
                    onChange={handleChange} 
                    placeholder="Log all calories consumed until 18:00..."
                    required
                    rows={2}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2 ml-1">
                    <Target className="w-3 h-3 text-white/20" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20 font-rajdhani">Projected Fueling</span>
                </div>
                <TextArea 
                    name="dinner" 
                    value={formData.dinner} 
                    onChange={handleChange} 
                    placeholder="Planned evening nutritional protocol..."
                    required
                    rows={2}
                />
              </div>
            </div>
            
            {/* Environmental & Stress Factors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-white/40 transition-colors pt-5">
                  <Activity className="w-5 h-5" />
                </div>
                <Input 
                  label="Kinetic Movement (Steps)" 
                  name="steps" 
                  type="number" 
                  value={formData.steps} 
                  onChange={handleChange} 
                  placeholder="Total count"
                  className="pl-14"
                />
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-white/40 transition-colors pt-5 z-10">
                  <Zap className="w-5 h-5" />
                </div>
                <Select
                  label="Physiological Energy State"
                  name="energy"
                  value={formData.energy}
                  onChange={handleChange}
                  className="pl-14"
                  options={[
                      { label: 'Exhaustion Observed', value: 'tired' },
                      { label: 'Homeostasis / Optimal', value: 'normal' },
                      { label: 'Surplus Energy state', value: 'active' }
                  ]}
                />
              </div>
            </div>

            {/* Stress Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 rounded-[32px] bg-white/[0.01] border border-white/[0.03]">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2 ml-1">
                    <ShieldCheck className="w-3 h-3 text-white/20" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20 font-rajdhani">Structural Intensity</span>
                </div>
                <Select
                    name="activity_type"
                    value={formData.activity_type}
                    onChange={handleChange}
                    options={[
                        { label: 'No high-intensity stress', value: 'none' },
                        { label: 'Low-impact movement', value: 'light' },
                        { label: 'Hypertrophic training', value: 'medium' },
                        { label: 'Maximum heart-rate load', value: 'intense' }
                    ]}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2 ml-1">
                    <Sparkles className="w-3 h-3 text-white/20" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20 font-rajdhani">Temporal Duration</span>
                </div>
                <Input 
                    name="duration" 
                    type="number" 
                    value={formData.duration} 
                    onChange={handleChange} 
                    placeholder="Duration in mins"
                />
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Button type="submit" loading={loading} className="py-7 text-sm">
              Initiate Diagnostic Sequence <ChevronRight className="w-5 h-5" />
            </Button>
            <div className="flex items-center justify-center gap-4 mt-8 opacity-20 group">
                <div className="h-px w-8 bg-white" />
                <span className="text-[9px] font-black uppercase tracking-[0.5em] font-rajdhani group-hover:opacity-100 transition-opacity">Praj Intelligence Core</span>
                <div className="h-px w-8 bg-white" />
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default InputCard;

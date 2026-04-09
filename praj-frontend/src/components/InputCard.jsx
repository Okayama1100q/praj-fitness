import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Coffee, Zap, Activity, Weight } from 'lucide-react';
import { Input, TextArea, Select, Button } from './Shared';

const InputCard = ({ formData, handleChange, handleSubmit, loading }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative"
    >
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[40px] blur-2xl opacity-50" />
      
      <div className="relative bg-[#09090b]/80 backdrop-blur-3xl p-8 md:p-12 rounded-[40px] border border-white/10 shadow-2xl">
        <div className="mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Evening Consultation</span>
          </motion.div>
          <h2 className="text-4xl font-black tracking-tight mb-4 text-white">Fuel check — what powered your day?</h2>
          <p className="text-white/40 text-sm font-medium max-w-md leading-relaxed">Praj is analyzing your energy. Provide your 6 PM status to lock in today's closing strategy.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid gap-10">
            {/* Food Section */}
            <div className="space-y-6">
              <TextArea 
                label="Consumption LOG" 
                name="food" 
                value={formData.food} 
                onChange={handleChange} 
                placeholder="Ex: 3 idlis with sambar, coffee, protein bar..."
                required
                rows={2}
              />
              <TextArea 
                label="Planned Dinner" 
                name="dinner" 
                value={formData.dinner} 
                onChange={handleChange} 
                placeholder="Ex: Light salad and soup"
                required
                rows={2}
              />
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/60 transition-colors pt-4">
                  <Activity className="w-5 h-5" />
                </div>
                <Input 
                  label="Movement" 
                  name="steps" 
                  type="number" 
                  value={formData.steps} 
                  onChange={handleChange} 
                  placeholder="Steps taken"
                  style={{ paddingLeft: '3.5rem' }}
                />
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/60 transition-colors pt-4">
                  <Zap className="w-5 h-5" />
                </div>
                <Select
                  label="Vibe Check"
                  name="energy"
                  value={formData.energy}
                  onChange={handleChange}
                  style={{ paddingLeft: '3.5rem' }}
                  options={[
                    { label: '🔋 Feeling Tired', value: 'tired' },
                    { label: '⚡ Normal / Steady', value: 'normal' },
                    { label: '🚀 High Energy', value: 'active' }
                  ]}
                />
              </div>
            </div>

            {/* Exercise Check */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
              <Select
                label="Activity Scan"
                name="activity_type"
                value={formData.activity_type}
                onChange={handleChange}
                options={[
                  { label: 'None today', value: 'none' },
                  { label: 'Light (Walk/Yoga)', value: 'light' },
                  { label: 'Medium (Gym/Run)', value: 'medium' },
                  { label: 'Intense (HIIT/Heavy)', value: 'intense' }
                ]}
              />
              <Input 
                label="Duration" 
                name="duration" 
                type="number" 
                value={formData.duration} 
                onChange={handleChange} 
                placeholder="Minutes"
              />
            </div>

            {/* Biometrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 mt-2">
              <div className="relative group">
                 <Input label="kg" name="weight" type="number" value={formData.weight} onChange={handleChange} />
              </div>
              <div className="relative group">
                 <Input label="cm" name="height" type="number" value={formData.height} onChange={handleChange} />
              </div>
              <div className="relative group">
                 <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" loading={loading}>
              Run Analysis <ChevronRight className="w-4 h-4" />
            </Button>
            <p className="text-center mt-6 text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
              Powered by Praj Intelligence
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default InputCard;

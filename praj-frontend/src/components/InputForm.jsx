import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Input, TextArea, Select, Button } from './Shared';

const InputForm = ({ formData, handleChange, handleSubmit, loading }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Check in with Praj</h2>
        <p className="text-white/60 text-sm">Provide your 6 PM status to get today's closing strategy.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <TextArea 
            label="What did you eat so far?" 
            name="food" 
            value={formData.food} 
            onChange={handleChange} 
            placeholder="e.g., 2 eggs, rice and beans, an apple"
            required
            rows={2}
          />
          <TextArea 
            label="Planned dinner" 
            name="dinner" 
            value={formData.dinner} 
            onChange={handleChange} 
            placeholder="e.g., Grilled chicken salad"
            required
            rows={2}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Steps taken" 
              name="steps" 
              type="number" 
              value={formData.steps} 
              onChange={handleChange} 
              placeholder="0"
            />
            <Select
              label="Energy Level"
              name="energy"
              value={formData.energy}
              onChange={handleChange}
              options={[
                { label: 'Tired', value: 'tired' },
                { label: 'Normal', value: 'normal' },
                { label: 'Active', value: 'active' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Activity Type"
              name="activity_type"
              value={formData.activity_type}
              onChange={handleChange}
              options={[
                { label: 'None', value: 'none' },
                { label: 'Light', value: 'light' },
                { label: 'Medium', value: 'medium' },
                { label: 'Intense', value: 'intense' }
              ]}
            />
            <Input 
              label="Duration (mins)" 
              name="duration" 
              type="number" 
              value={formData.duration} 
              onChange={handleChange} 
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/10 mt-2">
            <Input label="Weight (kg)" name="weight" type="number" value={formData.weight} onChange={handleChange} />
            <Input label="Height (cm)" name="height" type="number" value={formData.height} onChange={handleChange} />
            <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
          </div>
        </div>

        <Button type="submit" loading={loading} className="mt-8">
          Ask Praj <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </form>
    </motion.div>
  );
};

export default InputForm;

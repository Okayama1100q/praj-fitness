import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, ...props }) => {
  return (
    <div className="flex flex-col space-y-2 w-full group">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-focus-within:text-white/60 transition-colors ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.06] focus:border-white/20 transition-all text-white placeholder-white/20 selection:bg-white selection:text-black font-medium"
          {...props}
        />
        <div className="absolute inset-0 rounded-2xl bg-white/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none -z-10" />
      </div>
    </div>
  );
};

export const TextArea = ({ label, value, onChange, placeholder, required = false, rows = 3, ...props }) => {
  return (
    <div className="flex flex-col space-y-2 w-full group">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-focus-within:text-white/60 transition-colors ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className="w-full px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.06] focus:border-white/20 transition-all text-white placeholder-white/20 resize-none selection:bg-white selection:text-black font-medium"
          {...props}
        />
        <div className="absolute inset-0 rounded-2xl bg-white/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none -z-10" />
      </div>
    </div>
  );
};

export const Select = ({ label, value, onChange, options, required = false, ...props }) => {
  return (
    <div className="flex flex-col space-y-2 w-full group">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-focus-within:text-white/60 transition-colors ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          required={required}
          className="appearance-none w-full px-5 py-4 bg-[#09090b] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-[#0c0c0e] focus:border-white/20 transition-all text-white font-medium cursor-pointer"
          {...props}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-white/20">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
        <div className="absolute inset-0 rounded-2xl bg-white/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none -z-10" />
      </div>
    </div>
  );
};

export const Button = ({ children, onClick, type = 'button', loading = false, disabled = false, className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -2 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative w-full overflow-hidden rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs py-5 px-6 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-white hover:shadow-[0_25px_50px_rgba(255,255,255,0.15)] flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {!loading && children}
    </motion.button>
  );
};

export const OutlineButton = ({ children, onClick, type = 'button', disabled = false, className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl bg-transparent border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] py-5 px-6 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};


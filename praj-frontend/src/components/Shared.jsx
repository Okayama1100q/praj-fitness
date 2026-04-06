import React from 'react';
import { Loader2 } from 'lucide-react';

export const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, ...props }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && <label className="text-sm font-medium text-white/70">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all text-white placeholder-white/30"
        {...props}
      />
    </div>
  );
};

export const TextArea = ({ label, value, onChange, placeholder, required = false, rows = 3, ...props }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && <label className="text-sm font-medium text-white/70">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all text-white placeholder-white/30 resize-none"
        {...props}
      />
    </div>
  );
};

export const Select = ({ label, value, onChange, options, required = false, ...props }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && <label className="text-sm font-medium text-white/70">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          required={required}
          className="appearance-none w-full px-4 py-3 bg-[#111113] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-white"
          {...props}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export const Button = ({ children, onClick, type = 'button', loading = false, disabled = false, className = '', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative w-full overflow-hidden rounded-xl bg-white text-black font-semibold py-3.5 px-6 transition-all glow-button hover:bg-gray-100 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {!loading && children}
    </button>
  );
};

export const OutlineButton = ({ children, onClick, type = 'button', disabled = false, className = '', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl bg-transparent border border-white/20 text-white font-medium py-3.5 px-6 transition-all hover:bg-white/5 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

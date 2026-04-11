import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Weight, Ruler, Calendar, LogOut, RefreshCcw, ShieldCheck, History } from 'lucide-react';

const ProfileSection = ({ user, handleLogout, handleResetDay, handleClearHistory }) => {
  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-10 pb-20"
    >
      {/* Header Profile Card */}
      <div className="relative group p-10 rounded-[48px] bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/[0.05] transition-all duration-700" />
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="w-24 h-24 rounded-[32px] bg-white text-black flex items-center justify-center shadow-[0_20px_50px_rgba(255,255,255,0.1)] shrink-0">
            <span className="text-4xl font-rajdhani font-black">{user.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-4xl font-black tracking-tighter text-white font-rajdhani uppercase">{user.name}</h2>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-widest font-rajdhani">Secure Profile</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-[10px] text-white/20 font-medium tracking-tight">ID: {user.id?.toString().padStart(4, '0')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Biometric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BioCard icon={<Weight />} label="Current Mass" value={`${user.weight} kg`} color="text-indigo-400" />
        <BioCard icon={<Ruler />} label="Vertical Axis" value={`${user.height} cm`} color="text-amber-400" />
        <BioCard icon={<Calendar />} label="Chronological Stage" value={`${user.age} Years`} color="text-emerald-400" />
      </div>

      {/* Account Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-6 lg:h-full">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] font-rajdhani">Communication Link</p>
          <div className="space-y-6">
            <InfoItem icon={<Mail />} label="Secure Email" value={user.email} />
            <InfoItem icon={<Phone />} label="Authorization Contact" value={user.number || "Not Configured"} />
          </div>
        </div>

        <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-6">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] font-rajdhani">Tactical Controls</p>
            <div className="flex flex-col gap-4">
                <ActionButton 
                  icon={<RefreshCcw />} 
                  label="Purge Today's Cycle" 
                  onClick={handleResetDay}
                  className="hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400"
                />
                <ActionButton 
                  icon={<History />} 
                  label="Clear All Archives" 
                  onClick={handleClearHistory}
                  className="hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-amber-400"
                />
                <ActionButton 
                  icon={<LogOut />} 
                  label="Terminate Session" 
                  onClick={handleLogout}
                  className="hover:bg-white/10 hover:border-white/20 hover:text-white"
                />
            </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="flex items-center justify-center gap-4 text-white/10 pt-10 border-t border-white/5">
        <ShieldCheck className="w-5 h-5" />
        <p className="text-[9px] font-black uppercase tracking-[0.3em] font-rajdhani">Biometric Cryptography Active</p>
      </div>
    </motion.div>
  );
};

const BioCard = ({ icon, label, value, color }) => (
  <div className="p-8 rounded-[40px] bg-[#0d0d0f] border border-white/5 relative overflow-hidden group hover:border-white/10 hover:bg-white/[0.01] transition-all duration-500">
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-all duration-700 ${color.replace('text', 'bg')}`} />
    <div className="space-y-4 relative z-10">
      <div className={`w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center ${color}`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div>
        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1 font-rajdhani">{label}</p>
        <p className="text-3xl font-black text-white tracking-tighter font-rajdhani">{value}</p>
      </div>
    </div>
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-6">
    <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-white/20">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div>
      <p className="text-[8px] font-black text-white/10 uppercase tracking-widest mb-1 font-rajdhani">{label}</p>
      <p className="text-sm font-medium text-white/60">{value}</p>
    </div>
  </div>
);

const ActionButton = ({ icon, label, onClick, className }) => (
  <button 
    onClick={onClick}
    className={`w-full p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between transition-all duration-500 font-rajdhani group ${className}`}
  >
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center">
        {React.cloneElement(icon, { size: 16 })}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className="w-6 h-6 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
       <User className="w-3 h-3 text-white/20" />
    </div>
  </button>
);

export default ProfileSection;

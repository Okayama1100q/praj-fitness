import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Activity, LogOut, ChevronRight, Moon, History, Zap, CheckCircle2, RefreshCcw, User, Users, Unlock } from 'lucide-react';

import InputCard from '../components/InputCard';
import ResultCard from '../components/ResultCard';
import ActionPlan from '../components/ActionPlan';
import NightUpdate from '../components/NightUpdate';
import HistorySection from '../components/HistorySection';
import ProfileSection from '../components/ProfileSection';
import AdminSection from '../components/AdminSection';

import { request } from '@/config/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [spinupMessage, setSpinupMessage] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('coach'); // 'coach', 'night', 'history'
  const [logs, setLogs] = useState([]);
  const [user, setUser] = useState(null);
  const [bypassTime, setBypassTime] = useState(false);
  const isAdmin = user?.email === 'admin@gmail.com';
  
  // Persistence state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [nightLog, setNightLog] = useState(null);
  const [localHistory, setLocalHistory] = useState([]);
  
  // PWA & Notification State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  
  // Smooth Mouse Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 50, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // PWA Install Prompt Listener
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Logic to show popup after some delay or user interaction
      const hasSeenPopup = localStorage.getItem('praj_pwa_prompt_seen');
      if (!hasSeenPopup) {
        setTimeout(() => setShowInstallPopup(true), 5000);
      }
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Notification Permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(setNotificationPermission);
      }
    }

    // 6 PM Checker (Every Minute)
    const checkNotification = () => {
      const now = new Date();
      if (now.getHours() === 18 && now.getMinutes() === 0) {
        const lastNotified = localStorage.getItem('praj_last_notified');
        const todayStr = now.toLocaleDateString();
        if (lastNotified !== todayStr && Notification.permission === 'granted') {
          new Notification("PRAJ Diagnostic Reminder", {
            body: "Operational Window Open: Execute your 18:00 Core Scan now.",
            icon: "https://cdn-icons-png.flaticon.com/512/1043/1043324.png"
          });
          localStorage.setItem('praj_last_notified', todayStr);
        }
      }
    };
    const interval = setInterval(checkNotification, 60000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const isAuth = localStorage.getItem('praj_auth');
    const userData = localStorage.getItem('praj_user');
    
    if (!isAuth || !userData) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.email === 'admin@gmail.com') {
        setActiveTab('admin');
      }
      loadPersistedData(parsedUser.id);
      fetchLogs(parsedUser.id);
    }
  }, [navigate]);

  const loadPersistedData = (userId) => {
    const today = new Date().toLocaleDateString('en-CA');
    
    const savedData = JSON.parse(localStorage.getItem(`praj_data_${userId}_${today}`));
    const savedPlan = JSON.parse(localStorage.getItem(`praj_plan_${userId}_${today}`));
    const savedNight = JSON.parse(localStorage.getItem(`praj_night_${userId}_${today}`));
    const savedHistory = JSON.parse(localStorage.getItem(`praj_local_history_${userId}`)) || [];

    if (savedData) {
      setResult(savedData.result);
      setFormData(savedData.formData);
    }
    
    if (savedPlan) setSelectedPlan(savedPlan);
    if (savedNight) setNightLog(savedNight);
    setLocalHistory(savedHistory);
  };

  const fetchLogs = async (userId) => {
    const activeUserId = userId || user?.id;
    if (!activeUserId) return;
    
    try {
      const response = await request({
        method: 'GET',
        url: `/logs?user_id=${activeUserId}`
      });
      setLogs(response.data);
    } catch (err) {
      console.error('Archive synchronization failure:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [formData, setFormData] = useState({
    food: '', dinner: '', steps: '', activity_type: 'none', duration: '', energy: 'normal'
  });

  const BYPASS_TIME_GATING = false; 
  
  const getCurrentHour = () => new Date().getHours();
  const isCoachTime = BYPASS_TIME_GATING || bypassTime || getCurrentHour() >= 18;
  const isNightTime = BYPASS_TIME_GATING || bypassTime || getCurrentHour() >= 22;

  const isDayClosed = !!nightLog;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const timer = setTimeout(() => setSpinupMessage(true), 3000);
    
    const payload = {
      ...formData,
      user_id: user?.id,
      steps: parseInt(formData.steps) || 0,
      duration: parseInt(formData.duration) || 0
    };

    try {
      const response = await request({
        method: 'POST',
        url: '/coach',
        data: payload
      });
      
      const today = new Date().toLocaleDateString('en-CA');
      
      const sessionData = {
        formData,
        result: response.data,
        timestamp: Date.now()
      };
      
      localStorage.setItem(`praj_data_${user?.id}_${today}`, JSON.stringify(sessionData));
      setResult(response.data);
    } catch (err) {
      console.error("Diagnostic sequence error:", err);
      alert(err.response?.data?.detail || "Network link unstable. Verify server connection.");
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setSpinupMessage(false);
    }
  };

  const handlePlanSelect = (selection) => {
    const today = new Date().toLocaleDateString('en-CA');
    const planWithTime = {
      ...selection,
      timestamp: Date.now()
    };
    localStorage.setItem(`praj_plan_${user?.id}_${today}`, JSON.stringify(planWithTime));
    setSelectedPlan(planWithTime);
  };

  const handleNightUpdate = (finalResult) => {
    const today = new Date().toLocaleDateString('en-CA');
    
    const dailyReport = {
      date: today,
      intake: result?.intake,
      burn: result?.burn,
      surplus: result?.surplus,
      planChosen: selectedPlan,
      ...finalResult
    };

    const savedHistory = JSON.parse(localStorage.getItem(`praj_local_history_${user?.id}`)) || [];
    const updatedHistory = [...savedHistory.filter(h => h.date !== today), dailyReport];
    
    localStorage.setItem(`praj_night_${user?.id}_${today}`, JSON.stringify(finalResult));
    localStorage.setItem(`praj_local_history_${user?.id}`, JSON.stringify(updatedHistory));
    
    setNightLog(finalResult);
    setLocalHistory(updatedHistory);
    fetchLogs(user?.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('praj_auth');
    localStorage.removeItem('praj_user');
    navigate('/login');
  };

  const handleResetDay = () => {
    if (window.confirm("Purge all diagnostic data for today?")) {
      const today = new Date().toLocaleDateString('en-CA');
      localStorage.removeItem(`praj_data_${user?.id}_${today}`);
      localStorage.removeItem(`praj_plan_${user?.id}_${today}`);
      localStorage.removeItem(`praj_night_${user?.id}_${today}`);
      
      setResult(null);
      setSelectedPlan(null);
      setNightLog(null);
      setFormData({
        food: '', dinner: '', steps: '', activity_type: 'none', duration: '', energy: 'normal'
      });
      setActiveTab('coach');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("TERMINAL ACTION: Permanently delete all archived history? This cannot be reversed.")) {
      localStorage.removeItem(`praj_local_history_${user?.id}`);
      setLocalHistory([]);
      setLogs([]);
      alert("Archive sequence purged.");
    }
  };

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPopup(false);
    }
    localStorage.setItem('praj_pwa_prompt_seen', 'true');
  };

  return (
    <div className="min-h-screen bg-[#060608] flex flex-col lg:flex-row relative overflow-hidden font-inter selection:bg-white selection:text-black">
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <motion.div 
            style={{ 
                x: smoothX, 
                y: smoothY,
                translateX: '-50%',
                translateY: '-50%'
            }}
            className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-white/[0.03] blur-[120px]" 
          />
          <motion.div 
            style={{ 
                x: smoothX, 
                y: smoothY,
                translateX: '-20%',
                translateY: '-20%'
            }}
            className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-indigo-500/[0.04] blur-[150px]" 
          />
          <motion.div 
            style={{ 
                x: smoothX, 
                y: smoothY,
                translateX: '-80%',
                translateY: '-80%'
            }}
            className="absolute top-[50%] left-[50%] w-[25vw] h-[25vw] rounded-full bg-white/[0.01] blur-[100px]" 
          />
      </div>

      <div className="noise-overlay" />
      
      {/* Premium Sidebar */}
      <nav className="fixed bottom-0 left-0 w-full lg:static lg:w-28 lg:h-screen lg:flex lg:flex-col lg:border-r lg:border-white/5 bg-[#060608]/90 backdrop-blur-3xl z-40 lg:justify-between p-4 lg:p-8 overflow-x-auto border-t border-white/5 lg:border-t-0" style={{ scrollbarWidth: 'none' }}>
        <div className="flex lg:flex-col items-center justify-start lg:justify-center gap-6 lg:gap-12 min-w-max mx-auto lg:mx-0 w-max lg:w-auto px-4 lg:px-0">
          <motion.div whileHover={{ scale: 1.05 }} className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl lg:rounded-[20px] bg-white text-black hidden lg:flex items-center justify-center shadow-[0_10px_40px_rgba(255,255,255,0.1)]">
            <Activity className="w-6 h-6 lg:w-8 lg:h-8" />
          </motion.div>
          
          <div className="flex lg:flex-col gap-4 lg:gap-8">
            {isAdmin ? (
              <NavItem icon={<Users />} label="Admin" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />
            ) : (
              <>
                <NavItem icon={<Zap />} label="Core Scan" active={activeTab === 'coach'} onClick={() => setActiveTab('coach')} />
                <NavItem icon={<Moon />} label="Shutdown" active={activeTab === 'night'} onClick={() => setActiveTab('night')} />
                <NavItem icon={<History />} label="Archives" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
                <NavItem icon={<User />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
              </>
            )}
          </div>

          <div className="lg:mt-auto flex lg:flex-col gap-4 lg:gap-6 lg:pt-10 lg:border-t border-white/5 ml-auto lg:ml-0 pr-4 lg:pr-0">
            <button onClick={handleLogout} className="p-3 lg:p-4 text-rose-500/50 hover:text-rose-400 transition-all hover:bg-rose-500/10 rounded-2xl flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              <span className="lg:hidden text-xs font-black uppercase tracking-widest font-rajdhani">Exit</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* Left Side Branding */}
        <div className="hidden lg:flex w-[35%] min-h-screen flex-col justify-center pl-20 pointer-events-none select-none">
          <div className="space-y-0">
             <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 0.1, x: 0 }} className="text-[10vw] font-rajdhani font-black leading-none tracking-tighter">PEAK</motion.div>
             <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 0.1, x: 0 }} transition={{ delay: 0.1 }} className="text-[10vw] font-rajdhani font-black leading-none tracking-tighter text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,1)' }}>PERFORMANCE</motion.div>
             <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-[10vw] font-rajdhani font-black leading-none tracking-tighter text-white transform translate-y-[-15px]">{isAdmin ? 'ADMIN' : 'PRAJ'}</motion.div>
          </div>
          <div className="mt-12 h-0.5 w-16 bg-white/10" />
          <p className="mt-8 text-white/20 text-[10px] font-black uppercase tracking-[1em] leading-loose font-rajdhani">{isAdmin ? 'Global Overseer' : 'Automated Protocol Core'}</p>
        </div>

        {/* Diagnostic Space */}
        <main className="flex-1 min-h-screen flex items-start justify-center p-6 lg:p-16 overflow-y-auto custom-scrollbar pt-28 lg:pt-16">
          <div className="w-full max-w-3xl pb-20">
            <AnimatePresence mode="wait">
              {activeTab === 'coach' && (
                <motion.div 
                  key="coach"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-10"
                >
                  <AnimatePresence>
                    {spinupMessage && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 text-center space-y-2 mb-8"
                      >
                         <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Establishing Uplink</p>
                         <p className="text-xs text-white/20 font-medium">Render backend is initializing. Tactical recalibration in progress...</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isCoachTime && !result ? (
                    <motion.div 
                      className="p-16 rounded-[56px] bg-white/[0.01] border border-white/5 text-center space-y-8"
                    >
                      <div className="w-24 h-24 rounded-full bg-indigo-500/5 flex items-center justify-center mx-auto border border-indigo-500/10">
                        <Moon className="w-10 h-10 text-indigo-400/50" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white tracking-tighter font-rajdhani uppercase">Diagnostic Standby</h3>
                        <p className="text-white/20 text-sm font-medium tracking-widest uppercase">System unlocks at <span className="text-white">18:00 Hours</span></p>
                      </div>
                      <button 
                        onClick={() => setBypassTime(true)}
                        className="mt-6 mx-auto px-6 py-3 rounded-2xl border border-white/10 text-white/40 hover:text-white hover:bg-white/[0.03] transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2"
                      >
                         <Unlock className="w-3 h-3" /> Force Override
                      </button>
                    </motion.div>
                  ) : !result ? (
                    <InputCard 
                      formData={formData} 
                      handleChange={handleChange} 
                      handleSubmit={handleSubmit} 
                      loading={loading} 
                    />
                  ) : (
                    <div className="space-y-12">
                      <ResultCard result={result} onReset={() => setResult(null)} />
                      <ActionPlan 
                        options={result.options} 
                        onSelect={handlePlanSelect} 
                        forceSelectedPlan={selectedPlan}
                      />
                      
                      {selectedPlan && !isNightTime && (
                        <div className="flex flex-col items-center py-10 text-center space-y-4">
                           <div className="w-px h-12 bg-gradient-to-b from-white/10 to-transparent" />
                           <p className="text-white/20 text-xs font-black uppercase tracking-[0.3em] font-rajdhani">Phase 1 Complete. Awaiting Sunset Sequence.</p>
                        </div>
                      )}
                      
                      {selectedPlan && isNightTime && !nightLog && (
                         <div className="flex justify-center pt-6">
                            <button onClick={() => setActiveTab('night')} className="px-10 py-6 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-105 transition-all font-rajdhani">
                                Synchronize Final Lock
                            </button>
                         </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'night' && (
                <div className="space-y-10">
                  {!isNightTime ? (
                    <motion.div 
                      className="p-16 rounded-[56px] bg-white/[0.01] border border-white/5 text-center space-y-8"
                    >
                      <div className="w-24 h-24 rounded-full bg-indigo-500/5 flex items-center justify-center mx-auto border border-indigo-500/10">
                        <Moon className="w-10 h-10 text-indigo-400/50" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white tracking-tighter font-rajdhani uppercase">Sequence Pending</h3>
                        <p className="text-white/20 text-sm font-medium tracking-widest uppercase">Night update opens at <span className="text-white">22:00 Hours</span></p>
                      </div>
                      <button 
                        onClick={() => setBypassTime(true)}
                        className="mt-6 mx-auto px-6 py-3 rounded-2xl border border-white/10 text-white/40 hover:text-white hover:bg-white/[0.03] transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2"
                      >
                         <Unlock className="w-3 h-3" /> Force Override
                      </button>
                    </motion.div>
                  ) : (
                    <NightUpdate 
                      key="night"
                      onUpdate={handleNightUpdate}
                      result={result}
                      selectedPlan={selectedPlan}
                      nightLog={nightLog}
                    />
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <ProfileSection 
                  key="profile"
                  user={user}
                  handleLogout={handleLogout}
                  handleResetDay={handleResetDay}
                  handleClearHistory={handleClearHistory}
                  onProfileUpdate={(updated) => setUser(updated)}
                />
              )}

              {activeTab === 'admin' && isAdmin && (
                <AdminSection key="admin" />
              )}

              {activeTab === 'history' && (
                <HistorySection 
                  key="history"
                  logs={logs} 
                  localHistory={localHistory}
                  onRefresh={fetchLogs} 
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showInstallPopup && deferredPrompt && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-6"
                >
                  <div className="p-8 rounded-[40px] glass-card-peak border-white/20 shadow-[0_40px_100px_rgba(0,0,0,0.8)] text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center mx-auto shadow-2xl">
                      <Activity className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-rajdhani font-black text-white uppercase tracking-tighter">Install Protocol</h3>
                       <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest leading-relaxed">Add PRAJ to your home screen for instantaneous biometric access.</p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => { setShowInstallPopup(false); localStorage.setItem('praj_pwa_prompt_seen', 'true'); }} 
                        className="flex-1 py-4 rounded-xl border border-white/10 text-white/20 text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                      >
                        Ignore
                      </button>
                      <button 
                        onClick={handleInstallApp}
                        className="flex-1 py-4 rounded-xl bg-white text-black text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                      >
                        Initialize
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Final Lock Overlay */}
            {isDayClosed && activeTab !== 'history' && activeTab !== 'profile' && activeTab !== 'admin' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#060608]/90 backdrop-blur-xl"
              >
                <div className="w-full max-w-lg p-16 rounded-[60px] glass-card-peak text-center space-y-10 shadow-[0_0_120px_rgba(0,0,0,0.8)] border-white/10">
                  <div className="w-28 h-28 rounded-full bg-white text-black flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                    <CheckCircle2 className="w-14 h-14" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl font-rajdhani font-black text-white tracking-tighter uppercase leading-none">Day Cycle Archived</h2>
                    <p className="text-white/20 text-sm font-medium leading-relaxed font-inter uppercase tracking-widest italic">All metabolic markers logged. Biometric sync complete.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className="w-full py-6 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] font-rajdhani shadow-2xl hover:scale-[1.02] transition-all"
                  >
                    View Secure History
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-4 lg:p-5 rounded-[18px] lg:rounded-[22px] transition-all duration-700 flex items-center justify-center gap-3 lg:gap-0 group relative ${
      active ? 'bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.2)] md:scale-110' : 'text-white/10 hover:text-white/30 hover:bg-white/[0.02]'
    }`}
  >
    {React.cloneElement(icon, { className: "w-5 h-5 lg:w-6 lg:h-6" })}
    <span className="lg:hidden text-[10px] font-black uppercase tracking-widest font-rajdhani">{label}</span>
    <span className={`absolute left-24 bg-white text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap pointer-events-none hidden lg:block font-rajdhani`}>
      {label}
    </span>
    {active && (
      <motion.div layoutId="nav-glow-peak" className="absolute inset-0 rounded-[22px] bg-white/5 blur-2xl z-[-1]" />
    )}
  </button>
);

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Activity, LogOut, ChevronRight, Moon, History, Zap, CheckCircle2, RefreshCcw, User } from 'lucide-react';

import InputCard from '../components/InputCard';
import ResultCard from '../components/ResultCard';
import ActionPlan from '../components/ActionPlan';
import NightUpdate from '../components/NightUpdate';
import HistorySection from '../components/HistorySection';

const API_URL = 'http://127.0.0.1:8000';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('coach'); // 'coach', 'night', 'history'
  const [logs, setLogs] = useState([]);
  const [user, setUser] = useState(null);
  
  // Persistence state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [nightLog, setNightLog] = useState(null);
  const [localHistory, setLocalHistory] = useState([]);

  useEffect(() => {
    const isAuth = localStorage.getItem('praj_auth');
    const userData = localStorage.getItem('praj_user');
    
    if (!isAuth || !userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
    
    loadPersistedData();
    fetchLogs();
  }, [navigate]);

  const loadPersistedData = () => {
    const today = new Date().toLocaleDateString('en-CA');
    
    const savedData = JSON.parse(localStorage.getItem(`praj_data_${today}`));
    const savedPlan = JSON.parse(localStorage.getItem(`praj_plan_${today}`));
    const savedNight = JSON.parse(localStorage.getItem(`praj_night_${today}`));
    const savedHistory = JSON.parse(localStorage.getItem('praj_local_history')) || [];

    if (savedData) {
      setResult(savedData.result);
      setFormData(savedData.formData);
    }
    
    if (savedPlan) setSelectedPlan(savedPlan);
    if (savedNight) setNightLog(savedNight);
    setLocalHistory(savedHistory);
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/logs`);
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 6 PM Data - Biometrics REMOVED (pulled from user profile)
  const [formData, setFormData] = useState({
    food: '', dinner: '', steps: '', activity_type: 'none', duration: '', energy: 'normal'
  });

  // Time Gating Logic
  const BYPASS_TIME_GATING = true; 
  
  const getCurrentHour = () => new Date().getHours();
  const isCoachTime = BYPASS_TIME_GATING || getCurrentHour() >= 18;
  const isNightTime = BYPASS_TIME_GATING || getCurrentHour() >= 22;

  const isDayClosed = !!nightLog;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...formData,
      user_id: user?.id,
      steps: parseInt(formData.steps) || 0,
      duration: parseInt(formData.duration) || 0
    };

    try {
      const response = await axios.post(`${API_URL}/coach`, payload);
      const today = new Date().toLocaleDateString('en-CA');
      
      const sessionData = {
        formData,
        result: response.data,
        timestamp: Date.now()
      };
      
      localStorage.setItem(`praj_data_${today}`, JSON.stringify(sessionData));
      setResult(response.data);
    } catch (error) {
      console.error("API Error", error);
      alert("Diagnostic Failure. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (selection) => {
    const today = new Date().toLocaleDateString('en-CA');
    const planWithTime = {
      ...selection,
      timestamp: Date.now()
    };
    localStorage.setItem(`praj_plan_${today}`, JSON.stringify(planWithTime));
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

    const savedHistory = JSON.parse(localStorage.getItem('praj_local_history')) || [];
    const updatedHistory = [...savedHistory.filter(h => h.date !== today), dailyReport];
    
    localStorage.setItem(`praj_night_${today}`, JSON.stringify(finalResult));
    localStorage.setItem('praj_local_history', JSON.stringify(updatedHistory));
    
    setNightLog(finalResult);
    setLocalHistory(updatedHistory);
    fetchLogs();
  };

  const handleLogout = () => {
    localStorage.removeItem('praj_auth');
    localStorage.removeItem('praj_user');
    navigate('/login');
  };

  const handleResetDay = () => {
    if (window.confirm("Purge all diagnostic data for today?")) {
      const today = new Date().toLocaleDateString('en-CA');
      localStorage.removeItem(`praj_data_${today}`);
      localStorage.removeItem(`praj_plan_${today}`);
      localStorage.removeItem(`praj_night_${today}`);
      
      setResult(null);
      setSelectedPlan(null);
      setNightLog(null);
      setFormData({
        food: '', dinner: '', steps: '', activity_type: 'none', duration: '', energy: 'normal'
      });
      setActiveTab('coach');
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] flex flex-col lg:flex-row relative overflow-hidden font-inter selection:bg-white selection:text-black">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/[0.03] blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/[0.03] blur-[120px] pointer-events-none z-0" />
      
      {/* Premium Sidebar */}
      <nav className="w-full lg:w-28 lg:h-screen lg:flex lg:flex-col lg:border-r lg:border-white/5 bg-black/40 backdrop-blur-3xl z-30 lg:justify-between p-8">
        <div className="flex lg:flex-col items-center justify-between lg:justify-center gap-12">
          <motion.div whileHover={{ scale: 1.05 }} className="w-14 h-14 rounded-[20px] bg-white text-black flex items-center justify-center shadow-[0_10px_40px_rgba(255,255,255,0.1)]">
            <Activity className="w-8 h-8" />
          </motion.div>
          
          <div className="flex lg:flex-col gap-8">
            <NavItem icon={<Zap />} label="Core Scan" active={activeTab === 'coach'} onClick={() => setActiveTab('coach')} />
            <NavItem icon={<Moon />} label="Shutdown" active={activeTab === 'night'} onClick={() => setActiveTab('night')} />
            <NavItem icon={<History />} label="Archives" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          </div>

          <div className="lg:mt-auto flex lg:flex-col gap-6 pt-10 border-t border-white/5">
            <div className="flex items-center justify-center p-4 text-white/10" title={user?.name}>
                <User className="w-5 h-5" />
            </div>
            <button 
              onClick={handleResetDay} 
              className="p-4 text-white/10 hover:text-rose-500 transition-all hover:bg-rose-500/5 rounded-2xl"
              title="Purge Sequence"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
            <button onClick={handleLogout} className="p-4 text-white/10 hover:text-white transition-all hover:bg-white/5 rounded-2xl">
              <LogOut className="w-5 h-5" />
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
             <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-[10vw] font-rajdhani font-black leading-none tracking-tighter text-white transform translate-y-[-15px]">PRAJ</motion.div>
          </div>
          <div className="mt-12 h-0.5 w-16 bg-white/10" />
          <p className="mt-8 text-white/20 text-[10px] font-black uppercase tracking-[1em] leading-loose font-rajdhani">Automated Protocol Core</p>
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

              {activeTab === 'history' && (
                <HistorySection 
                  key="history"
                  logs={logs} 
                  localHistory={localHistory}
                  onRefresh={fetchLogs} 
                />
              )}
            </AnimatePresence>

            {/* Final Lock Overlay */}
            {isDayClosed && activeTab !== 'history' && (
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
    className={`p-5 rounded-[22px] transition-all duration-700 flex items-center justify-center group relative ${
      active ? 'bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.2)] scale-110' : 'text-white/10 hover:text-white/30 hover:bg-white/[0.02]'
    }`}
  >
    {React.cloneElement(icon, { className: "w-6 h-6" })}
    <span className={`absolute left-24 bg-white text-black px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap pointer-events-none hidden lg:block font-rajdhani`}>
      {label}
    </span>
    {active && (
      <motion.div layoutId="nav-glow-peak" className="absolute inset-0 rounded-[22px] bg-white/5 blur-2xl z-[-1]" />
    )}
  </button>
);

export default Dashboard;

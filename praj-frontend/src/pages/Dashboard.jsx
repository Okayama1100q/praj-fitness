import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Activity, LogOut, ChevronRight, Moon, History, Zap, CheckCircle2 } from 'lucide-react';

import InputForm from '../components/InputForm';
import ResultCard from '../components/ResultCard';
import OptionsCard from '../components/OptionsCard';
import NightUpdate from '../components/NightUpdate';
import HistorySection from '../components/HistorySection';

const API_URL = 'http://127.0.0.1:8000';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('coach'); // 'coach', 'night', 'history'
  const [logs, setLogs] = useState([]);
  
  // Persistence state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [nightLog, setNightLog] = useState(null);
  const [localHistory, setLocalHistory] = useState([]);

  useEffect(() => {
    const isAuth = localStorage.getItem('praj_auth');
    if (!isAuth) {
      navigate('/login');
    }
    
    // Load local storage states
    loadPersistedData();
    fetchLogs();
  }, [navigate]);

  const loadPersistedData = () => {
    const today = new Date().toLocaleDateString('en-CA');
    
    const savedPlan = JSON.parse(localStorage.getItem(`praj_plan_${today}`));
    const savedNight = JSON.parse(localStorage.getItem(`praj_night_${today}`));
    const savedHistory = JSON.parse(localStorage.getItem('praj_local_history')) || [];

    // Check for 12h expiry (though here we use date-keying as it's a daily app)
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

  // 6 PM Data
  const [formData, setFormData] = useState({
    food: '', dinner: '', steps: '', activity_type: 'none', duration: '', energy: 'normal', weight: '70', height: '175', age: '25'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    const payload = {
      ...formData,
      steps: parseInt(formData.steps) || 0,
      duration: parseInt(formData.duration) || 0,
      weight: parseFloat(formData.weight) || 70,
      height: parseFloat(formData.height) || 175,
      age: parseInt(formData.age) || 25,
    };

    try {
      const response = await axios.post(`${API_URL}/coach`, payload);
      setResult(response.data);
    } catch (error) {
      console.error("API Error", error);
      alert("Failed to get recommendation from Praj. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (selection) => {
    const today = new Date().toLocaleDateString('en-CA');
    localStorage.setItem(`praj_plan_${today}`, JSON.stringify(selection));
    setSelectedPlan(selection);
  };

  const handleNightUpdate = (finalResult) => {
    // Robust date generation to match backend YYYY-MM-DD
    const now = new Date();
    const today = now.toLocaleDateString('en-CA'); // en-CA format is YYYY-MM-DD
    
    // Save daily entry to local history for detailed view
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
    fetchLogs(); // Sync with backend immediately
  };

  const handleLogout = () => {
    localStorage.removeItem('praj_auth');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#060608] flex flex-col lg:flex-row relative overflow-hidden selection:bg-white selection:text-black">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none z-0" />
      
      {/* Sidebar Navigation */}
      <nav className="w-full lg:w-24 lg:h-screen lg:flex lg:flex-col lg:border-r lg:border-white/5 bg-black/20 backdrop-blur-3xl z-30 lg:justify-between p-6">
        <div className="flex lg:flex-col items-center justify-between lg:justify-center gap-10">
          <motion.div whileHover={{ scale: 1.1 }} className="w-14 h-14 rounded-[22px] bg-white text-black flex items-center justify-center font-bold shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
            <Activity className="w-8 h-8" />
          </motion.div>
          
          <div className="flex lg:flex-col gap-6">
            <NavItem icon={<Zap />} label="Coach" active={activeTab === 'coach'} onClick={() => setActiveTab('coach')} />
            <NavItem icon={<Moon />} label="Night" active={activeTab === 'night'} onClick={() => setActiveTab('night')} />
            <NavItem icon={<History />} label="Progress" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          </div>

          <button onClick={handleLogout} className="lg:mt-auto p-4 text-white/20 hover:text-white transition-all hover:bg-white/5 rounded-2xl">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* Left Typographic Side */}
        <div className="hidden lg:flex w-2/5 min-h-screen flex-col justify-center pl-16 pointer-events-none select-none">
          <div className="space-y-0">
             <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 0.15, x: 0 }} className="text-[9vw] font-black leading-none tracking-tighter">FITNESS</motion.div>
             <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 0.15, x: 0 }} transition={{ delay: 0.1 }} className="text-[9vw] font-black leading-none tracking-tighter text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.5)' }}>BALANCE</motion.div>
             <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-[9vw] font-black leading-none tracking-tighter bg-gradient-to-br from-white via-white to-white/20 bg-clip-text text-transparent transform translate-y-[-10px]">PRAJ</motion.div>
          </div>
          <div className="mt-12 h-0.5 w-12 bg-white/10" />
          <p className="mt-8 text-white/20 text-xs font-bold uppercase tracking-[0.5em] leading-loose">Automated Intelligence<br/>for Human Potential</p>
        </div>

        {/* Main Interaction Area */}
        <main className="flex-1 min-h-screen flex items-start justify-center p-4 lg:p-12 overflow-y-auto custom-scrollbar pt-28 lg:pt-12">
          <div className="w-full max-w-2xl pb-12">
            <AnimatePresence mode="wait">
              {activeTab === 'coach' && (
                <motion.div 
                  key="coach"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {!result ? (
                    <InputForm 
                      formData={formData} 
                      handleChange={handleChange} 
                      handleSubmit={handleSubmit} 
                      loading={loading} 
                    />
                  ) : (
                    <div className="space-y-8 pb-10">
                      <ResultCard result={result} onReset={() => setResult(null)} />
                      <OptionsCard 
                        options={result.options} 
                        onSelect={handlePlanSelect} 
                        forceSelectedPlan={selectedPlan}
                      />
                      
                      {selectedPlan && (
                        <motion.div 
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="flex flex-col items-center py-6 text-center"
                        >
                           <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                             <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                           </div>
                           <p className="text-white/40 text-sm font-medium">Head to the Night Update tab when you finish your day.</p>
                           <button onClick={() => setActiveTab('night')} className="mt-4 text-emerald-400 text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-2">
                             Go to Night Flow <ChevronRight className="w-4 h-4" />
                           </button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'night' && (
                <NightUpdate 
                  key="night"
                  onUpdate={handleNightUpdate}
                  result={result}
                  selectedPlan={selectedPlan}
                  nightLog={nightLog}
                />
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
          </div>
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-[20px] transition-all duration-500 flex items-center justify-center group relative ${
      active ? 'bg-white text-black shadow-2xl scale-105' : 'text-white/20 hover:text-white/40 hover:bg-white/5'
    }`}
  >
    {React.cloneElement(icon, { className: "w-6 h-6" })}
    <span className={`absolute left-20 bg-white text-black px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden lg:block`}>
      {label}
    </span>
    {active && (
      <motion.div layoutId="nav-glow-enhanced" className="absolute inset-0 rounded-[20px] bg-white/10 blur-xl z-[-1]" />
    )}
  </button>
);

export default Dashboard;

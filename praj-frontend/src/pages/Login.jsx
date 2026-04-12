import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Button } from '../components/Shared';
import { Activity, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { request } from '@/config/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [spinupMessage, setSpinupMessage] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('praj_auth')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Timer to show spin-up message if request takes > 3s
    const timer = setTimeout(() => setSpinupMessage(true), 3000);
    
    try {
      const response = await request({
        method: 'POST',
        url: '/login',
        data: formData
      });
      
      if (response.data.access_token) {
        localStorage.setItem('praj_auth', response.data.access_token);
        localStorage.setItem('praj_user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Login diagnostic failure:", err);
      setError(err.response?.data?.detail || "Authorization link unstable. Verify server status.");
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setSpinupMessage(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#060608]">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/[0.02] blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-10 glass-card-peak z-10 mx-4"
      >
        <div className="flex justify-center mb-10">
          <div className="w-16 h-16 rounded-[22px] bg-white text-black flex items-center justify-center shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
            <Activity className="w-8 h-8" />
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-3 uppercase font-rajdhani">Secure Link</h1>
          <p className="text-white/20 font-black text-xs tracking-[0.2em] md:tracking-[0.5em] uppercase font-rajdhani">Establishing Diagnostic Connection</p>
        </div>

        {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold text-center uppercase tracking-widest">
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
            <div className="relative group">
                <Mail className="absolute left-4 top-[3.25rem] w-4 h-4 text-white/10 group-focus-within:text-white/40 z-20" />
                <Input 
                    label="Email Address" 
                    type="email" 
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-12"
                />
            </div>
            <div className="relative group">
                <Lock className="absolute left-4 top-[3.25rem] w-4 h-4 text-white/10 group-focus-within:text-white/40 z-20" />
                <Input 
                    label="Authorization Code" 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-12 pr-12"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[3.25rem] text-white/10 hover:text-white/40 z-20 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            <AnimatePresence>
              {spinupMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-black text-white/40 uppercase tracking-[0.2em] text-center"
                >
                  Backend is spinning up. Please wait...
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" className="mt-8" loading={loading}>
                Access Protocol
            </Button>
        </form>

        <p className="text-center mt-10 text-sm text-white/20 font-bold uppercase tracking-widest">
          No profile found?{' '}
          <Link to="/register" className="text-white hover:underline">
            Register Biometrics
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

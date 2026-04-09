import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input, Button } from '../components/Shared';
import { Activity, Mail, Lock } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      if (response.data.error) {
        setError(response.data.error);
      } else {
        localStorage.setItem('praj_auth', response.data.access_token);
        localStorage.setItem('praj_user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError("Login failed. Is backend running?");
    } finally {
      setLoading(false);
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
          <p className="text-white/20 font-black text-[10px] tracking-[0.5em] uppercase font-rajdhani">Establishing Diagnostic Connection</p>
        </div>

        {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center uppercase tracking-widest">
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
            <div className="relative group">
                <Mail className="absolute left-4 top-[3.25rem] w-4 h-4 text-white/10 group-focus-within:text-white/40 z-20" />
                <Input 
                    label="Email Address" 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12"
                />
            </div>
            <div className="relative group">
                <Lock className="absolute left-4 top-[3.25rem] w-4 h-4 text-white/10 group-focus-within:text-white/40 z-20" />
                <Input 
                    label="Authorization Code" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-12"
                />
            </div>
            <Button type="submit" className="mt-8" loading={loading}>
                Access Protocol
            </Button>
        </form>

        <p className="text-center mt-10 text-xs text-white/20 font-bold uppercase tracking-widest">
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

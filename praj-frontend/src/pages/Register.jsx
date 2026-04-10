import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Button } from '../components/Shared';
import { Activity, User, Phone, Mail, Lock, Weight, Ruler, Calendar } from 'lucide-react';
import { request } from '@/config/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    password: '',
    weight: '',
    height: '',
    age: ''
  });
  const [loading, setLoading] = useState(false);
  const [spinupMessage, setSpinupMessage] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Timer to show spin-up message if request takes > 3s
    const timer = setTimeout(() => setSpinupMessage(true), 3000);
    
    try {
      const response = await request({
        method: 'POST',
        url: '/register',
        data: formData
      });
      
      if (response.data.error) {
        setError(response.data.error);
      } else {
        alert("Account created successfully! Please log in.");
        navigate('/login');
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.detail || "Network diagnostic failed. Verify backend connectivity.");
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setSpinupMessage(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#060608] py-12">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/[0.02] blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl p-10 glass-card-peak z-10 mx-4"
      >
        <div className="flex justify-center mb-10">
          <div className="w-16 h-16 rounded-[22px] bg-white text-black flex items-center justify-center shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
            <Activity className="w-8 h-8" />
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-3 uppercase font-rajdhani">Praj Protocol</h1>
          <p className="text-white/20 font-black text-[10px] tracking-[0.5em] uppercase font-rajdhani">Biometric Alignment Sequence</p>
        </div>

        {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center uppercase tracking-widest">
                {error}
            </div>
        )}

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
                <User className="absolute left-4 top-[3.25rem] w-4 h-4 text-white/10 group-focus-within:text-white/40 z-20" />
                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required className="pl-12" />
            </div>
            <div className="relative group">
                <Phone className="absolute left-4 top-[3.25rem] w-4 h-4 text-white/10 group-focus-within:text-white/40 z-20" />
                <Input label="Phone" name="number" value={formData.number} onChange={handleChange} required className="pl-12" />
            </div>
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-[3.25rem] w-4 h-4 text-white/10 group-focus-within:text-white/40 z-20" />
            <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required className="pl-12" />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-[3.25rem] w-4 h-4 text-white/10 group-focus-within:text-white/40 z-20" />
            <Input label="Secure Password" name="password" type="password" value={formData.password} onChange={handleChange} required className="pl-12" />
          </div>

          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/5 mt-4">
            <div className="relative group">
                <Weight className="absolute left-4 top-[3.25rem] w-4 h-4 text-white/10 group-focus-within:text-white/40 z-20" />
                <Input label="kg" name="weight" type="number" value={formData.weight} onChange={handleChange} required className="pl-10" />
            </div>
            <div className="relative group">
                <Ruler className="absolute left-4 top-[3.25rem] w-4 h-4 text-white/10 group-focus-within:text-white/40 z-20" />
                <Input label="cm" name="height" type="number" value={formData.height} onChange={handleChange} required className="pl-10" />
            </div>
            <div className="relative group">
                <Calendar className="absolute left-4 top-[3.25rem] w-4 h-4 text-white/10 group-focus-within:text-white/40 z-20" />
                <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required className="pl-10" />
            </div>
          </div>

          <AnimatePresence>
            {spinupMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-8 p-4 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-center"
              >
                Backend is spinning up. Please wait...
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" className="mt-6" loading={loading}>
            Initialize Profile
          </Button>
        </form>

        <p className="text-center mt-10 text-xs text-white/20 font-bold uppercase tracking-widest">
          Already aligned?{' '}
          <Link to="/login" className="text-white hover:underline">
            Establish Link
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

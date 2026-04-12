import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Weight, Ruler, Calendar, Loader2 } from 'lucide-react';
import { request } from '@/config/api';

const AdminSection = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await request({
        method: 'GET',
        url: '/users'
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Admin datalink failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-white/40">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="mb-10 space-y-4">
        <h2 className="text-4xl font-rajdhani font-black tracking-tighter uppercase">Admin Console</h2>
        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Total Active Subjects: {users.length}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {users.map((u) => (
          <div key={u.id} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center hover:bg-white/[0.03] transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[20px] bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <Users className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-rajdhani font-black uppercase text-white tracking-wide">{u.name}</h3>
                <div className="flex flex-wrap gap-4 text-xs font-bold text-white/40 tracking-widest">
                  <span className="flex items-center gap-2"><Mail className="w-3 h-3" /> {u.email}</span>
                  <span className="flex items-center gap-2"><Phone className="w-3 h-3" /> {u.number}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <div className="px-5 py-3 rounded-2xl bg-black/40 flex items-center gap-3">
                <Weight className="w-4 h-4 text-indigo-400" />
                <span className="text-white font-black font-rajdhani">{u.weight} kg</span>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-black/40 flex items-center gap-3">
                <Ruler className="w-4 h-4 text-amber-400" />
                <span className="text-white font-black font-rajdhani">{u.height} cm</span>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-black/40 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-black font-rajdhani">{u.age} y</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminSection;

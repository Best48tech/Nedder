import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../components/UI';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  FileText, 
  GraduationCap, 
  LayoutGrid,
  TrendingUp,
  LogOut,
  Bell
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const Dashboard = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const menuItems = [
    { label: 'غيابات اليوم', count: stats?.absences || 0, icon: Users, color: 'dz-green', path: '/absences' },
    { label: 'تأخرات اليوم', count: stats?.lates || 0, icon: Clock, color: 'orange-500', path: '/lates' },
    { label: 'حوادث مدرسية', count: stats?.incidents || 0, icon: AlertTriangle, color: 'dz-red', path: '/incidents' },
    { label: 'التقرير اليومي', count: null, icon: FileText, color: 'blue-500', path: '/reports' },
    { label: 'قائمة التلاميذ', count: stats?.students || 0, icon: GraduationCap, color: 'slate-700', path: '/students' },
    { label: 'الأقسام', count: stats?.classes || 0, icon: LayoutGrid, color: 'indigo-500', path: '/classes' },
  ];

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-dz-green rounded-2xl flex items-center justify-center text-white shadow-lg shadow-dz-green/20 relative">
            <div className="absolute w-8 h-8 bg-dz-red rounded-full opacity-90" />
            <GraduationCap size={24} className="relative z-10" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">مرحباً، {user.username}</h1>
            <p className="text-sm text-slate-500 font-bold">{user.institution}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
            <Bell size={20} />
          </button>
          <button 
            onClick={onLogout}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-dz-red shadow-sm border border-slate-100"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <section className="mb-8">
        <div className="bg-dz-green rounded-3xl p-6 text-white shadow-xl shadow-dz-green/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-dz-white/80 font-bold text-sm mb-1">إحصائيات عامة</p>
            <h2 className="text-3xl font-black mb-4">نظرة عامة اليوم</h2>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex-1">
                <p className="text-xs font-bold opacity-80">نسبة الغياب</p>
                <p className="text-xl font-black">12.5%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex-1">
                <p className="text-xs font-bold opacity-80">الانضباط</p>
                <p className="text-xl font-black">جيد جداً</p>
              </div>
            </div>
          </div>
          <TrendingUp className="absolute -left-4 -bottom-4 text-white/10 w-32 h-32" />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        {menuItems.map((item, idx) => (
          <Link key={idx} to={item.path}>
            <Card className="h-full flex flex-col items-center justify-center text-center p-6 hover:border-dz-green transition-all group">
              <div className={`w-12 h-12 rounded-2xl mb-3 flex items-center justify-center bg-slate-50 group-hover:bg-dz-green/10 transition-colors`}>
                <item.icon className={`text-${item.color}`} size={24} />
              </div>
              <h3 className="text-sm font-black text-slate-700 mb-1">{item.label}</h3>
              {item.count !== null && (
                <Badge color={item.count > 10 ? 'red' : 'green'}>
                  {item.count}
                </Badge>
              )}
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
};

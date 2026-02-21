import React, { useState } from 'react';
import { Button, Card } from '../components/UI';
import { User, Lock, Building2, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export const Login = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CPE' | 'Principal'>('CPE');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-dz-green rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-dz-green/20 relative">
            <div className="absolute w-16 h-16 bg-dz-red rounded-full opacity-90" />
            <GraduationCap size={48} className="text-white relative z-10" />
          </div>
          <h1 className="text-2xl font-black text-dz-green mb-1">تطبيق مستشار التربية</h1>
          <p className="text-slate-500 font-medium">وزارة التربية الوطنية - الجزائر</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setRole('CPE')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'CPE' ? 'bg-white text-dz-green shadow-sm' : 'text-slate-500'}`}
              >
                مستشار التربية
              </button>
              <button
                type="button"
                onClick={() => setRole('Principal')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'Principal' ? 'bg-white text-dz-green shadow-sm' : 'text-slate-500'}`}
              >
                مدير المؤسسة
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="اسم المستخدم"
                  className="w-full pr-12 pl-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-dz-green/20 focus:border-dz-green outline-none transition-all font-bold"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  className="w-full pr-12 pl-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-dz-green/20 focus:border-dz-green outline-none transition-all font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-dz-red text-sm font-bold text-center">{error}</p>
            )}

            <Button type="submit" fullWidth loading={loading}>
              تسجيل الدخول
            </Button>

            <button type="button" className="w-full text-slate-400 text-sm font-bold hover:text-dz-green transition-colors">
              نسيت كلمة المرور؟
            </button>

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm font-bold">
                ليس لديك حساب؟{" "}
                <button type="button" className="text-dz-green hover:underline">
                  سجل الآن
                </button>
              </p>
            </div>
          </form>
        </Card>

        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
          <Building2 size={16} />
          <span className="text-xs font-bold">المؤسسة التعليمية الرقمية</span>
        </div>
      </motion.div>
    </div>
  );
};

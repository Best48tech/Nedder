import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../components/UI';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export const Stats = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Mock data for charts
    setData({
      weeklyAbsences: [
        { name: 'الأحد', count: 12 },
        { name: 'الاثنين', count: 8 },
        { name: 'الثلاثاء', count: 15 },
        { name: 'الأربعاء', count: 5 },
        { name: 'الخميس', count: 10 },
      ],
      levelStats: [
        { name: 'الأولى', value: 400 },
        { name: 'الثانية', value: 300 },
        { name: 'الثالثة', value: 200 },
        { name: 'الرابعة', value: 100 },
      ]
    });
  }, []);

  const COLORS = ['#006233', '#D21034', '#F27D26', '#1e293b'];

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 mb-1">الإحصائيات</h1>
        <p className="text-slate-500 font-bold">تحليل بياني لنسب الغياب والانضباط</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 bg-dz-green text-white">
          <TrendingUp size={20} className="mb-2 opacity-80" />
          <p className="text-[10px] font-bold opacity-80">أعلى غياب</p>
          <p className="text-lg font-black">الثلاثاء</p>
        </Card>
        <Card className="p-4 bg-slate-800 text-white">
          <Activity size={20} className="mb-2 opacity-80" />
          <p className="text-[10px] font-bold opacity-80">مؤشر الانضباط</p>
          <p className="text-lg font-black">92%</p>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
          <TrendingDown size={18} className="text-dz-green" />
          الغيابات الأسبوعية
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.weeklyAbsences}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} 
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="count" fill="#006233" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-black text-slate-800 mb-6">توزيع الغيابات حسب المستوى</h3>
        <div className="h-64 w-full flex items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data?.levelStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data?.levelStats.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2">
            {data?.levelStats.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-[10px] font-bold text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

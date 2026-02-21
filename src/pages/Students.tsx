import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../components/UI';
import { Search, UserX, Clock, User, Filter } from 'lucide-react';

export const Students = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all students (simplified)
    fetch('/api/classes')
      .then(res => res.json())
      .then(async (classes) => {
        const allStudents: any[] = [];
        for (const cls of classes) {
          const res = await fetch(`/api/students/${cls.id}`);
          const data = await res.json();
          allStudents.push(...data.map((s: any) => ({ ...s, className: cls.name })));
        }
        setStudents(allStudents);
        setLoading(false);
      });
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.includes(search) || s.className.includes(search)
  );

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 mb-1">قاعدة بيانات التلاميذ</h1>
        <p className="text-slate-500 font-bold">البحث والاطلاع على سجلات التلاميذ</p>
      </header>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="ابحث بالاسم أو القسم..."
            className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-dz-green/20"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
          <Filter size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold">جاري تحميل البيانات...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-bold">لا توجد نتائج مطابقة</div>
        ) : (
          filteredStudents.map((student) => (
            <Card key={student.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
                  <User size={28} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-slate-800">{student.name}</h3>
                    <Badge color="blue">{student.className}</Badge>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <UserX size={14} />
                      الغيابات: {student.total_absences}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <Clock size={14} />
                      التأخرات: {student.total_lates}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2">
                <button className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold">
                  الملف الكامل
                </button>
                <button className="flex-1 py-2 bg-slate-50 text-dz-green rounded-lg text-xs font-bold">
                  اتصال بالولي
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

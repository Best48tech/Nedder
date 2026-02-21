import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { FileText, Plus, Save, History, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export const Reports = () => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [reports, setReports] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    absences_count: 0,
    lates_count: 0,
    incidents: '',
    notes: ''
  });

  useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => setReports(data));
      
    // Fetch today's stats for the form
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setFormData(prev => ({
          ...prev,
          absences_count: data.absences,
          lates_count: data.lates
        }));
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        date: new Date().toISOString().split('T')[0]
      }),
    });
    if (res.ok) {
      setView('list');
      // Refresh list
      fetch('/api/reports').then(res => res.json()).then(data => setReports(data));
    }
  };

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">التقارير اليومية</h1>
          <p className="text-slate-500 font-bold">توثيق النشاط اليومي للمؤسسة</p>
        </div>
        <button 
          onClick={() => setView(view === 'list' ? 'create' : 'list')}
          className="w-12 h-12 bg-dz-green text-white rounded-2xl flex items-center justify-center shadow-lg shadow-dz-green/20"
        >
          {view === 'list' ? <Plus size={24} /> : <History size={24} />}
        </button>
      </header>

      {view === 'list' ? (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold">لا توجد تقارير مسجلة بعد</p>
            </div>
          ) : (
            reports.map((report) => (
              <Card key={report.id} className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-slate-800">
                    تقرير يوم {format(new Date(report.date), 'eeee dd MMMM yyyy', { locale: ar })}
                  </h3>
                  <Badge color="green">مكتمل</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold mb-1">الغيابات</p>
                    <p className="text-lg font-black text-dz-red">{report.absences_count}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold mb-1">التأخرات</p>
                    <p className="text-lg font-black text-orange-500">{report.lates_count}</p>
                  </div>
                </div>
                {report.incidents && (
                  <div className="mb-3">
                    <p className="text-xs font-bold text-slate-400 mb-1">الحوادث:</p>
                    <p className="text-sm text-slate-600">{report.incidents}</p>
                  </div>
                )}
                <Button variant="ghost" className="w-full py-2 text-xs border border-slate-100">
                  تحميل بصيغة PDF
                </Button>
              </Card>
            ))
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-dz-green mb-2">
              <FileText size={20} />
              <h2 className="font-black">إنشاء تقرير جديد</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">عدد الغيابات</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-black"
                  value={formData.absences_count}
                  onChange={e => setFormData({...formData, absences_count: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">عدد التأخرات</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-black"
                  value={formData.lates_count}
                  onChange={e => setFormData({...formData, lates_count: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">الحوادث والوقائع</label>
              <textarea 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-24 text-sm"
                placeholder="سجل أي حوادث وقعت اليوم..."
                value={formData.incidents}
                onChange={e => setFormData({...formData, incidents: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">ملاحظات إضافية</label>
              <textarea 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-24 text-sm"
                placeholder="أي ملاحظات أخرى..."
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </Card>

          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-3">
            <AlertCircle className="text-orange-500 shrink-0" size={20} />
            <p className="text-xs text-orange-700 font-medium leading-relaxed">
              سيتم حفظ هذا التقرير كوثيقة رسمية. يرجى التأكد من دقة المعلومات المدخلة قبل الحفظ.
            </p>
          </div>

          <Button type="submit" fullWidth className="flex items-center justify-center gap-2">
            <Save size={20} />
            حفظ التقرير النهائي
          </Button>
        </form>
      )}
    </div>
  );
};

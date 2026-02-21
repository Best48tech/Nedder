import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Clock, ChevronLeft, Search, AlertCircle } from 'lucide-react';

export const LateArrivals = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/classes')
      .then(res => res.json())
      .then(data => setClasses(data));
  }, []);

  const handleSelectClass = async (cls: any) => {
    setSelectedClass(cls);
    setLoading(true);
    try {
      const res = await fetch(`/api/students/${cls.id}`);
      const data = await res.json();
      setStudents(data);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkLate = async (studentId: number) => {
    setMarking(studentId);
    try {
      await fetch('/api/lates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          date: new Date().toISOString()
        }),
      });
      handleSelectClass(selectedClass);
    } finally {
      setMarking(null);
    }
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 mb-1">تسجيل التأخرات</h1>
        <p className="text-slate-500 font-bold">رصد تأخر التلاميذ عن الحصص</p>
      </header>

      {!selectedClass ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {classes.map((cls) => (
              <Card 
                key={cls.id} 
                onClick={() => handleSelectClass(cls)}
                className="flex justify-between items-center p-5"
              >
                <span className="font-black text-slate-700">{cls.name}</span>
                <ChevronLeft className="text-slate-300" />
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSelectedClass(null)}
              className="text-dz-green font-bold flex items-center gap-1"
            >
              <ChevronLeft className="rotate-180" size={20} />
              العودة للأقسام
            </button>
            <Badge color="orange">{selectedClass.name}</Badge>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-slate-400 font-bold">جاري التحميل...</div>
            ) : (
              students.map((student) => (
                <Card key={student.id} className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-slate-800">{student.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge color={student.total_lates >= 3 ? 'red' : 'orange'}>
                        <Clock size={12} className="ml-1 inline" />
                        التأخرات: {student.total_lates}
                      </Badge>
                      {student.total_lates >= 3 && (
                        <span className="text-[10px] text-dz-red font-bold flex items-center gap-0.5">
                          <AlertCircle size={12} />
                          يجب استدعاء الولي
                        </span>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="secondary" 
                    className="px-4 py-2 text-xs"
                    onClick={() => handleMarkLate(student.id)}
                    disabled={marking === student.id}
                  >
                    <Clock size={14} className="ml-1 inline" />
                    تسجيل تأخر
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

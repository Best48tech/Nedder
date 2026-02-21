import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Search, ChevronLeft, CheckCircle2, XCircle, UserX, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Absences = () => {
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

  const handleMarkAbsence = async (studentId: number, justified: boolean = false) => {
    setMarking(studentId);
    try {
      await fetch('/api/absences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          date: new Date().toISOString().split('T')[0],
          justified
        }),
      });
      // Refresh student list to show updated counts (optional)
      handleSelectClass(selectedClass);
    } finally {
      setMarking(null);
    }
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 mb-1">إدارة الغيابات</h1>
        <p className="text-slate-500 font-bold">تسجيل غيابات التلاميذ اليومية</p>
      </header>

      {!selectedClass ? (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-700">اختر القسم</h2>
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
            <Badge color="blue">{selectedClass.name}</Badge>
          </div>

          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="البحث عن تلميذ..."
              className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-dz-green/20"
            />
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-slate-400 font-bold">جاري التحميل...</div>
            ) : (
              students.map((student) => (
                <Card key={student.id} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-slate-800">{student.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge color="red">
                          <UserX size={12} className="ml-1 inline" />
                          الغيابات: {student.total_absences}
                        </Badge>
                        <Badge color="orange">
                          <Clock size={12} className="ml-1 inline" />
                          التأخرات: {student.total_lates}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="danger" 
                      className="flex-1 py-2 text-sm"
                      onClick={() => handleMarkAbsence(student.id, false)}
                      disabled={marking === student.id}
                    >
                      <XCircle size={16} className="ml-2 inline" />
                      تسجيل غياب
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="flex-1 py-2 text-sm"
                      onClick={() => handleMarkAbsence(student.id, true)}
                      disabled={marking === student.id}
                    >
                      <CheckCircle2 size={16} className="ml-2 inline" />
                      غياب مبرر
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

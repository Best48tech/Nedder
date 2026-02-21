import { Home, Users, Clock, FileText, BarChart2, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

export const BottomNav = () => {
  const navItems = [
    { icon: Home, label: 'الرئيسية', path: '/' },
    { icon: Users, label: 'الغيابات', path: '/absences' },
    { icon: Clock, label: 'التأخرات', path: '/lates' },
    { icon: FileText, label: 'التقارير', path: '/reports' },
    { icon: BarChart2, label: 'إحصائيات', path: '/stats' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center safe-bottom z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
            isActive ? "text-dz-green" : "text-slate-400"
          )}
        >
          {({ isActive }) => (
            <>
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

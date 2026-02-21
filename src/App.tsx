import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useLocation 
} from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Absences } from './pages/Absences';
import { LateArrivals } from './pages/LateArrivals';
import { Reports } from './pages/Reports';
import { Stats } from './pages/Stats';
import { Students } from './pages/Students';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen pb-20">
      {children}
      {!isLoginPage && <BottomNav />}
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/" 
            element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/absences" 
            element={user ? <Absences /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/lates" 
            element={user ? <LateArrivals /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/reports" 
            element={user ? <Reports /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/stats" 
            element={user ? <Stats /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/students" 
            element={user ? <Students /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

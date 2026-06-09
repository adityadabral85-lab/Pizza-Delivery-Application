import React, { useEffect, useState } from 'react';
import { clearSession, getStoredUser, setSession } from './lib/api.js';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';

export default function App() {
  const [user, setUser] = useState(getStoredUser());
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  function navigate(path) {
    window.history.pushState({}, '', path);
    setRoute(path);
  }

  function onAuth(token, nextUser) {
    setSession(token, nextUser);
    setUser(nextUser);
    navigate(nextUser.role === 'admin' ? '/admin' : '/dashboard');
  }

  function logout() {
    clearSession();
    setUser(null);
    navigate('/');
  }

  if (route.startsWith('/verify-email/')) {
    return <VerifyEmail token={route.split('/').pop()} navigate={navigate} />;
  }

  if (route.startsWith('/reset-password/')) {
    return <ResetPassword token={route.split('/').pop()} navigate={navigate} />;
  }

  if (!user) {
    return <AuthPage onAuth={onAuth} navigate={navigate} />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard user={user} logout={logout} />;
  }

  return <UserDashboard user={user} logout={logout} />;
}

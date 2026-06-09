import React from 'react';
import { Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { api } from '../lib/api.js';

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (mode === 'forgot') {
        const data = await api('/auth/forgot-password', { method: 'POST', body: { email: form.email } });
        setMessage(data.message);
        return;
      }
      const path = mode === 'register' ? '/auth/register' : '/auth/login';
      const data = await api(path, {
        method: 'POST',
        body: mode === 'register' ? { ...form, role } : { email: form.email, password: form.password }
      });
      onAuth(data.token, data.user);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="authPage">
      <section className="authHero">
        <div className="authCopy">
          <span className="eyebrow">Fresh from the oven</span>
          <h1>Pizza delivery that lets every slice feel custom.</h1>
          <p>Build pizzas, pay in test mode, track kitchen status, and keep ingredient stock under control.</p>
        </div>
      </section>
      <section className="authPanel">
        <div className="tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
        </div>
        <form onSubmit={submit}>
          {mode === 'register' && (
            <label>
              Full name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
          )}
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          {mode !== 'forgot' && (
            <label>
              Password
              <input type="password" minLength="8" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </label>
          )}
          {mode === 'register' && (
            <div className="roleGrid">
              <button type="button" className={role === 'user' ? 'selected' : ''} onClick={() => setRole('user')}>
                <UserRound size={18} /> User
              </button>
              <button type="button" className={role === 'admin' ? 'selected' : ''} onClick={() => setRole('admin')}>
                <ShieldCheck size={18} /> Admin
              </button>
            </div>
          )}
          <button className="primaryButton" disabled={loading}>
            {loading ? 'Working...' : mode === 'forgot' ? 'Send reset email' : mode === 'register' ? 'Create account' : 'Login'}
          </button>
        </form>
        <button className="linkButton" onClick={() => setMode(mode === 'forgot' ? 'login' : 'forgot')}>
          <Mail size={16} /> {mode === 'forgot' ? 'Back to login' : 'Forgot password?'}
        </button>
        {message && <p className="message">{message}</p>}
        <div className="demoBox">
          <strong>Demo</strong>
          <span>Admin: admin@pizzacraft.local / Admin@12345</span>
          <span>User: user@pizzacraft.local / User@12345</span>
        </div>
      </section>
    </main>
  );
}

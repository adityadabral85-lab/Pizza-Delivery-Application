import React, { useState } from 'react';
import { api } from '../lib/api.js';

export default function ResetPassword({ token, navigate }) {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      const data = await api(`/auth/reset-password/${token}`, { method: 'POST', body: { password } });
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="centerPage">
      <section className="plainPanel">
        <h1>Reset password</h1>
        <form onSubmit={submit}>
          <label>
            New password
            <input type="password" minLength="8" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button className="primaryButton">Reset</button>
        </form>
        {message && <p className="message">{message}</p>}
        <button className="linkButton" onClick={() => navigate('/')}>Back to login</button>
      </section>
    </main>
  );
}

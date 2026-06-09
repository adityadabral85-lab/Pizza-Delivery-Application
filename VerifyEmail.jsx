import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export default function VerifyEmail({ token, navigate }) {
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    api(`/auth/verify-email/${token}`)
      .then((data) => setMessage(data.message))
      .catch((error) => setMessage(error.message));
  }, [token]);

  return (
    <main className="centerPage">
      <section className="plainPanel">
        <h1>Email verification</h1>
        <p>{message}</p>
        <button className="primaryButton" onClick={() => navigate('/')}>Continue</button>
      </section>
    </main>
  );
}

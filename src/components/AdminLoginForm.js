'use client';

import { useState } from 'react';

export default function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to sign in.');
      window.location.reload();
    } catch (loginError) {
      setError(loginError.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md space-y-4">
      <label htmlFor="admin-password" className="sr-only">Admin password</label>
      <input
        id="admin-password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="w-full rounded-lg border border-[#e2d8d3] px-4 py-3"
        placeholder="Admin password"
      />
      <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-[#ff5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64a19] disabled:opacity-70">
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>
      {error ? <p role="alert" className="text-sm text-[#b94a48]">{error}</p> : null}
    </form>
  );
}
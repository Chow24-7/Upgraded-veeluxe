'use client';

import { useState } from 'react';

export default function ResendOrderEmailsButton({ reference }) {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleResend = async () => {
    setIsSending(true);
    setMessage('');
    setHasError(false);

    try {
      const response = await fetch('/api/admin/orders/resend-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to queue email resend.');
      setMessage('Email resend queued. Refresh shortly to check the status.');
    } catch (error) {
      setHasError(true);
      setMessage(error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleResend}
        disabled={isSending}
        className="rounded-full border border-[#e2d8d3] px-3 py-1 text-xs font-semibold text-[#555] transition hover:bg-[#fff5f0] disabled:opacity-60"
      >
        {isSending ? 'Queueing...' : 'Resend emails'}
      </button>
      {message ? <p role={hasError ? 'alert' : 'status'} className="mt-1 text-xs text-[#666]">{message}</p> : null}
    </div>
  );
}

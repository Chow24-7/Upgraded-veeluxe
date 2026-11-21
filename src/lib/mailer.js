import 'server-only';
import nodemailer from 'nodemailer';

let smtpFallbackWarningLogged = false;

function createEmailError(name, message, code = name) {
  const error = new Error(message);
  error.name = name;
  error.code = code;
  return error;
}

function createSmtpTransporter() {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendWithResend({ to, replyTo, subject, text, idempotencyKey }) {
  if (!process.env.EMAIL_FROM) {
    throw createEmailError('ConfigurationError', 'EMAIL_FROM is required for Resend email delivery.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    let response;
    try {
      response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM,
          to: [to],
          ...(replyTo ? { reply_to: replyTo } : {}),
          subject,
          text,
        }),
        signal: controller.signal,
      });
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw createEmailError('ResendTimeoutError', 'Resend request timed out after 10 seconds.', 'ETIMEDOUT');
      }
      throw createEmailError(
        'ResendNetworkError',
        typeof error?.message === 'string' ? error.message : 'Unable to reach Resend.',
        typeof error?.code === 'string' ? error.code : 'NETWORK_ERROR'
      );
    }

    const result = await response.json().catch((error) => {
      if (controller.signal.aborted) {
        throw createEmailError('ResendTimeoutError', 'Resend request timed out after 10 seconds.', 'ETIMEDOUT');
      }
      if (error?.name === 'AbortError') {
        throw createEmailError('ResendTimeoutError', 'Resend request timed out after 10 seconds.', 'ETIMEDOUT');
      }
      return {};
    });
    if (!response.ok) {
      const errorName = typeof result?.name === 'string' ? result.name : 'ResendError';
      const errorMessage = typeof result?.message === 'string' ? result.message : 'Resend could not send the email.';
      throw createEmailError(errorName, errorMessage, errorName);
    }

    return result;
  } finally {
    clearTimeout(timeout);
  }
}

async function sendWithSmtp({ to, replyTo, subject, text }) {
  const transporter = createSmtpTransporter();
  try {
    return await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      ...(replyTo ? { replyTo } : {}),
      subject,
      text,
    });
  } finally {
    transporter.close();
  }
}

export async function sendEmail(message) {
  if (process.env.RESEND_API_KEY) {
    return sendWithResend(message);
  }

  if (!smtpFallbackWarningLogged) {
    console.warn('RESEND_API_KEY is missing. Falling back to SMTP email delivery.');
    smtpFallbackWarningLogged = true;
  }

  return sendWithSmtp(message);
}

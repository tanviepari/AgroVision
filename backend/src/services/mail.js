import nodemailer from 'nodemailer';

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM);
}

export async function sendPasswordResetEmail({ to, resetUrl }) {
  if (!mailConfigured()) {
    return { sent: false, reason: 'Email is not set up on this server, so the reset message could not be sent.' };
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Reset your AgroVision password',
    text: `Use this link to choose a new password. It expires in 30 minutes.\n\n${resetUrl}\n\nIf you did not ask for this, you can ignore this message.`,
  });

  return { sent: true };
}

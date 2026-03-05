import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const createTransporter = () => {
  if (env.SMTP_USER && env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return null;
};

const transporter = createTransporter();

export const emailService = {
  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;

    if (!transporter) {
      console.log('========================================');
      console.log('PASSWORD RESET EMAIL (SMTP not configured)');
      console.log(`To: ${to}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('========================================');
      return;
    }

    await transporter.sendMail({
      from: `"TodoApp" <${env.SMTP_FROM}>`,
      to,
      subject: 'Password Reset Request',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Password Reset</h2>
          <p style="color: #666; font-size: 16px;">
            You requested a password reset. Click the button below to set a new password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">
            TodoApp
          </p>
        </div>
      `,
    });
  },
};

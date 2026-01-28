import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtpout.secureserver.net',
      port: Number(process.env.MAIL_PORT || 465),
      secure: String(process.env.MAIL_SECURE || 'true') === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });
  }

  async sendResetLink(to: string, link: string) {
    const from = process.env.MAIL_FROM || process.env.MAIL_USER || '';
    await this.transporter.sendMail({
      from,
      to,
      subject: 'Reset your password',
      html: this.template(link),
    });
  }

  private template(link: string) {
    const year = new Date().getFullYear();

    return `
    <div style="margin:0;padding:0;background:#f5f7ff;">
      <div style="max-width:640px;margin:0 auto;padding:28px 14px;">

        <!-- Header -->
        <div style="
          background:linear-gradient(135deg,#4F46E5 0%,#06B6D4 100%);
          border-radius:16px 16px 0 0;
          padding:22px 22px;
          color:#ffffff;
          box-shadow:0 18px 40px rgba(15,23,42,0.12);
        ">
          <div style="font-size:18px;font-weight:800;letter-spacing:0.4px;">
            Connect Bankers
          </div>
          <div style="font-size:12px;opacity:0.9;margin-top:4px;">
            Secure account access
          </div>
        </div>

        <!-- Body -->
        <div style="
          background:#ffffff;
          border-radius:0 0 16px 16px;
          padding:24px 22px 18px;
          border:1px solid rgba(226,232,240,0.9);
          border-top:none;
          box-shadow:0 18px 40px rgba(15,23,42,0.10);
        ">
          <h2 style="margin:0 0 10px;color:#0f172a;font-size:20px;">
            Reset your password
          </h2>

          <p style="margin:0 0 14px;color:#475569;font-size:14px;line-height:1.6;">
            We received a request to reset your ConnectBankers password.
            Click the button below to set a new password.
          </p>

          <div style="
            background:rgba(99,102,241,0.08);
            border:1px solid rgba(99,102,241,0.18);
            padding:12px 14px;
            border-radius:12px;
            margin-bottom:18px;
            color:#334155;
            font-size:13px;
          ">
            ⏳ This reset link is valid for <b>15 minutes</b>.
          </div>

          <!-- Button -->
          <div style="text-align:center;margin:20px 0;">
            <a href="${link}" style="
              display:inline-block;
              background:linear-gradient(90deg,#2563eb,#4f46e5);
              color:#ffffff;
              padding:12px 20px;
              border-radius:12px;
              text-decoration:none;
              font-weight:700;
              font-size:14px;
            ">
              Reset Password
            </a>
          </div>

          <p style="margin:0 0 10px;color:#64748b;font-size:13px;">
            If you did not request this, you can safely ignore this email.
          </p>

          <p style="margin:0;color:#94a3b8;font-size:12px;">
            Or copy this link:
            <br/>
            <span style="word-break:break-all;color:#2563eb;">${link}</span>
          </p>

          <hr style="border:none;border-top:1px solid #e2e8f0;margin:18px 0;" />

        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;"> <p style="margin:0;color:#94a3b8;font-size:12px;"> © ${year} ConnectBankers </p>
           <p style="margin:0;color:#94a3b8;font-size:12px;"> Need help? <a href="mailto:support@connectbankers.com" style="color:#2563eb;text-decoration:none;">support@connectbankers.com</a> </p>
          </div>
        </div>

       <p style="margin:14px 0 0;color:#94a3b8;font-size:11px;text-align:center;line-height:1.6;"> This is an automated email from ConnectBankers. Please do not reply. </p>

      </div>
    </div>
    `;
  }
}

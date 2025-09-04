// pages/api/send.js
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';
import dotenv from 'dotenv';

dotenv.config();

const resendClient = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { firstName, email, subject, message } = req.body;

  // Validate required fields
  if (!firstName || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  // ✅ Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const internalEmailOptions = {
    from: 'Trevor Twomey Photo <info@trevortwomeyphoto.com>',
    to: process.env.NOTIFY_EMAIL || process.env.EMAIL_USER,
    subject: `[NEW MESSAGE] ${subject}`,
    html: `
      <div style="font-family: sans-serif;">
        <h2>📬 New message from ${firstName}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <div style="padding: 10px; background: #f4f4f4; border-radius: 4px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p>Sent via <strong>Contact Form</strong> on trevortwomeyphoto.com</p>
      </div>
    `,
  };

  try {
    // ✅ Send email to internal address (you)
    await transporter.sendMail(internalEmailOptions);

    // ✅ Send confirmation email to user via Resend
    const response = await resendClient.emails.send({
      from: 'Trevor Twomey <info@trevortwomeyphoto.com>',
      to: [email],
      subject: 'Thanks for reaching out!',
      react: EmailTemplate({ firstName }),
    });

    if (response.id) {
      return res.status(200).json({ success: true, message: 'Emails sent successfully!' });
    } else {
      console.warn('⚠️ Resend response:', response);
      return res.status(200).json({ success: true, message: 'Internal email sent, but confirmation email failed.' });
    }
  } catch (error) {
    console.error('❌ Email send error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

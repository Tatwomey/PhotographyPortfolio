import nodemailer from 'nodemailer';
import { Resend } from 'resend'; // Adjust if 'Resend' is not the correct import
import { EmailTemplate } from '@/components/email-template';
import dotenv from 'dotenv';

dotenv.config();

// Initialize your Resend client with the API key
const resendClient = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { firstName, email, subject, message } = req.body;

  // Set up your SMTP server credentials for nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Trevortwomeyphoto <info@trevortwomeyphoto.com>',
    to: email,
    subject: subject,
    text: `Name: ${firstName}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    // First, send the email from the user to your address
    await transporter.sendMail(mailOptions);

    // Then, send a confirmation/thank-you email to the user using the Resend service
    const response = await resendClient.emails.send({
      from: "Trevor Twomey Photo <info@trevortwomeyphoto.com>",
      to: [email], // Send confirmation to the user's email
      subject: "Thanks for reaching out!",
      react: EmailTemplate({ firstName: firstName }),
    });

    // Handle response from Resend service
    if (response.status === 'success') {
      res.status(200).json({ success: true, message: 'Both emails sent successfully!' });
    } else {
      // If Resend service fails, log it, but don't necessarily fail the whole request
      console.error('Resend service did not return success:', response);
      res.status(200).json({ success: true, message: 'Email to Trevor sent, but confirmation email had issues.' });
    }
  } catch (error) {
    console.error('Error in sending emails:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
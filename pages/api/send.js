import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { EmailTemplate } from '@/components/email-template'; // Ensure this path is correct

dotenv.config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address from the .env file
    pass: process.env.EMAIL_PASSWORD, // Your Gmail password from the .env file
  },
});

// send function to be used in your route handling to send an email
export const send = async (data) => {
  const { email, name, message, phone, subject } = data;

  // Assuming EmailTemplate is a function that returns an HTML string for the email body
  const emailBody = EmailTemplate({ name, email, phone, message });

  const mailOptions = {
    from: 'info@trevortwomeyphoto.com', // The email address you want to send from
    to: email, // Recipient's email address
    subject: subject, // Subject line from the form
    text: `Message from: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`, // plain text body
    html: emailBody, // HTML body content from EmailTemplate
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error };
  }
};

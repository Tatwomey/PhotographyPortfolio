// pages/api/sendEmail.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // use environment variable here
        pass: process.env.EMAIL_PASSWORD // use environment variable here
      }
    });

    const mailData = {
      from: email,
      to: process.env.EMAIL_USER, // use environment variable here
      subject: subject,
      text: message,
      html: `<div>${message}</div><p>Sent from: ${name} <${email}></p>`
    };

    transporter.sendMail(mailData, (error, info) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(info);
      }
    });
  } else {
    res.status(405).end();
  }
}

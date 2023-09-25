// pages/api/sendEmail.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'info@trevortwomeyphoto.com',
        pass: 'Manoloi5myfri3nd!!'
      }
    });

    const mailData = {
      from: email,
      to: 'info@trevortwomeyphoto.com',
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

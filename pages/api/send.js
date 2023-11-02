const { EmailTemplate } = require('../components/email-template');
const { Resend } = require('resend');


const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  

  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['info@trevortwomeyphoto.com'],
      subject: subject || 'Hello world',
      react: EmailTemplate({ firstName, lastName, email, message }),
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(400).json({ error: 'Failed to send the email' });
  }
}

import EmailTemplate from '../components/email-template';

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req, res) => {
  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['info@trevortwomeyphoto.com'],
      subject: 'Hello world',
      react: EmailTemplate({ firstName: 'John' }),
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
}

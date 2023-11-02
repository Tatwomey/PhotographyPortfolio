const { EmailTemplate } = require('../components/email-template');
const { Resend } = require('resend');
const { NextApiRequest, NextApiResponse } = require('next');

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
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
  } else {
    res.status(405).end();
  }
}

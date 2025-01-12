import sendgrid from '@sendgrid/mail';
import { NextApiRequest, NextApiResponse } from 'next';

const apiKey = process.env.SENDGRID_API_KEY;

if (!apiKey) {
    throw new Error('SENDGRID_API_KEY is not defined');
}

sendgrid.setApiKey(apiKey);

async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!req.body.message || req.body.message === '') {
            throw new Error('Message empty');
        }
        const toEmail = process.env.SENDGRID_TO_EMAIL;
        const fromEmail = process.env.SENDGRID_FROM_EMAIL;

        if (!toEmail || !fromEmail) {
            throw new Error('SENDGRID_TO_EMAIL or SENDGRID_FROM_EMAIL is not defined');
        }

        await sendgrid.send({
            to: toEmail,
            from: fromEmail,
            subject: '[daily.place] Contact',
            content: [
                {
                    type: 'text/html',
                    value: `<div>
					<p>Name: ${req.body.name}</p>
					<p>Email: ${req.body.email}</p>
					<p>Message: ${req.body.message}</p>
					</div>`
                }
            ]
        });
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.log(errorMessage);
        return res.status((error as any).statusCode || 500).json({ error: errorMessage });
    }

    return res.status(200).json({ error: '' });
}

export default sendEmail;

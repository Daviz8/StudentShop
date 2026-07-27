"use server"
import { Resend } from 'resend';
import { EmailTemplate } from '../../components/EmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Student Shop <notifications@studentshopng.com>', // Replace with your verified domain once live
      to: ['studentshopng.info@gmail.com'],
      subject: 'Action Required: New Sell Request Received',
      react: EmailTemplate({ firstName: 'Admin' }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeToNewsletter(prevState, formData) {
  const email = formData.get('email');
  const firstName = formData.get('firstName');

  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please provide a valid email address.' };
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!audienceId) {
    return { success: false, message: 'Audience ID configuration is missing.' };
  }

  try {
    await resend.contacts.create({
      email,
      firstName: firstName || undefined,
      audienceId,
      unsubscribed: false,
    });

    return { success: true, message: 'Thanks for subscribing!' };
  } catch (error) {
    console.error('Resend subscription error:', error);
    return {
      success: false,
      message: 'Failed to subscribe. Please try again later.',
    };
  }
}

export async function unsubscribeFromNewsletter(prevState, formData) {
  const email = formData.get('email');

  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please provide a valid email address.' };
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!audienceId) {
    return { success: false, message: 'Audience ID configuration is missing.' };
  }

  try {
    // Remove the contact from the specified audience list
    await resend.contacts.remove({
      email,
      audienceId,
    });

    return { success: true, message: 'You have been successfully unsubscribed.' };
  } catch (error) {
    console.error('Resend unsubscribe error:', error);
    return {
      success: false,
      message: 'Failed to unsubscribe or email not found.',
    };
  }
}
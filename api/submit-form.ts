import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY environment variable');
      return res.status(500).json({
        error: 'Email service not configured'
      });
    }

    const resend = new Resend(resendApiKey);

    const { name, email, phone, service, location, preferred_date, message, source, page_url } = req.body;

    if (!phone) {
      return res.status(400).json({
        error: 'Phone number is required'
      });
    }

    // Format the email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FFA985 0%, #FFC67D 100%); padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">New Lead from Website</h1>
        </div>

        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; border-bottom: 2px solid #FFA985; padding-bottom: 10px;">Contact Information</h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Name:</td>
              <td style="padding: 10px 0; color: #333;">${name || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 10px 0; color: #333;"><a href="tel:${phone}" style="color: #FFA985;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 10px 0; color: #333;">${email ? `<a href="mailto:${email}" style="color: #FFA985;">${email}</a>` : 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Service Requested:</td>
              <td style="padding: 10px 0; color: #333;">${service || 'Not specified'}</td>
            </tr>
            ${location ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Location:</td>
              <td style="padding: 10px 0; color: #333;">${location}</td>
            </tr>
            ` : ''}
            ${preferred_date ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Preferred Date:</td>
              <td style="padding: 10px 0; color: #333;">${preferred_date}</td>
            </tr>
            ` : ''}
          </table>

          ${message ? `
          <h3 style="color: #333; margin-top: 20px;">Message:</h3>
          <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #FFA985;">
            ${message}
          </div>
          ` : ''}

          <div style="margin-top: 30px; padding: 15px; background: #fff; border-radius: 8px; font-size: 12px; color: #666;">
            <p style="margin: 5px 0;"><strong>Source:</strong> ${source || 'Website'}</p>
            <p style="margin: 5px 0;"><strong>Page:</strong> ${page_url || 'Unknown'}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</p>
          </div>
        </div>

        <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">The Valley Clean Team - Website Lead Notification</p>
        </div>
      </div>
    `;

    const emailText = `
New Lead from Website

Name: ${name || 'Not provided'}
Phone: ${phone}
Email: ${email || 'Not provided'}
Service: ${service || 'Not specified'}
${location ? `Location: ${location}` : ''}
${preferred_date ? `Preferred Date: ${preferred_date}` : ''}
${message ? `\nMessage:\n${message}` : ''}

---
Source: ${source || 'Website'}
Page: ${page_url || 'Unknown'}
Time: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}
    `.trim();

    // Send email to GHL inbox for workflow automation
    const { data, error } = await resend.emails.send({
      from: 'The Valley Clean Team <leads@thevalleycleanteam.com>',
      to: ['leads@thevalleycleanteam.com'],
      subject: `New Lead: ${service || 'Cleaning Service'} - ${name || phone}`,
      html: emailHtml,
      text: emailText,
      replyTo: email || undefined
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      emailId: data?.id
    });

  } catch (error) {
    console.error('Form submission error:', error);
    return res.status(500).json({
      error: 'Failed to submit form',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

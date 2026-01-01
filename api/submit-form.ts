import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const normalizeTextValue = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

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
    const normalizedName = normalizeTextValue(name);
    const normalizedEmail = normalizeTextValue(email);
    const normalizedPhone = normalizeTextValue(phone);
    const normalizedService = normalizeTextValue(service);
    const normalizedLocation = normalizeTextValue(location);
    const normalizedPreferredDate = normalizeTextValue(preferred_date);
    const normalizedMessage = normalizeTextValue(message);
    const normalizedSource = normalizeTextValue(source);
    const normalizedPageUrl = normalizeTextValue(page_url);

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
              <td style="padding: 10px 0; color: #333;">${normalizedName ? escapeHtml(normalizedName) : 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 10px 0; color: #333;"><a href="tel:${escapeHtml(normalizedPhone)}" style="color: #FFA985;">${escapeHtml(normalizedPhone)}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 10px 0; color: #333;">${normalizedEmail ? `<a href="mailto:${escapeHtml(normalizedEmail)}" style="color: #FFA985;">${escapeHtml(normalizedEmail)}</a>` : 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Service Requested:</td>
              <td style="padding: 10px 0; color: #333;">${normalizedService ? escapeHtml(normalizedService) : 'Not specified'}</td>
            </tr>
            ${normalizedLocation ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Location:</td>
              <td style="padding: 10px 0; color: #333;">${escapeHtml(normalizedLocation)}</td>
            </tr>
            ` : ''}
            ${normalizedPreferredDate ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Preferred Date:</td>
              <td style="padding: 10px 0; color: #333;">${escapeHtml(normalizedPreferredDate)}</td>
            </tr>
            ` : ''}
          </table>

          ${normalizedMessage ? `
          <h3 style="color: #333; margin-top: 20px;">Message:</h3>
          <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #FFA985;">
            ${escapeHtml(normalizedMessage)}
          </div>
          ` : ''}

          <div style="margin-top: 30px; padding: 15px; background: #fff; border-radius: 8px; font-size: 12px; color: #666;">
            <p style="margin: 5px 0;"><strong>Source:</strong> ${normalizedSource ? escapeHtml(normalizedSource) : 'Website'}</p>
            <p style="margin: 5px 0;"><strong>Page:</strong> ${normalizedPageUrl ? escapeHtml(normalizedPageUrl) : 'Unknown'}</p>
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

Name: ${normalizedName || 'Not provided'}
Phone: ${normalizedPhone}
Email: ${normalizedEmail || 'Not provided'}
Service: ${normalizedService || 'Not specified'}
${normalizedLocation ? `Location: ${normalizedLocation}` : ''}
${normalizedPreferredDate ? `Preferred Date: ${normalizedPreferredDate}` : ''}
${normalizedMessage ? `\nMessage:\n${normalizedMessage}` : ''}

---
Source: ${normalizedSource || 'Website'}
Page: ${normalizedPageUrl || 'Unknown'}
Time: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}
    `.trim();

    // Send email to GHL inbox for workflow automation
    const { data, error } = await resend.emails.send({
      from: 'The Valley Clean Team <leads@thevalleycleanteam.com>',
      to: ['leads@thevalleycleanteam.com'],
      subject: `New Lead: ${normalizedService || 'Cleaning Service'} - ${normalizedName || normalizedPhone}`,
      html: emailHtml,
      text: emailText,
      replyTo: normalizedEmail || undefined
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

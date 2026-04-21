// Nodemailer — used to notify admin when a contact inquiry arrives

const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host:   process.env.EMAIL_HOST,
    port:   parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send an email
 * @param {object} options - { to, subject, html }
 */
const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from:    process.env.EMAIL_FROM || 'VickyVfx <noreply@vickyvfx.me>',
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    // Log but don't throw — email failure shouldn't break the contact form response
    console.error(`❌ Email failed to send: ${error.message}`);
  }
};

/**
 * Build the HTML email for a new contact inquiry
 */
const newInquiryEmailHTML = (inquiry) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: #0f0f0f; color: #fff; padding: 24px; border-radius: 8px 8px 0 0;">
      <h2 style="margin: 0; color: #a78bfa;">📬 New Contact Inquiry</h2>
      <p style="margin: 4px 0 0; color: #888; font-size: 13px;">VickyVfx Portfolio</p>
    </div>
    <div style="background: #1a1a1a; color: #e5e5e5; padding: 24px; border-radius: 0 0 8px 8px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #888; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: bold;">${inquiry.name}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;"><a href="mailto:${inquiry.email}" style="color: #a78bfa;">${inquiry.email}</a></td></tr>
        ${inquiry.phone    ? `<tr><td style="padding: 8px 0; color: #888;">Phone</td><td style="padding: 8px 0;">${inquiry.phone}</td></tr>` : ''}
        ${inquiry.service  ? `<tr><td style="padding: 8px 0; color: #888;">Service</td><td style="padding: 8px 0;">${inquiry.service}</td></tr>` : ''}
        ${inquiry.budget   ? `<tr><td style="padding: 8px 0; color: #888;">Budget</td><td style="padding: 8px 0;">${inquiry.budget}</td></tr>` : ''}
      </table>
      <hr style="border-color: #333; margin: 16px 0;"/>
      <p style="color: #888; font-size: 13px; margin: 0 0 8px;">Message:</p>
      <p style="background: #111; padding: 16px; border-radius: 6px; margin: 0; line-height: 1.6;">${inquiry.message}</p>
      <div style="margin-top: 24px; text-align: center;">
        <a href="${process.env.ADMIN_URL}/admin/inquiries" style="background: #7c3aed; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px;">View in Admin Panel</a>
      </div>
    </div>
  </div>
`;

module.exports = { sendEmail, newInquiryEmailHTML };
// lib/emailService.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendInvitationEmail = async (email, name, token) => {
  const registrationLink = `https://mdi-connect-v2.vercel.app/auth/register?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Complete Your Registration - MDI Connect',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to MDI Connect!</h2>
        <p>Hello ${name},</p>
        <p>You have been invited to join MDI Connect by an administrator. Please complete your registration by clicking the link below:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${registrationLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Complete Registration
          </a>
        </p>
        <p>This invitation link will expire in 7 days.</p>
        <p>If you did not request this invitation, please ignore this email.</p>
        <hr>
        <p style="color: #6b7280; font-size: 14px;">
          MDI Connect Team<br>
          Mining, Tourism & Manufacturing Job Platform
        </p>
      </div>
    `
  };
    console.log('Sending invitation email to:', email);
  console.log('Registration link:', registrationLink);
  await transporter.sendMail(mailOptions);
  return Promise.resolve();
};

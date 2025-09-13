// lib/emailService.js
import nodemailer from 'nodemailer';

// Create transporter with better configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD // Use app password here
    },
    // Additional settings for better reliability
    pool: true,
    maxConnections: 1,
    rateDelta: 20000,
    rateLimit: 5
  });
};

export const sendInvitationEmail = async (email, name, token, temporaryPassword) => {
  const registrationLink = `${process.env.NEXTAUTH_URL || 'https://mdi-connect-v2.vercel.app/auth/complete-registration'}?token=${token}`;
  
  const mailOptions = {
    from: {
      name: 'MDI Connect',
      address: process.env.EMAIL_USER
    },
    to: email,
    subject: 'Complete Your Registration - MDI Connect',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to MDI Connect!</h2>
        <p>Hello ${name},</p>
        <p>You have been invited to join MDI Connect by an administrator. Here are your temporary login credentials:</p>
        
        <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 8px 0 0 0;"><strong>Temporary Password:</strong> ${temporaryPassword}</p>
        </div>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="${registrationLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Complete Registration
          </a>
        </p>
        
        <p><strong>Important:</strong> Please change your password after logging in for the first time.</p>
        <p>This invitation link will expire in 7 days.</p>
        <hr>
        <p style="color: #6b7280; font-size: 14px;">
          MDI Connect Team<br>
          Mining, Tourism & Manufacturing Job Platform
        </p>
      </div>
    `,
    // Text version for email clients that don't support HTML
    text: `
      Welcome to MDI Connect!
      
      Hello ${name},
      
      You have been invited to join MDI Connect by an administrator. Here are your temporary login credentials:
      
      Email: ${email}
      Temporary Password: ${temporaryPassword}
      
      Complete your registration here: ${registrationLink}
      
      Important: Please change your password after logging in for the first time.
      This invitation link will expire in 7 days.
      
      MDI Connect Team
      Mining, Tourism & Manufacturing Job Platform
    `
  };
  
  console.log('Sending invitation email to:', email);
  console.log('Registration link:', registrationLink);
  
  try {
    const transporter = createTransporter();
    await transporter.verify(); // Verify connection configuration
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
    return Promise.resolve();
  } catch (error) {
    console.error('Error sending email to:', email, error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
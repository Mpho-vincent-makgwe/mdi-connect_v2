// pages/api/auth/validate-invitation.js
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invitation token is required' 
      });
    }

    const user = await User.findOne({ 
      invitationToken: token,
      invitationExpires: { $gt: new Date() }
    }).select('name email role');

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired invitation token' 
      });
    }

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error validating invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate invitation'
    });
  }
}
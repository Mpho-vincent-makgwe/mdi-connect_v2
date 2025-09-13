// app/api/auth/complete-registration/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await dbConnect();

    const { invitationToken, email, oldPassword, role, newPassword } = await request.json();

    console.log('Received complete registration request:', { 
      email, 
      hasInvitationToken: !!invitationToken, 
      hasOldPassword: !!oldPassword, 
      hasNewPassword: !!newPassword, 
      role 
    });

    // Validate required fields
    if (!email || !oldPassword || !newPassword || !invitationToken) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email, invitation token, old password and new password are required' 
      }, { status: 400 });
    }

    // Find user by email and include the sensitive fields needed for verification
    const user = await User.findOne({ email, invitationToken })
      .select('+password +temporaryPassword +invitationToken +invitationExpires +isTemporaryPassword');

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found or invalid invitation token' 
      }, { status: 400 });
    }

    // Ensure invitation token matches and is not expired
    if (!user.invitationToken || user.invitationToken !== invitationToken) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid invitation token' 
      }, { status: 400 });
    }

    if (user.invitationExpires && user.invitationExpires < new Date()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invitation has expired' 
      }, { status: 400 });
    }

    // Verify the password - either temporary (hashed) or the existing password (hashed)
    let isPasswordValid = false;

    // If user has a hashed temporary password and isTemporaryPassword flag set
    if (user.isTemporaryPassword && user.temporaryPassword) {
      isPasswordValid = await bcrypt.compare(oldPassword, user.temporaryPassword);
      console.log('Temporary password validation result:', isPasswordValid);
    }

    // If not valid yet and a regular password exists, try comparing with it
    if (!isPasswordValid && user.password) {
      isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      console.log('Regular password validation result:', isPasswordValid);
    }

    if (!isPasswordValid) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid temporary password' 
      }, { status: 400 });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Apply updates
    user.password = hashedNewPassword;
    if (role) user.role = role;
    user.isActive = true;

    // Clear invitation fields
    user.invitationToken = undefined;
    user.invitationExpires = undefined;
    user.temporaryPassword = undefined;
    user.isTemporaryPassword = false;
    user.invitationSent = true;

    await user.save();

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      console.warn('JWT_SECRET not set. Returning user without token.');
    }
    const token = process.env.JWT_SECRET ? jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' }) : null;

    // Prepare user object for response
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      completedQuestionnaire: user.completedQuestionnaire,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json({
      success: true,
      message: 'Registration completed successfully',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Complete registration error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error', 
      error: error.message 
    }, { status: 500 });
  }
}
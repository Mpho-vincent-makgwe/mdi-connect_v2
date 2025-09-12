import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendInvitationEmail } from '@/lib/emailService';
import { generateToken } from '@/lib/utils';

export async function POST(request) {
  await dbConnect();

  try {
    const { name, email, role = 'unskilled' } = await request.json();

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate invitation token and temporary password
    const invitationToken = generateToken();
    const temporaryPassword = Math.random().toString(36).slice(-8); // 8-character random password
    
    const invitationExpires = new Date();
    invitationExpires.setDate(invitationExpires.getDate() + 7);

    // Create user with invitation details and temporary password
    const user = await User.create({
      name,
      email,
      password: temporaryPassword, // Store as plain text temporarily
      role,
      invitedByAdmin: true,
      invitationToken,
      invitationExpires,
      temporaryPassword, // Store unencrypted for verification
      isTemporaryPassword: true,
      isActive: false
    });

    // Send invitation email with temporary password
    try {
      await sendInvitationEmail(email, name, invitationToken, temporaryPassword);
      
      // Update user to mark invitation as sent
      await User.findByIdAndUpdate(user._id, { 
        invitationSent: true 
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Delete the user if email fails
      await User.findByIdAndDelete(user._id);
      return NextResponse.json(
        { success: false, message: 'Failed to send invitation email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User invited successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error inviting user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to invite user' },
      { status: 500 }
    );
  }
}
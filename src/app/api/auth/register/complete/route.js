import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  await dbConnect();

  try {
    const { invitationToken, email, oldPassword, role, newPassword } = await request.json();

    if (!invitationToken || !email || !oldPassword || !role || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Find user by invitation token
    const user = await User.findOne({
      invitationToken,
      invitationExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired invitation token' },
        { status: 400 }
      );
    }

    // Verify the old/temporary password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid temporary password' },
        { status: 400 }
      );
    }

    // Update user with new password and role
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    user.password = hashedPassword;
    user.role = role;
    user.invitationToken = undefined;
    user.invitationExpires = undefined;
    user.invitedByAdmin = false;
    user.temporaryPassword = false;
    
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Registration completed successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error completing registration:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to complete registration' },
      { status: 500 }
    );
  }
}
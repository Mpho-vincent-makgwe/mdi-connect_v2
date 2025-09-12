// app/api/admin/users/invite/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendInvitationEmail } from '@/lib/emailService';
import { generateToken } from '@/lib/utils';

export async function POST(request) {
  await dbConnect();

  try {
    const { name, email, role = 'unskilled' } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate invitation token
    const invitationToken = generateToken();
    const invitationExpires = new Date();
    invitationExpires.setDate(invitationExpires.getDate() + 7); // Expires in 7 days

    // Create user with invitation details
    const user = await User.create({
      name,
      email,
      role,
      invitedByAdmin: true,
      invitationToken,
      invitationExpires
    });

    // Send invitation email
    await sendInvitationEmail(email, name, invitationToken);

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
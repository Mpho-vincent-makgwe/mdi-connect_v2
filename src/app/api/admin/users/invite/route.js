// app/api/invite/route.js  (or wherever your invitation POST lives)
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendInvitationEmail } from '@/lib/emailService';
import { generateToken } from '@/lib/utils';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  await dbConnect();

  try {
    const { name, email, role = 'unskilled' } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ success: false, message: 'Name and email are required' }, { status: 400 });
    }

    // Ensure user does not already exist
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User with this email already exists' }, { status: 400 });
    }

    // Generate unique invitation token (retry on collision)
    let invitationToken = generateToken();
    let collision = await User.findOne({ invitationToken }).lean();
    let tries = 0;
    while (collision && tries < 5) {
      invitationToken = generateToken();
      collision = await User.findOne({ invitationToken }).lean();
      tries++;
    }
    if (collision) {
      // Extremely unlikely, but handle gracefully
      return NextResponse.json({ success: false, message: 'Failed generating unique invitation token. Try again.' }, { status: 500 });
    }

    // Generate plaintext temporary password to send to user, then store only hashed value
    const plainTemporaryPassword = Math.random().toString(36).slice(-8);
    const hashedTemporaryPassword = await bcrypt.hash(plainTemporaryPassword, 10);

    const invitationExpires = new Date();
    invitationExpires.setDate(invitationExpires.getDate() + 7); // 7 days

    // Create user record: store hashed temporary password in temporaryPassword, do not set `password` so user can't fully login until they complete registration
    const userData = {
      name,
      email,
      role,
      invitedByAdmin: true,
      invitationToken,
      invitationExpires,
      temporaryPassword: hashedTemporaryPassword,
      isTemporaryPassword: true,
      isActive: false,
      invitationSent: false
    };

    const user = await User.create(userData);

    // Send invitation email with plaintext temporary password and invitationToken link
    try {
      await sendInvitationEmail(email, name, invitationToken, plainTemporaryPassword);
      // Mark invitation as sent
      await User.findByIdAndUpdate(user._id, { invitationSent: true });
    } catch (emailError) {
      // If email sending fails, delete the created user and return error
      await User.findByIdAndDelete(user._id);
      console.error('Email sending failed:', emailError);
      return NextResponse.json({ success: false, message: 'Failed to send invitation email. Please check email configuration.' }, { status: 500 });
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
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: 'User with this email or invitation token already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Failed to invite user: ' + error.message }, { status: 500 });
  }
}

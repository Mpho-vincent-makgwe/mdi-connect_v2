// app/api/auth/validate-invitation/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ success: false, message: 'Token is required' }, { status: 400 });
    }

    // Include sensitive fields needed for validation
    const user = await User.findOne({
      invitationToken: token,
      invitationExpires: { $gt: new Date() }
    }).select('+invitationToken +invitationExpires +temporaryPassword +isTemporaryPassword');

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid or expired invitation' }, { status: 400 });
    }

    // Return only the necessary user data
    return NextResponse.json({ 
      success: true, 
      user: { 
        _id: user._id,
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Validate invitation error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      invitationToken: token,
      invitationExpires: { $gt: new Date() }
    }).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired invitation token' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error validating invitation:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to validate invitation' },
      { status: 500 }
    );
  }
}
// pages/api/auth/register.js
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  await dbConnect();
  
  try {
    const body = await request.json();
    const { name, email, password, role, invitationToken } = body;
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user was invited by admin
    if (!invitationToken) {
      return NextResponse.json(
        { success: false, message: 'Registration requires an invitation' },
        { status: 400 }
      );
    }

    // Find user by invitation token
    const invitedUser = await User.findOne({ 
      invitationToken,
      invitationExpires: { $gt: new Date() }
    });

    if (!invitedUser || invitedUser.email !== email) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired invitation' },
        { status: 400 }
      );
    }

    // Update the user with password and clear invitation fields
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      invitedUser._id,
      {
        password: hashedPassword,
        invitationToken: null,
        invitationExpires: null
      },
      { new: true }
    );

    const token = jwt.sign(
      { id: updatedUser._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    const userData = updatedUser.toObject();
    delete userData.password;
    
    return NextResponse.json({
      success: true,
      token,
      user: userData
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed', error: error.message },
      { status: 500 }
    );
  }
}
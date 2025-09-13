import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export async function POST(request) {
  await dbConnect();
  
  try {
    const { email, password } = await request.json();
    console.log(`Login attempt for: ${email}`);
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    console.log('User found:', user.email);
    console.log('User has password:', !!user.password);
    console.log('User is active:', user.isActive);
    
    // Check if user is active (only if you have this field)
    if (user.isActive === false) {
      console.log('User account not active');
      return NextResponse.json(
        { success: false, message: 'Account not activated' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);
    
    if (!isMatch) {
      console.log('Password does not match');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    const userData = user.toObject();
    delete userData.password;
    
    console.log('Login successful');
    
    return NextResponse.json({
      success: true,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed', error: error.message },
      { status: 500 }
    );
  }
}
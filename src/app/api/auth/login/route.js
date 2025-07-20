import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export async function POST(request) {
  await dbConnect();
  
  try {
    const { email, password } = await request.json();
    console.log(`Password and email from front end${password}${email}`)
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    const isMatch6 = await bcrypt.compare(password, user.password);
    console.log("is match? :", isMatch6);
    // Direct password comparison if method still not available
    const isMatch = (password === user.password);
    if (!isMatch6) {
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
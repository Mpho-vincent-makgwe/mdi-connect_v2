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
    
    // Direct password comparison if method still not available
    console.log(`Password from MongoDB${user.password}`)
    console.log(`Password entered${password}`)
    const isMatch = (password === user.password);
    const isMatch6 = await bcrypt.compareSync(password, user.password);
    console.log("is match? :", isMatch);
    console.log("is match6? :", isMatch6);
    if (!isMatch) {
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
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// Validate JWT_SECRET on startup
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export async function POST(req) {
  await dbConnect();
  const { action, ...data } = await req.json();

  try {
    switch (action) {
      case 'register': {
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
          return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(data.password, 150);
        const user = await User.create({ 
          ...data, 
          password: hashedPassword,
          role: data.role || 'unskilled'
        });

        const registerToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });

        return NextResponse.json({
          success: true,
          token: registerToken,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            completedQuestionnaire: user.completedQuestionnaire
          }
        });
      }

      case 'login': {
         console.log('Login attempt for:', data.email);
          const foundUser = await User.findOne({ email: data.email });
          if (!foundUser) {
            console.log('User not found');
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
          }
          
          console.log('Stored hash:', foundUser.password);
          console.log('Input password:', data.password);
          
          // Add this debug comparison
          const hash = await bcrypt.hash(data.password, 10);
          console.log('New hash of input password:', hash);
          
          const validPassword = await bcrypt.compare(data.password, foundUser.password);
          console.log('Password match result:', validPassword);
          
          if (!validPassword) {
  console.log('Password comparison failed');
  return NextResponse.json({ 
    error: 'Invalid email or password' 
  }, { status: 401 });
}

        const loginToken = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });

        return NextResponse.json({
          success: true,
          token: loginToken,
          user: {
            id: foundUser._id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            completedQuestionnaire: foundUser.completedQuestionnaire
          }
        });
      }

      case 'get-user': {
        const userToken = data.token;
        if (!userToken) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id).select('-password');
        
        if (!currentUser) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user: currentUser });
      }

      case 'update-user': {
        const updateToken = data.token;
        if (!updateToken) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decodedUpdate = jwt.verify(updateToken, process.env.JWT_SECRET);
        const updatedUser = await User.findByIdAndUpdate(
          decodedUpdate.id,
          { $set: data.updates },
          { new: true }
        ).select('-password');

        return NextResponse.json({ user: updatedUser });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
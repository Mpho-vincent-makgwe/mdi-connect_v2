import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// GET /api/users/me - Get current user profile
export async function GET(request) {
  await dbConnect();
  
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
        sector: user.sector,
        experience: user.experience,
        yearsOfExperience: user.yearsOfExperience,
        qualifications: user.qualifications,
        educationLevel: user.educationLevel,
        currentlyStudying: user.currentlyStudying,
        completedQuestionnaire: user.completedQuestionnaire,
        notificationsEnabled: user.notificationsEnabled !== false // default to true
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile', error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/users/me - Update current user profile
export async function PUT(request) {
  await dbConnect();
  
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    const updates = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Only allow specific fields to be updated
    const allowedUpdates = {
      name: updates.name,
      email: updates.email,
      phone: updates.phone,
      location: updates.location,
      notificationsEnabled: updates.notificationsEnabled,
      // Questionnaire fields
      sector: updates.sector,
      experience: updates.experience,
      yearsOfExperience: updates.yearsOfExperience,
      qualifications: updates.qualifications,
      educationLevel: updates.educationLevel,
      currentlyStudying: updates.currentlyStudying,
      completedQuestionnaire: updates.completedQuestionnaire
    };
    
    // Remove undefined fields
    Object.keys(allowedUpdates).forEach(key => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key];
      }
    });

    // Validate email if being updated
    if (allowedUpdates.email) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(allowedUpdates.email)) {
        return NextResponse.json(
          { success: false, message: 'Please enter a valid email address' },
          { status: 400 }
        );
      }
      
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email: allowedUpdates.email,
        _id: { $ne: decoded.id }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'Email is already in use' },
          { status: 400 }
        );
      }
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
        sector: user.sector,
        experience: user.experience,
        yearsOfExperience: user.yearsOfExperience,
        qualifications: user.qualifications,
        educationLevel: user.educationLevel,
        currentlyStudying: user.currentlyStudying,
        completedQuestionnaire: user.completedQuestionnaire,
        notificationsEnabled: user.notificationsEnabled !== false
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Update failed', error: error.message },
      { status: 500 }
    );
  }
}
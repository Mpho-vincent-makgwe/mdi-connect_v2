import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

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
      sector: updates.sector,
      experience: updates.experience,
      yearsOfExperience: updates.yearsOfExperience,
      qualifications: updates.qualifications,
      educationLevel: updates.educationLevel,
      currentlyStudying: updates.currentlyStudying,
      completedQuestionnaire: updates.completedQuestionnaire,
      role: updates.role
    };
    
    // Remove undefined fields
    Object.keys(allowedUpdates).forEach(key => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { $set: allowedUpdates },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Update failed', error: error.message },
      { status: 500 }
    );
  }
}
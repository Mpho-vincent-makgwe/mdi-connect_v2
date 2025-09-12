import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Interview from '@/models/Interview';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

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
    
    // Check if user is admin
    const user = await User.findById(decoded.id);
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get interview stats
    const totalInterviews = await Interview.countDocuments();
    const scheduledInterviews = await Interview.countDocuments({ status: 'scheduled' });
    const completedInterviews = await Interview.countDocuments({ status: 'completed' });
    const canceledInterviews = await Interview.countDocuments({ status: 'canceled' });

    return NextResponse.json({
      success: true,
      data: {
        totalInterviews,
        scheduledInterviews,
        completedInterviews,
        canceledInterviews
      }
    });
  } catch (error) {
    console.error("Error fetching interview stats:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch interview stats', error: error.message },
      { status: 500 }
    );
  }
}
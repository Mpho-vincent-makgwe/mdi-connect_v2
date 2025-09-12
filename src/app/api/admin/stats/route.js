import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Job from '@/models/Job';
import Application from '@/models/Application';
import Interview from '@/models/Interview';
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

    // Get stats
    const [
      totalUsers,
      totalJobs,
      totalApplications,
      totalInterviews,
      activeJobs,
      closedJobs
    ] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Interview.countDocuments(),
      Job.countDocuments({ status: 'Open' }),
      Job.countDocuments({ status: 'Closed' })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalJobs,
        totalApplications,
        totalInterviews,
        activeJobs,
        closedJobs
      }
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats', error: error.message },
      { status: 500 }
    );
  }
}
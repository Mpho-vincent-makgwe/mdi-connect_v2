// app/api/admin/users/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Application from '@/models/Application';
import jwt from 'jsonwebtoken';

export async function GET(request, { params }) {
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
    const adminUser = await User.findById(decoded.id);
    if (adminUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Get user with applications
    const user = await User.findById(id)
      .select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get detailed applications
    const applications = await Application.find({ user: id })
      .populate('job', 'title company')
      .sort({ appliedDate: -1 });

    return NextResponse.json({
      success: true,
      data: {
        ...user.toObject(),
        applications: applications.map(app => ({
          _id: app._id,
          jobTitle: app.job?.title,
          company: app.job?.company,
          status: app.status,
          appliedDate: app.appliedDate
        }))
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user', error: error.message },
      { status: 500 }
    );
  }
}
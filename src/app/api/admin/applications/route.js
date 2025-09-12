import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Application from '@/models/Application';
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('user', 'name email')
      .populate('job', 'title company')
      .skip(skip)
      .limit(limit)
      .sort({ appliedDate: -1 });
      console.log("application:", applications)

    const totalApplications = await Application.countDocuments(query);
    const totalPages = Math.ceil(totalApplications / limit);

    return NextResponse.json({
      success: true,
      data: {
        applications: applications.map(app => ({
          _id: app._id,
          name: app.user?.name,
          email: app.user?.email,
          phone: app.user?.phone,
          jobTitle: app.job?.title,
          company: app.job?.company,
          status: app.status,
          appliedDate: app.appliedDate,
          resume: app.resume,
          coverLetter: app.coverLetter
        })),
        totalApplications,
        totalPages,
        currentPage: page
      }
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch applications', error: error.message },
      { status: 500 }
    );
  }
}
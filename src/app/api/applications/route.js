import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Application from '@/models/Application';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  await dbConnect();
  
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find all applications for this user
    const applications = await Application.find({ user: userId })
      .populate('job', 'title company') // Optional: populate job details
      .lean();

    return NextResponse.json({
      success: true,
      data: applications.map(app => ({
        _id: app._id,
        user: app.user,
        job: app.job?._id || app.job, // Ensure consistent job ID format
        status: app.status,
        appliedDate: app.appliedDate,
        resume: app.resume,
        coverLetter: app.coverLetter
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
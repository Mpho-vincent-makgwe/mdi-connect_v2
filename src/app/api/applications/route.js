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
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const applications = await Application.find({ user: decoded.id })
      .populate('job', 'title company')
      .sort({ appliedDate: -1 });

    // console.log("Backend applications:", applications);
    
    return NextResponse.json({ 
      success: true, 
      data: applications.map(app => ({
        id: app._id,
        jobTitle: app.job?.title,
        company: app.job?.company,
        status: app.status,
        appliedDate: app.appliedDate,
        resume: app.resume,
        coverLetter: app.coverLetter
      }))
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch applications', error: error.message },
      { status: 500 }
    );
  }
}
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
    const applications = await Application.find({ userId: decoded.id })
      .populate('jobId', 'title company');
    
    return NextResponse.json({ 
      success: true, 
      data: applications.map(app => ({
        id: app._id,
        jobTitle: app.jobId?.title,
        company: app.jobId?.company,
        status: app.status,
        appliedDate: app.appliedDate
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch applications', error: error.message },
      { status: 500 }
    );
  }
}
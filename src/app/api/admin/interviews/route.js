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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const interviews = await Interview.find(query)
      .populate('user', 'name email')
      .populate({
        path: 'application',
        populate: {
          path: 'job',
          select: 'title company'
        }
      })
      .sort({ date: 1 });

    return NextResponse.json({
      success: true,
      data: interviews.map(interview => ({
        _id: interview._id,
        userName: interview.user?.name,
        userEmail: interview.user?.email,
        jobTitle: interview.application?.job?.title,
        company: interview.application?.job?.company,
        date: interview.date,
        type: interview.type,
        status: interview.status,
        interviewerName: interview.interviewerName,
        interviewerEmail: interview.interviewerEmail,
        location: interview.location,
        meetingLink: interview.meetingLink,
        notes: interview.notes
      }))
    });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch interviews', error: error.message },
      { status: 500 }
    );
  }
}